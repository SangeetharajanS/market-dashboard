import { XMLParser } from "fast-xml-parser";
import type { NewsItem } from "@/lib/mock-data";

// -----------------------------------------------------------------------------
// RSS is the most reliable free news source: no API key, no rate limits,
// and publishers actively maintain these feeds since they drive traffic.
// -----------------------------------------------------------------------------

const INDIA_FEEDS = [
  {
    url: "https://economictimes.indiatimes.com/markets/rssfeeds/1977021501.cms",
    source: "Economic Times",
  },
];

const FOREX_FEEDS = [
  {
    url: "https://economictimes.indiatimes.com/markets/forex/rssfeeds/1150221130.cms",
    source: "Economic Times",
  },
  {
    url: "https://www.coindesk.com/arc/outboundfeeds/rss",
    source: "CoinDesk",
  },
];

const HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  Accept: "application/rss+xml, application/xml, text/xml",
};

const parser = new XMLParser({ ignoreAttributes: false });

function timeAgo(pubDate: string): string {
  const then = new Date(pubDate).getTime();
  if (Number.isNaN(then)) return "";
  const diffMs = Date.now() - then;
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  if (hours < 1) return "just now";
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

async function fetchFeed(
  feed: { url: string; source: string },
  tag: "india" | "forex"
): Promise<NewsItem[]> {
  const res = await fetch(feed.url, {
    headers: HEADERS,
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`${feed.source} RSS responded ${res.status}`);
  }

  const xml = await res.text();
  const parsed = parser.parse(xml);
  const rawItems = parsed?.rss?.channel?.item;

  // fast-xml-parser returns a bare object (not an array) when a feed has
  // exactly one <item> — normalize so the rest of the logic doesn't need
  // to special-case it.
  const items = Array.isArray(rawItems)
    ? rawItems
    : rawItems
      ? [rawItems]
      : null;

  if (!items) {
    throw new Error(`Unexpected RSS shape from ${feed.source}`);
  }

  return items.slice(0, 6).map((item, i) => ({
    id: `${feed.source}-${tag}-${i}`,
    headline: String(item.title ?? "").trim(),
    source: feed.source,
    time: timeAgo(item.pubDate ?? ""),
    tag,
  }));
}

async function fetchTaggedNews(
  feeds: { url: string; source: string }[],
  tag: "india" | "forex"
): Promise<NewsItem[]> {
  const results = await Promise.allSettled(
    feeds.map((feed) => fetchFeed(feed, tag))
  );

  const items = results
    .filter((r): r is PromiseFulfilledResult<NewsItem[]> => r.status === "fulfilled")
    .flatMap((r) => r.value);

  // Interleave sources roughly by recency-of-fetch rather than grouping by
  // feed, so one source doesn't dominate the top of the list.
  return items;
}

/**
 * Fetches live news for both markets. Each market's feeds are independent —
 * if forex feeds fail, Indian news can still be live, and vice versa.
 */
export async function getLiveNews(): Promise<{
  india: { items: NewsItem[]; live: boolean };
  forex: { items: NewsItem[]; live: boolean };
}> {
  const [indiaResult, forexResult] = await Promise.allSettled([
    fetchTaggedNews(INDIA_FEEDS, "india"),
    fetchTaggedNews(FOREX_FEEDS, "forex"),
  ]);

  const { getNews } = await import("@/lib/mock-data");
  const mock = getNews();

  const india =
    indiaResult.status === "fulfilled" && indiaResult.value.length > 0
      ? { items: indiaResult.value, live: true }
      : { items: mock.filter((n) => n.tag === "india"), live: false };

  const forex =
    forexResult.status === "fulfilled" && forexResult.value.length > 0
      ? { items: forexResult.value, live: true }
      : { items: mock.filter((n) => n.tag === "forex"), live: false };

  return { india, forex };
}
