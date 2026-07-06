import type { Instrument, OiSnapshot } from "@/lib/mock-data";

/**
 * Overrides support/resistance on NIFTY/BANKNIFTY with option-OI-based
 * levels when live OI data is available. Used by both the Indices page and
 * the Levels page so the two stay consistent with each other.
 */
export function withOiLevels(
  instruments: Instrument[],
  snapshots: OiSnapshot[],
  oiLive: boolean
): Instrument[] {
  return instruments.map((inst) => {
    const snap = snapshots.find((s) => s.symbol === inst.symbol);
    if (oiLive && snap?.oiSupport && snap?.oiResistance) {
      return {
        ...inst,
        support: snap.oiSupport,
        resistance: snap.oiResistance,
        srMethod: "oi" as const,
      };
    }
    return inst;
  });
}
