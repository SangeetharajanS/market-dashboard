import { NextResponse } from "next/server";
import { getIndianIndices, getForexInstruments } from "@/lib/mock-data";
import { withLiveQuotes } from "@/lib/data/quotes";

export const revalidate = 60;

export async function GET() {
  const [indianIndices, forexInstruments] = await Promise.all([
    withLiveQuotes(getIndianIndices()),
    withLiveQuotes(getForexInstruments()),
  ]);

  return NextResponse.json({ indianIndices, forexInstruments });
}
