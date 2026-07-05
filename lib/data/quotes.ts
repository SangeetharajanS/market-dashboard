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
  )}?range=5d&interval=1d`;

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
  XAUUSD: "XAUUSD=X",
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
 * Fetches live price + pivot-point support/resistance for one symbol.
 * Throws on any failure — callers fall back to sample data per-instrument.
 */
async function fetchLiveQuote(
  yahooSymbol: string
): Promise<Pick<Instrument, "ltp" | "change" | "changePct" | "support" | "resistance">> {
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

  // Use the most recent *complete* prior day's OHLC for the pivot calc —
  // the last entry in the daily series can be today's still-forming candle.
  const { high, low, close } = result.indicators.quote[0];
  const priorIdx = high.length >= 2 ? high.length - 2 : high.length - 1;
  const pHigh = high[priorIdx];
  const pLow = low[priorIdx];
  const pClose = close[priorIdx];

  let support: [number, number] = [
    round(ltp * 0.99, decimals),
    round(ltp * 0.98, decimals),
  ];
  let resistance: [number, number] = [
    round(ltp * 1.01, decimals),
    round(ltp * 1.02, decimals),
  ];

  if (typeof pHigh === "number" && typeof pLow === "number" && typeof pClose === "number") {
    const pivot = (pHigh + pLow + pClose) / 3;
    const r1 = 2 * pivot - pLow;
    const r2 = pivot + (pHigh - pLow);
    const s1 = 2 * pivot - pHigh;
    const s2 = pivot - (pHigh - pLow);
    support = [round(s1, decimals), round(s2, decimals)];
    resistance = [round(r1, decimals), round(r2, decimals)];
  }

  return {
    ltp: round(ltp, decimals),
    change: round(change, decimals),
    changePct: round(changePct, 2),
    support,
    resistance,
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
