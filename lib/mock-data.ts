// -----------------------------------------------------------------------------
// Mock data layer.
//
// Every function here returns the exact shape the UI expects. When you're
// ready to wire in real data (NSE, TrueData, Twelve Data, etc.), replace the
// body of each function with a real fetch — the components won't need to
// change at all.
// -----------------------------------------------------------------------------

export type Instrument = {
  symbol: string;
  name: string;
  ltp: number;
  change: number;
  changePct: number;
  support: [number, number];
  resistance: [number, number];
};

export type OiSnapshot = {
  symbol: string;
  expiry: string;
  daysToExpiry: number;
  pcr: number;
  maxPain: number;
  topCallOi: { strike: number; oi: string }[];
  topPutOi: { strike: number; oi: string }[];
};

export type FiiDiiRow = {
  date: string;
  fiiBuy: number;
  fiiSell: number;
  diiBuy: number;
  diiSell: number;
};

export type NewsItem = {
  id: string;
  headline: string;
  source: string;
  time: string;
  tag: "india" | "forex";
};

export type EconEvent = {
  id: string;
  name: string;
  country: string;
  time: string;
  impact: "high" | "medium" | "low";
  forecast: string;
  previous: string;
};

export function getIndianIndices(): Instrument[] {
  return [
    {
      symbol: "NIFTY",
      name: "Nifty 50",
      ltp: 24812.35,
      change: 118.4,
      changePct: 0.48,
      support: [24650, 24500],
      resistance: [24900, 25050],
    },
    {
      symbol: "BANKNIFTY",
      name: "Bank Nifty",
      ltp: 52340.1,
      change: -204.65,
      changePct: -0.39,
      support: [52000, 51700],
      resistance: [52650, 52950],
    },
    {
      symbol: "SENSEX",
      name: "Sensex",
      ltp: 81452.8,
      change: 342.1,
      changePct: 0.42,
      support: [81000, 80600],
      resistance: [81800, 82200],
    },
  ];
}

export function getForexInstruments(): Instrument[] {
  return [
    {
      symbol: "XAUUSD",
      name: "Gold Spot",
      ltp: 2384.6,
      change: 12.4,
      changePct: 0.52,
      support: [2368, 2350],
      resistance: [2398, 2415],
    },
    {
      symbol: "GBPUSD",
      name: "Pound / Dollar",
      ltp: 1.2734,
      change: -0.0021,
      changePct: -0.16,
      support: [1.269, 1.265],
      resistance: [1.2775, 1.282],
    },
    {
      symbol: "NZDUSD",
      name: "Kiwi / Dollar",
      ltp: 0.6081,
      change: 0.0009,
      changePct: 0.15,
      support: [0.604, 0.6005],
      resistance: [0.611, 0.6145],
    },
    {
      symbol: "USDJPY",
      name: "Dollar / Yen",
      ltp: 161.22,
      change: 0.38,
      changePct: 0.24,
      support: [160.4, 159.8],
      resistance: [161.8, 162.5],
    },
    {
      symbol: "EURUSD",
      name: "Euro / Dollar",
      ltp: 1.0752,
      change: -0.0014,
      changePct: -0.13,
      support: [1.0715, 1.068],
      resistance: [1.079, 1.0825],
    },
    {
      symbol: "BTCUSD",
      name: "Bitcoin / Dollar",
      ltp: 62480,
      change: 890,
      changePct: 1.45,
      support: [61200, 59800],
      resistance: [63500, 65000],
    },
  ];
}

export function getOiSnapshots(): OiSnapshot[] {
  return [
    {
      symbol: "NIFTY",
      expiry: "10 Jul 2026",
      daysToExpiry: 6,
      pcr: 1.18,
      maxPain: 24800,
      topCallOi: [
        { strike: 25000, oi: "42.1L" },
        { strike: 24900, oi: "36.8L" },
      ],
      topPutOi: [
        { strike: 24700, oi: "39.4L" },
        { strike: 24600, oi: "31.2L" },
      ],
    },
    {
      symbol: "BANKNIFTY",
      expiry: "09 Jul 2026",
      daysToExpiry: 5,
      pcr: 0.94,
      maxPain: 52300,
      topCallOi: [
        { strike: 52500, oi: "18.6L" },
        { strike: 52700, oi: "14.9L" },
      ],
      topPutOi: [
        { strike: 52000, oi: "21.3L" },
        { strike: 51800, oi: "16.5L" },
      ],
    },
  ];
}

export function getFiiDii(): FiiDiiRow[] {
  return [
    { date: "03 Jul 2026", fiiBuy: 11245, fiiSell: 12890, diiBuy: 9820, diiSell: 8340 },
    { date: "02 Jul 2026", fiiBuy: 10120, fiiSell: 9560, diiBuy: 8890, diiSell: 9210 },
    { date: "01 Jul 2026", fiiBuy: 13980, fiiSell: 11400, diiBuy: 7650, diiSell: 8990 },
  ];
}

export function getNews(): NewsItem[] {
  return [
    {
      id: "in-1",
      headline: "RBI likely to hold rates steady in August policy review, say economists",
      source: "Economic Times",
      time: "2h ago",
      tag: "india",
    },
    {
      id: "in-2",
      headline: "Nifty IT stocks under pressure ahead of TCS, Infosys earnings",
      source: "Moneycontrol",
      time: "4h ago",
      tag: "india",
    },
    {
      id: "in-3",
      headline: "FIIs turn net buyers in July after three months of outflows",
      source: "Business Standard",
      time: "6h ago",
      tag: "india",
    },
    {
      id: "fx-1",
      headline: "Gold holds near two-week high as traders await NFP print",
      source: "Reuters",
      time: "1h ago",
      tag: "forex",
    },
    {
      id: "fx-2",
      headline: "Dollar steadies as markets price in delayed Fed rate cuts",
      source: "FXStreet",
      time: "3h ago",
      tag: "forex",
    },
    {
      id: "fx-3",
      headline: "Bitcoin consolidates below resistance as ETF inflows slow",
      source: "CoinDesk",
      time: "5h ago",
      tag: "forex",
    },
  ];
}

export function getEconCalendar(): EconEvent[] {
  return [
    {
      id: "ev-1",
      name: "Non-Farm Payrolls (NFP)",
      country: "US",
      time: "Fri, 04 Jul · 6:00 PM IST",
      impact: "high",
      forecast: "190K",
      previous: "272K",
    },
    {
      id: "ev-2",
      name: "CPI y/y",
      country: "US",
      time: "Thu, 10 Jul · 6:00 PM IST",
      impact: "high",
      forecast: "3.1%",
      previous: "3.3%",
    },
    {
      id: "ev-3",
      name: "RBI Interest Rate Decision",
      country: "IN",
      time: "Fri, 08 Aug · 11:30 AM IST",
      impact: "high",
      forecast: "6.50%",
      previous: "6.50%",
    },
  ];
}
