import { getNews } from "@/lib/mock-data";

export default function NewsList({ tag }: { tag: "india" | "forex" }) {
  const items = getNews().filter((n) => n.tag === tag);

  return (
    <div className="rounded-lg border border-border bg-surface p-5">
      <h3 className="font-display text-sm font-semibold text-text-primary">
        {tag === "india" ? "Indian Market News" : "Forex & Global News"}
      </h3>
      <ul className="mt-4 space-y-4">
        {items.map((item) => (
          <li key={item.id} className="border-t border-border-soft pt-3 first:border-t-0 first:pt-0">
            <p className="text-sm leading-snug text-text-primary">{item.headline}</p>
            <div className="mt-1.5 flex gap-2 text-xs text-text-muted">
              <span>{item.source}</span>
              <span>·</span>
              <span>{item.time}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
