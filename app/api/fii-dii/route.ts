import { NextResponse } from "next/server";
import { fetchLiveFiiDii } from "@/lib/data/fii-dii";
import { getFiiDii as getMockFiiDii } from "@/lib/mock-data";

// Re-check NSE at most every 30 minutes — no point hammering it more often
// than the data actually changes, and it lowers the chance of being blocked.
export const revalidate = 1800;

export async function GET() {
  try {
    const rows = await fetchLiveFiiDii();
    return NextResponse.json({ source: "live", rows });
  } catch {
    // NSE blocked us, changed shape, or is down — serve sample data rather
    // than a broken dashboard. The UI marks this clearly as sample data.
    return NextResponse.json({ source: "sample", rows: getMockFiiDii() });
  }
}
