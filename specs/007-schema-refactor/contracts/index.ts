// Auto-generated contracts from schemas
import { z } from 'zod';
import * as Enums from '../../../../app/src/schemas/enums';

// Enums
export type Gender = z.infer<typeof Enums.GenderEnum>;
export type CurrencyCode = z.infer<typeof Enums.CurrencyCodeEnum>;
export type CountryCode = z.infer<typeof Enums.CountryCodeEnum>;
export type BusinessArea = z.infer<typeof Enums.BusinessAreaEnum>;
export type BusinessCategory = z.infer<typeof Enums.BusinessCategoryEnum>;
export type BusinessSector = z.infer<typeof Enums.BusinessSectorEnum>;
export type RBMLevel = z.infer<typeof Enums.RBMLevelEnum>;
export type IndicatorUnit = z.infer<typeof Enums.IndicatorUnitEnum>;
export type Dimension = z.infer<typeof Enums.DimensionEnum>;

// Interfaces
import { AddressSchema } from '../../../../app/src/schemas/common/address';
import { ContactInfoSchema } from '../../../../app/src/schemas/common/contact';
import { MoneySchema } from '../../../../app/src/schemas/common/money';
import { IndicatorSchema } from '../../../../app/src/schemas/monitoring-evaluation/indicators';
import { SupportBoostSchema } from '../../../../app/src/schemas/monitoring-evaluation/Support';
import { QuickWinSchema } from '../../../../app/src/schemas/monitoring-evaluation/QuickWin';
import { MomentumMetricSchema } from '../../../../app/src/schemas/monitoring-evaluation/MomentumMetric';

export type Address = z.infer<typeof AddressSchema>;
export type ContactInfo = z.infer<typeof ContactInfoSchema>;
export type Money = z.infer<typeof MoneySchema>;
export type Indicator = z.infer<typeof IndicatorSchema>;
export type SupportBoost = z.infer<typeof SupportBoostSchema>;
export type QuickWin = z.infer<typeof QuickWinSchema>;
export type MomentumMetric = z.infer<typeof MomentumMetricSchema>;
