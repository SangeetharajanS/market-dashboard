import type { FiiDiiRow } from "@/lib/mock-data";

// -----------------------------------------------------------------------------
// NSE blocks requests without a real browser fingerprint. The two-step dance
// below (visit the homepage first to collect session cookies, then call the
// data endpoint with those cookies) is what every open-source NSE scraper
// does — it's not official, and NSE can and does block cloud/server IPs
// without warning. Treat this as "best effort" and always have a fallback.
// -----------------------------------------------------------------------------

const NSE_HOME = "https://www.nseindia.com/";
const NSE_FII_DII_URL = "https://www.nseindia.com/api/fiidiiTradeReact";

const BROWSER_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  Accept: "*/*",
  "Accept-Language": "en-US,en;q=0.9",
  Referer: "https://www.nseindia.com/report-detail/fii_archive",
};

type NseFiiDiiEntry = {
  category: string; // "FII/FPI *" or "DII **"
  date: string; // "04-Jul-2026"
  buyValue: string;
  sellValue: string;
  netValue: string;
};

function parseCategory(rows: NseFiiDiiEntry[]): FiiDiiRow | null {
  const fii = rows.find((r) => r.category.toUpperCase().startsWith("FII"));
  const dii = rows.find((r) => r.category.toUpperCase().startsWith("DII"));
  if (!fii || !dii) return null;

  return {
    date: fii.date,
    fiiBuy: Math.round(parseFloat(fii.buyValue)),
    fiiSell: Math.round(parseFloat(fii.sellValue)),
    diiBuy: Math.round(parseFloat(dii.buyValue)),
    diiSell: Math.round(parseFloat(dii.sellValue)),
  };
}

/**
 * Fetches today's (or the last trading day's) FII/DII cash-market activity
 * directly from NSE. Throws if NSE blocks or returns something unexpected —
 * callers should catch this and fall back to cached/mock data.
 */
export async function fetchLiveFiiDii(): Promise<FiiDiiRow[]> {
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

  const dataRes = await fetch(NSE_FII_DII_URL, {
    headers: {
      ...BROWSER_HEADERS,
      Cookie: cookie,
    },
    cache: "no-store",
  });

  if (!dataRes.ok) {
    throw new Error(`NSE responded with ${dataRes.status}`);
  }

  const raw = (await dataRes.json()) as NseFiiDiiEntry[];
  const row = parseCategory(raw);

  if (!row) {
    throw new Error("Unexpected NSE response shape");
  }

  return [row];
}
