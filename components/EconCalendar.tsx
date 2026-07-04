import { getEconCalendar } from "@/lib/mock-data";

const impactColor: Record<string, string> = {
  high: "bg-down-soft text-down",
  medium: "bg-warn/10 text-warn",
  low: "bg-border-soft text-text-muted",
};

export default function EconCalendar() {
  const events = getEconCalendar();

  return (
    <div className="rounded-lg border border-border bg-surface p-5">
      <h3 className="font-display text-sm font-semibold text-forex">
        High-Impact Events
      </h3>
      <ul className="mt-4 space-y-4">
        {events.map((ev) => (
          <li
            key={ev.id}
            className="border-t border-border-soft pt-3 first:border-t-0 first:pt-0"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-text-primary">
                  {ev.name}{" "}
                  <span className="text-xs font-normal text-text-muted">
                    ({ev.country})
                  </span>
                </p>
                <p className="mt-1 text-xs text-text-muted">{ev.time}</p>
              </div>
              <span
                className={`shrink-0 rounded px-2 py-0.5 text-xs font-medium ${impactColor[ev.impact]}`}
              >
                {ev.impact}
              </span>
            </div>
            <div className="mt-2 flex gap-4 font-data text-xs">
              <span className="text-text-secondary">
                Forecast: <span className="text-text-primary">{ev.forecast}</span>
              </span>
              <span className="text-text-secondary">
                Previous: <span className="text-text-primary">{ev.previous}</span>
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
