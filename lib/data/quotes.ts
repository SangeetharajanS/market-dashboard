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
 * Classic daily pivot points (P, R1-R3, S1-S3) from the prior day's OHLC.
 * This is the single most widely used reference level among retail traders
 * of every style — day traders, scalpers, and positional traders alike —
 * not something specific to "swing trading". Extended to R3/S3 so there's
 * still a familiar-style candidate on a strong trend day, before falling
 * back to swing structure or previous day's high/low.
 */
function classicPivots(pHigh: number, pLow: number, pClose: number) {
  const p = (pHigh + pLow + pClose) / 3;
  const range = pHigh - pLow;
  return {
    r1: 2 * p - pLow,
    r2: p + range,
    r3: pHigh + 2 * (p - pLow),
    s1: 2 * p - pHigh,
    s2: p - range,
    s3: pLow - 2 * (pHigh - p),
  };
}

/**
 * Picks the nearest two levels on the correct side of the current price from
 * a pool of candidates, deduplicating levels that are essentially the same
 * zone. Because the candidate pool can mix pivot points, previous day's
 * high/low, and swing highs/lows, this naturally picks whichever source is
 * actually closest and relevant right now — not one fixed method.
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
 * Fetches live price + support/resistance for one symbol. Levels are picked
 * from a merged pool of classic pivot points, the previous day's high/low,
 * and recent swing highs/lows — whichever candidates are actually nearest
 * and valid (on the correct side of price) win. This is deliberately not
 * "swing trading" specific; these are the reference levels day traders,
 * scalpers, and positional traders all commonly watch.
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

  const { high, low, close } = result.indicators.quote[0];

  // "Standard" pool — classic pivots + previous day's high/low. This is
  // what most traders actually recognize, and gets priority.
  const standardHighs: number[] = [];
  const standardLows: number[] = [];

  const priorIdx = high.length >= 2 ? high.length - 2 : high.length - 1;
  const pHigh = high[priorIdx];
  const pLow = low[priorIdx];
  const pClose = close[priorIdx];

  if (typeof pHigh === "number" && typeof pLow === "number") {
    standardHighs.push(pHigh);
    standardLows.push(pLow);
  }
  if (typeof pHigh === "number" && typeof pLow === "number" && typeof pClose === "number") {
    const { r1, r2, r3, s1, s2, s3 } = classicPivots(pHigh, pLow, pClose);
    standardHighs.push(r1, r2, r3);
    standardLows.push(s1, s2, s3);
  }

  // "Swing" pool — only used to fill in gaps the standard pool can't cover,
  // e.g. price has run past every classic level on a strong trend day.
  const { highs: swingHighs, lows: swingLows } = findSwingLevels(high, low);

  let resistance = nearestTwo(standardHighs, ltp, "above");
  let support = nearestTwo(standardLows, ltp, "below");
  let srMethod: Instrument["srMethod"] = "structure"; // "classic pivots" — kept as "structure" to match the existing type

  if (resistance.length < 2) {
    resistance = nearestTwo([...standardHighs, ...swingHighs], ltp, "above");
    if (resistance.length) srMethod = "structure";
  }
  if (support.length < 2) {
    support = nearestTwo([...standardLows, ...swingLows], ltp, "below");
    if (support.length) srMethod = "structure";
  }

  // Fall back to a simple percentage offset only if there isn't enough
  // price history for any of the above (e.g. a very newly listed
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
