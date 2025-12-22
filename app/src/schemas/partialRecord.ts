import { z } from 'zod';
import { ImportStatusEnum } from '@/schemas/enums/common';

export const PartialRecordSchema = z.object({
  id: z.string().uuid(),
  rawData: z.record(z.string(), z.union([z.string(), z.number(), z.boolean(), z.null()])),
  missingFields: z.array(z.string()),
  status: ImportStatusEnum,
  importSource: z.string().min(1),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type PartialRecord = z.infer<typeof PartialRecordSchema>;
