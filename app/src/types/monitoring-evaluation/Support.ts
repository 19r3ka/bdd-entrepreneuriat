import type { z } from 'zod'
import { SupportBoostSchema } from '@/schemas/monitoring-evaluation/Support'

export type Support = z.infer<typeof SupportBoostSchema>
export type SupportModality = Support['modality']
export type SupportBoostType = Support['boostType']
export type SupportDimension = NonNullable<Support['dimension']>
