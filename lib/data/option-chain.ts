import type { OiSnapshot } from "@/lib/mock-data";

// -----------------------------------------------------------------------------
// NSE's option-chain endpoint needs the same cookie handshake as the FII/DII
// one, and is generally the most fragile data source in this app — it gets
// blocked from cloud IPs more often than the plain FII/DII or quote
// endpoints. Always have a fallback ready (see getLiveOiSnapshots below).
// -----------------------------------------------------------------------------

const NSE_HOME = "https://www.nseindia.com/";
const NSE_OPTION_CHAIN_URL =
  "https://www.nseindia.com/api/option-chain-indices?symbol=";

const BROWSER_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  Accept: "*/*",
  "Accept-Language": "en-US,en;q=0.9",
  Referer: "https://www.nseindia.com/option-chain",
};

type NseOptionLeg = { openInterest: number };
type NseOptionRow = {
  strikePrice: number;
  expiryDate: string;
  CE?: NseOptionLeg;
  PE?: NseOptionLeg;
};
type NseOptionChainResponse = {
  records: {
    expiryDates: string[];
    data: NseOptionRow[];
    underlyingValue?: number;
  };
};

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

function parseNseDate(d: string): Date {
  const [day, mon, year] = d.split("-");
  return new Date(Number(year), MONTHS.indexOf(mon), Number(day));
}

function daysBetween(from: Date, to: Date): number {
  const ms = to.getTime() - from.getTime();
  return Math.max(0, Math.round(ms / (1000 * 60 * 60 * 24)));
}

function formatOi(n: number): string {
  return `${(n / 100000).toFixed(1)}L`;
}

async function fetchOptionChainFor(
  symbol: "NIFTY" | "BANKNIFTY"
): Promise<OiSnapshot> {
  const homeRes = await fetch(NSE_HOME, {
    headers: BROWSER_HEADERS,
    cache: "no-store",
  });
  const setCookie = homeRes.headers.get("set-cookie") ?? "";
  const cookie = setCookie
    .split(",")
    .map((c) => c.split(";")[0])
    .filter(Boolean)
    .join("; ");

  const res = await fetch(`${NSE_OPTION_CHAIN_URL}${symbol}`, {
    headers: { ...BROWSER_HEADERS, Cookie: cookie },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`NSE option chain responded ${res.status} for ${symbol}`);
  }

  const json = (await res.json()) as NseOptionChainResponse;
  const { expiryDates, data, underlyingValue } = json.records;

  if (!expiryDates?.length || !data?.length) {
    throw new Error(`Unexpected option chain shape for ${symbol}`);
  }

  const nearestExpiry = expiryDates[0];
  const rows = data.filter((r) => r.expiryDate === nearestExpiry);

  let totalCallOi = 0;
  let totalPutOi = 0;
  for (const row of rows) {
    totalCallOi += row.CE?.openInterest ?? 0;
    totalPutOi += row.PE?.openInterest ?? 0;
  }
  const pcr = totalCallOi > 0 ? totalPutOi / totalCallOi : 0;

  const topCallOi = [...rows]
    .filter((r) => r.CE)
    .sort((a, b) => b.CE!.openInterest - a.CE!.openInterest)
    .slice(0, 2)
    .map((r) => ({ strike: r.strikePrice, oi: formatOi(r.CE!.openInterest) }));

  const topPutOi = [...rows]
    .filter((r) => r.PE)
    .sort((a, b) => b.PE!.openInterest - a.PE!.openInterest)
    .slice(0, 2)
    .map((r) => ({ strike: r.strikePrice, oi: formatOi(r.PE!.openInterest) }));

  // Max pain: the strike where option writers collectively owe the least if
  // the underlying settles there — found by testing every strike as the
  // hypothetical settlement price and summing what all ITM options would be
  // worth at expiry.
  let maxPain = rows[0]?.strikePrice ?? 0;
  let minPayout = Infinity;
  for (const k of rows.map((r) => r.strikePrice)) {
    let payout = 0;
    for (const row of rows) {
      payout += (row.CE?.openInterest ?? 0) * Math.max(k - row.strikePrice, 0);
      payout += (row.PE?.openInterest ?? 0) * Math.max(row.strikePrice - k, 0);
    }
    if (payout < minPayout) {
      minPayout = payout;
      maxPain = k;
    }
  }

  // OI-based support/resistance: the standard method F&O traders use.
  // Resistance = the strikes AT OR ABOVE spot with the heaviest Call OI
  // (writers defending that level). Support = strikes AT OR BELOW spot with
  // the heaviest Put OI. This is anchored to spot, so it can never land on
  // the wrong side of the current price the way a fixed prior-day pivot can.
  let oiSupport: [number, number] | undefined;
  let oiResistance: [number, number] | undefined;

  if (typeof underlyingValue === "number") {
    const callsAboveSpot = rows
      .filter((r) => r.CE && r.strikePrice >= underlyingValue)
      .sort((a, b) => b.CE!.openInterest - a.CE!.openInterest)
      .slice(0, 2)
      .map((r) => r.strikePrice)
      .sort((a, b) => a - b); // nearest to spot first

    const putsBelowSpot = rows
      .filter((r) => r.PE && r.strikePrice <= underlyingValue)
      .sort((a, b) => b.PE!.openInterest - a.PE!.openInterest)
      .slice(0, 2)
      .map((r) => r.strikePrice)
      .sort((a, b) => b - a); // nearest to spot first

    if (callsAboveSpot.length === 2) {
      oiResistance = [callsAboveSpot[0], callsAboveSpot[1]];
    }
    if (putsBelowSpot.length === 2) {
      oiSupport = [putsBelowSpot[0], putsBelowSpot[1]];
    }
  }

  return {
    symbol,
    expiry: nearestExpiry,
    daysToExpiry: daysBetween(new Date(), parseNseDate(nearestExpiry)),
    pcr: Math.round(pcr * 100) / 100,
    maxPain,
    topCallOi,
    topPutOi,
    oiSupport,
    oiResistance,
  };
}

/**
 * Fetches NIFTY and BANKNIFTY option-chain snapshots. Both symbols must
 * succeed together — if NSE blocks the option-chain endpoint, we fall back
 * to sample data for both rather than mixing live and stale numbers.
 */
export async function getLiveOiSnapshots(): Promise<{
  snapshots: OiSnapshot[];
  live: boolean;
}> {
  try {
    const [nifty, banknifty] = await Promise.all([
      fetchOptionChainFor("NIFTY"),
      fetchOptionChainFor("BANKNIFTY"),
    ]);
    return { snapshots: [nifty, banknifty], live: true };
  } catch {
    const { getOiSnapshots } = await import("@/lib/mock-data");
    return { snapshots: getOiSnapshots(), live: false };
  }
}
