import { fetchLiveFiiDii } from "@/lib/data/fii-dii";
import { getFiiDii as getMockFiiDii, type FiiDiiRow } from "@/lib/mock-data";

function crore(n: number) {
  return `₹${n.toLocaleString("en-IN")} Cr`;
}

async function loadFiiDii(): Promise<{ rows: FiiDiiRow[]; live: boolean }> {
  try {
    const rows = await fetchLiveFiiDii();
    return { rows, live: true };
  } catch {
    // NSE blocked the request or changed its response shape — fall back to
    // sample data rather than showing a broken card.
    return { rows: getMockFiiDii(), live: false };
  }
}

export default async function FiiDiiCard() {
  const { rows, live } = await loadFiiDii();

  return (
    <div className="rounded-lg border border-border bg-surface p-5">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-sm font-semibold text-text-primary">
          FII / DII Activity
        </h3>
        <span
          className={`rounded px-2 py-0.5 text-xs font-medium ${
            live ? "bg-up-soft text-up" : "bg-warn/10 text-warn"
          }`}
        >
          {live ? "Live · NSE" : "Sample data"}
        </span>
      </div>
      <p className="mt-1 text-xs text-text-muted">Provisional, cash market</p>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="text-xs text-text-muted">
              <th className="pb-2 font-normal">Date</th>
              <th className="pb-2 font-normal">FII Net</th>
              <th className="pb-2 font-normal">DII Net</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const fiiNet = row.fiiBuy - row.fiiSell;
              const diiNet = row.diiBuy - row.diiSell;
              return (
                <tr key={row.date} className="border-t border-border-soft">
                  <td className="py-2.5 text-text-secondary">{row.date}</td>
                  <td
                    className={`py-2.5 font-data ${
                      fiiNet >= 0 ? "text-up" : "text-down"
                    }`}
                  >
                    {fiiNet >= 0 ? "+" : ""}
                    {crore(fiiNet)}
                  </td>
                  <td
                    className={`py-2.5 font-data ${
                      diiNet >= 0 ? "text-up" : "text-down"
                    }`}
                  >
                    {diiNet >= 0 ? "+" : ""}
                    {crore(diiNet)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
