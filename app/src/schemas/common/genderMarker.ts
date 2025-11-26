import { z } from "zod";

/**
 * Shared Gender Marker enum for UNDP gender equality marker
 * GEN0 = Gender blind
 * GEN1 = Gender targeted
 * GEN2 = Gender responsive
 * GEN3 = Gender transformative
 */
export const GenderMarkerEnum = z.enum(["GEN0", "GEN1", "GEN2", "GEN3"]);

export type GenderMarker = z.infer<typeof GenderMarkerEnum>;
