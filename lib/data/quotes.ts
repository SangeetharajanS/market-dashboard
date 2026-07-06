import type { Instrument } from "@/lib/mock-data";

// -----------------------------------------------------------------------------
// Yahoo Finance's chart endpoint is unofficial (no published SLA), but it
// doesn't require the cookie/session dance NSE does, and it happens to cover
// Indian indices, forex pairs, and crypto through the same shape. Good enough
// for a free MVP; a paid data vendor is the natural upgrade once this app has
// real users depending on uptime.
// -----------------------------------------------------------------------------

const YAHOO_CHART_URL = (symbol: string) =>
  `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(
    symbol
  )}?range=3mo&interval=1d`;

const HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  Accept: "application/json",
};

// Maps our display symbols to the tickers Yahoo Finance expects.
export const YAHOO_SYMBOLS: Record<string, string> = {
  NIFTY: "^NSEI",
  BANKNIFTY: "^NSEBANK",
  SENSEX: "^BSESN",
  // Yahoo has no "XAUUSD=X" spot symbol — GC=F (COMEX gold futures) is what
  // it actually tracks, and it moves almost identically to spot gold.
  XAUUSD: "GC=F",
  GBPUSD: "GBPUSD=X",
  NZDUSD: "NZDUSD=X",
  USDJPY: "USDJPY=X",
  EURUSD: "EURUSD=X",
  BTCUSD: "BTC-USD",
};

type YahooChartResponse = {
  chart: {
    result: [
      {
        meta: {
          regularMarketPrice: number;
          previousClose?: number;
          chartPreviousClose?: number;
        };
        indicators: {
          quote: [
            {
              high: (number | null)[];
              low: (number | null)[];
              close: (number | null)[];
            }
          ];
        };
      }
    ] | null;
    error: unknown;
  };
};

function decimalsFor(price: number) {
  return price < 100 ? 4 : 2;
}

function round(n: number, decimals: number) {
  const factor = 10 ** decimals;
  return Math.round(n * factor) / factor;
}

/**
 * Finds local swing highs/lows in a daily price series — a candle whose high
 * is the highest (or low the lowest) within `window` days on either side.
 * These are real chart structure: prior reaction points where price
 * previously reversed, which is exactly what "support becomes resistance"
 * relies on. Because we always re-rank them against the *current* price
 * rather than hardcoding a side, a broken support automatically starts
 * showing up as resistance once price is below it, and vice versa.
 */
function findSwingLevels(
  high: (number | null)[],
  low: (number | null)[],
  window = 2
): { highs: number[]; lows: number[] } {
  const highs: number[] = [];
  const lows: number[] = [];

  for (let i = window; i < high.length - window; i++) {
    const h = high[i];
    const l = low[i];
    if (typeof h === "number") {
      let isSwingHigh = true;
      for (let j = i - window; j <= i + window; j++) {
        if (j === i) continue;
        const other = high[j];
        if (typeof other === "number" && other > h) {
          isSwingHigh = false;
          break;
        }
      }
      if (isSwingHigh) highs.push(h);
    }
    if (typeof l === "number") {
      let isSwingLow = true;
      for (let j = i - window; j <= i + window; j++) {
        if (j === i) continue;
        const other = low[j];
        if (typeof other === "number" && other < l) {
          isSwingLow = false;
          break;
        }
      }
      if (isSwingLow) lows.push(l);
    }
  }

  return { highs, lows };
}

/**
 * Picks the nearest two swing levels on the correct side of the current
 * price, deduplicating levels that are essentially the same zone.
 */
function nearestTwo(
  levels: number[],
  price: number,
  side: "above" | "below"
): number[] {
  const filtered = levels.filter((v) =>
    side === "above" ? v > price : v < price
  );
  const sorted = filtered.sort((a, b) =>
    side === "above" ? a - b : b - a
  );

  const picked: number[] = [];
  for (const v of sorted) {
    const tooClose = picked.some(
      (p) => Math.abs(v - p) / price < 0.0015 // within ~0.15% counts as the same zone
    );
    if (!tooClose) picked.push(v);
    if (picked.length === 2) break;
  }
  return picked;
}

/**
 * Fetches live price + swing-structure support/resistance for one symbol.
 * Throws on any failure — callers fall back to sample data per-instrument.
 */
async function fetchLiveQuote(
  yahooSymbol: string
): Promise<
  Pick<Instrument, "ltp" | "change" | "changePct" | "support" | "resistance" | "srMethod">
> {
  const res = await fetch(YAHOO_CHART_URL(yahooSymbol), {
    headers: HEADERS,
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error(`Yahoo responded with ${res.status}`);
  }

  const data = (await res.json()) as YahooChartResponse;
  const result = data.chart.result?.[0];
  if (!result) {
    throw new Error("Unexpected Yahoo response shape");
  }

  const ltp = result.meta.regularMarketPrice;
  const prevClose = result.meta.previousClose ?? result.meta.chartPreviousClose;
  if (typeof ltp !== "number" || typeof prevClose !== "number") {
    throw new Error("Missing price fields");
  }

  const decimals = decimalsFor(ltp);
  const change = ltp - prevClose;
  const changePct = (change / prevClose) * 100;

  // Use the most recent *complete* prior day's close for change/changePct —
  // the last entry in the daily series can be today's still-forming candle.
  const { high, low } = result.indicators.quote[0];

  const { highs, lows } = findSwingLevels(high, low);
  let resistance = nearestTwo(highs, ltp, "above");
  let support = nearestTwo(lows, ltp, "below");

  let srMethod: Instrument["srMethod"] = "structure";

  // Fall back to a simple percentage offset only if there isn't enough
  // price history to find real structure (e.g. a very newly listed
  // instrument) — this guarantees the UI always has two levels on each
  // side, and they're still guaranteed to sit on the correct side of price.
  if (resistance.length < 2 || support.length < 2) {
    srMethod = "pivot";
    resistance = [round(ltp * 1.01, decimals), round(ltp * 1.02, decimals)];
    support = [round(ltp * 0.99, decimals), round(ltp * 0.98, decimals)];
  } else {
    resistance = resistance.map((v) => round(v, decimals));
    support = support.map((v) => round(v, decimals));
  }

  return {
    ltp: round(ltp, decimals),
    change: round(change, decimals),
    changePct: round(changePct, 2),
    support: support as [number, number],
    resistance: resistance as [number, number],
    srMethod,
  };
}

/**
 * Overlays live prices onto a base list of instruments. Each instrument is
 * updated independently — if one symbol fails, the rest still get live data,
 * and the failed one just keeps its sample values with `live: false`.
 */
export async function withLiveQuotes(base: Instrument[]): Promise<Instrument[]> {
  return Promise.all(
    base.map(async (inst) => {
      const yahooSymbol = YAHOO_SYMBOLS[inst.symbol];
      if (!yahooSymbol) return { ...inst, live: false };

      try {
        const live = await fetchLiveQuote(yahooSymbol);
        return { ...inst, ...live, live: true };
      } catch {
        return { ...inst, live: false };
      }
    })
  );
}
