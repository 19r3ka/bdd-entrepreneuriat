/* eslint-disable */
import { faker } from '@faker-js/faker';
import { v4 as uuidv4 } from 'uuid';
import { db } from './local-db';
import type { Entrepreneur } from '@/types/entrepreneur';
import type { Business } from '@/types/business';
import { EntrepreneurSchema } from '@/schemas/entrepreneur';
import { BusinessSchema } from '@/schemas/business';
import { SupportBoostSchema, type Support } from '@/schemas/monitoring-evaluation/Support';
import { QuickWinSchema, type QuickWin } from '@/schemas/monitoring-evaluation/QuickWin';
import {
  MomentumMetricSchema,
  type MomentumMetric,
} from '@/schemas/monitoring-evaluation/MomentumMetric';
import { generateMockData, generateTogoPhone } from '@/utils/mock-data-generator';
import { MaturityCatalog, type MaturityDimension } from '@/constants/maturityCatalog';
import {
  GENDER_OPTIONS,
  BOOST_TYPE_OPTIONS,
  MODALITY_OPTIONS,
  CHANNEL_OPTIONS,
  GENDER_MARKER_OPTIONS,
  SUPPORT_QUANTITY_UNIT_OPTIONS,
  QUICK_WIN_CATEGORY_OPTIONS,
  DIMENSION_OPTIONS,
} from '@/schemas/enums';
import { VALID_BUSINESS_AREA_CODES } from '@/constants/businessAreaCodes';

// Location constants
const LOME_LAT = 6.1375;
const LOME_LNG = 1.2125;
const KM_TO_DEGREES_FACTOR = 111.32;
const LAT_LNG_CONVERSION_FACTOR = 180;
const COORDINATE_RANDOMNESS_FACTOR = 2;
const DEFAULT_RADIUS = 15;

// Probability thresholds
const PROB = {
  DEMOGRAPHICS: 0.3,
  BIO: 0.2,
  ADDRESS: 0.4,
  ACTIVITY_START_DATE: 0.7,
  BUSINESS_TELEPHONE: 0.8,
  SECONDARY_BUSINESS_AREA: 0.3,
  REGISTRATION_NUMBER: 0.6,
  REGISTRATION_DATE: 0.7,
  SOCIAL_MEDIA: 0.4,
  RICH_DATA_BUSINESSES: 0.4,
} as const;

/**
 * Constants for simulation logic to eliminate magic numbers
 */
const SIM_SETTINGS = {
  REVENUE: {
    MIN: 1_000_000,
    MAX: 5_000_000,
    READING_COUNT: 6,
    GROWTH_STEP: 0.05,
    VOLATILITY: 0.1,
    VOLATILITY_OFFSET: 0.05,
    DAYS_WINDOW: 180,
    DAYS_STEP: 30,
    TARGET_MULT: 1.5,
  },
  JOBS: {
    MIN_VAL: 1,
    MAX_VAL: 5,
    DISABILITY_MAX: 2,
    TARGET_TOTAL: 10,
  },
  MARKET: {
    TARGET: 100_000,
    VAL_MIN: 10_000,
    VAL_MAX: 50_000,
    YEARS_PAST: 1,
  },
  PROFIT: {
    BASELINE: 5,
    TARGET: 20,
    VAL_MAX: 25,
  },
} as const;

/** * Configuration constants to eliminate magic strings and numbers
 */
const METRIC_CONFIGS = {
  REVENUE: {
    title: 'Monthly Revenue Growth',
    indicatorName: 'Monthly Revenue',
    category: 'performance',
    rbmLevel: 'outcome',
    dimension: 'Finance',
    unit: 'currency',
    irrf: ['IRRF-1.1.2'],
    sdg: ['8.3'],
  },
  EMPLOYMENT: {
    title: 'Employment Creation',
    indicatorName: 'Full-time Jobs Created',
    category: 'employment_inclusion',
    rbmLevel: 'outcome',
    dimension: 'Formalization',
    unit: 'count',
    irrf: ['IRRF-2.3.1'],
    sdg: ['8.5'],
  },
  MARKET: {
    title: 'Export Sales Expansion',
    indicatorName: 'Export Sales Volume',
    category: 'market_integration',
    rbmLevel: 'outcome',
    dimension: 'Market',
    unit: 'currency',
    irrf: ['IRRF-MKT-3A'],
    sdg: ['17.11'],
  },
  PROFIT: {
    title: 'Net Profit Margin',
    indicatorName: 'Net Profit Margin',
    category: 'performance',
    rbmLevel: 'outcome',
    dimension: 'Finance',
    unit: 'percent',
    irrf: ['IRRF-FIN-1A'],
    sdg: ['8.2'],
  },
} as const;

export interface SeedOptions {
  entrepreneurCount: number;
  businessCount: number;
  supportCount: number;
  quickWinCount: number;
  momentumMetricCount?: number;
  clear: boolean;
  epicenter?: { latitude: number; longitude: number };
  radius?: number;
}

interface ValidationError {
  type: string;
  index: number | string;
  error: unknown;
}

interface LocationCoords {
  latitude: number;
  longitude: number;
}

interface IndicatorConfig {
  name: string;
  unit: string;
  baseline: number;
  target: number;
  readings: any[];
}

/**
 * Utility to format dates consistently
 */

const getTodayStr = () => new Date().toISOString().split('T')[0];

/**
 * Core factory to build the momentum metric structure (DRY)
 */
function buildMetric(
  businessId: string,
  type: keyof typeof METRIC_CONFIGS,
  indicators: IndicatorConfig[]
): MomentumMetric {
  const config = METRIC_CONFIGS[type];
  const now = new Date().toISOString();

  const formattedIndicators = indicators.map(ind => ({
    id: uuidv4(), // Use 'id' instead of 'indicatorId' for BaseIndicatorSchema
    type: 'momentum' as const,
    name: ind.name,
    unit: ind.unit as any,
    baseline: ind.baseline,
    target: ind.target,
    readings: ind.readings,
    currency: ind.unit === 'currency' ? 'XOF' : undefined,
    // Removed 'history' as it is not in MomentumIndicatorSchema
  }));

  const metricData = {
    momentumMetricId: uuidv4(),
    businessId,
    title: config.title,
    category: config.category as any,
    rbmLevel: config.rbmLevel as any,
    dimension: config.dimension as any,
    indicators: formattedIndicators,
    irrfIndicatorIds: [...config.irrf],
    sdgTargets: [...config.sdg],
    createdAt: now,
    updatedAt: now,
    evidenceIds: [],
    contributionNarrative: '',
  };

  return MomentumMetricSchema.parse(metricData);
}

/**
 * Generates random coordinates within a radius around a center point
 */
function getRandomLocation(
  centerLat: number,
  centerLng: number,
  radiusKm: number = 10
): LocationCoords {
  const r = radiusKm / KM_TO_DEGREES_FACTOR;
  const u = Math.random();
  const v = Math.random();
  const w = r * Math.sqrt(u);
  const t = COORDINATE_RANDOMNESS_FACTOR * Math.PI * v;
  const x = w * Math.cos(t);
  const y = w * Math.sin(t);

  const newLat = x + centerLat;
  const newLng = y / Math.cos(centerLat * (Math.PI / LAT_LNG_CONVERSION_FACTOR)) + centerLng;

  // Clamp values to valid coordinate ranges to ensure schema compliance
  return {
    latitude: Math.max(-90, Math.min(90, newLat)),
    longitude: Math.max(-180, Math.min(180, newLng)),
  };
}

/**
 * Generates entrepreneur data with optional fields based on probability
 */
function generateEntrepreneur(index: number): Entrepreneur {
  const sex = faker.person.sexType();
  const firstName = faker.person.firstName(sex);
  const lastName = faker.person.lastName();
  const email = faker.internet.email({ firstName, lastName });
  const entrepreneurId = uuidv4();

  const entrepreneurOverrides = {
    id: () => entrepreneurId,
    firstName: () => firstName,
    lastName: () => lastName,
    slug: () => faker.helpers.slugify(`${firstName} ${lastName}-${index}`).toLowerCase(),
    contact: () => ({
      email,
      telephone: generateTogoPhone(),
    }),
    gender: () => faker.helpers.arrayElement(GENDER_OPTIONS),
    ...(faker.number.float() < PROB.DEMOGRAPHICS && {
      demographics: () => ({
        gender: sex,
        ageGroup: faker.helpers.arrayElement(['18-24', '25-34', '35-44', '45-54', '55+']),
        educationLevel: faker.helpers.arrayElement([
          'none',
          'primary',
          'secondary',
          'university',
          'vocational',
        ]),
      }),
    }),
    ...(faker.number.float() < PROB.BIO && {
      bio: () => faker.lorem.paragraph(),
    }),
    ...(faker.number.float() < PROB.ADDRESS && {
      address: () => ({
        street: faker.location.streetAddress(),
        city: faker.location.city(),
        state: faker.location.state(),
        postalCode: faker.location.zipCode(),
        country: faker.location.country(),
        coordinates: {
          // Explicitly constrain coordinates to avoid validation errors
          latitude: Number(faker.location.latitude({ min: -90, max: 90 })),
          longitude: Number(faker.location.longitude({ min: -180, max: 180 })),
        },
      }),
    }),
  };

  const baseData = generateMockData(
    EntrepreneurSchema,
    'entrepreneur',
    entrepreneurOverrides
  ) as Record<string, unknown>;
  const entrepreneurData = {
    ...baseData,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  return EntrepreneurSchema.parse(entrepreneurData) as Entrepreneur;
}

/**
 * Generates business data with location and optional fields
 */
function generateBusiness(
  index: number,
  entrepreneurIds: string[],
  epicenter?: { latitude: number; longitude: number },
  radius?: number
): Business {
  const entrepreneurId = faker.helpers.arrayElement(entrepreneurIds);
  const centerLat = epicenter?.latitude || LOME_LAT;
  const centerLng = epicenter?.longitude || LOME_LNG;
  const genRadius = radius || DEFAULT_RADIUS;
  const location = getRandomLocation(centerLat, centerLng, genRadius);

  const businessOverrides = {
    id: () => uuidv4(),
    entrepreneurId: () => entrepreneurId,
    name: () => faker.company.name(),
    primaryBusinessArea: () => faker.helpers.arrayElement(VALID_BUSINESS_AREA_CODES),
    activityStartDate: () =>
      faker.number.float() < PROB.ACTIVITY_START_DATE ? faker.date.past({ years: 3 }) : null,
    supportStartDate: () => faker.date.past({ years: 2 }),
    location: () => ({
      street: faker.location.streetAddress(),
      city: 'Lomé',
      state: 'Maritime',
      postalCode: faker.location.zipCode(),
      country: 'Togo',
      coordinates: {
        latitude: location.latitude,
        longitude: location.longitude,
      },
    }),
    contact: () => ({
      email: faker.internet.email(),
      ...(faker.number.float() < PROB.BUSINESS_TELEPHONE && {
        telephone: generateTogoPhone(),
      }),
    }),
    ...(faker.number.float() < PROB.SECONDARY_BUSINESS_AREA && {
      secondaryBusinessArea: () => faker.helpers.arrayElement(VALID_BUSINESS_AREA_CODES),
    }),
    ...(faker.number.float() < PROB.REGISTRATION_NUMBER && {
      registrationNumber: () => faker.string.alphanumeric(10).toUpperCase(),
    }),
    ...(faker.number.float() < PROB.REGISTRATION_DATE && {
      registrationDate: () => faker.date.past({ years: 5 }),
    }),
    ...(faker.number.float() < PROB.SOCIAL_MEDIA && {
      socialMedia: () => ({
        ...(faker.datatype.boolean() && {
          facebook: `https://facebook.com/${faker.lorem.slug()}`,
        }),
        ...(faker.datatype.boolean() && { whatsapp: generateTogoPhone() }),
      }),
    }),
    maturityLevels: () => ({
      Digital: faker.number.int({ min: 1, max: 4 }),
      Finance: faker.number.int({ min: 1, max: 4 }),
      Market: faker.number.int({ min: 1, max: 4 }),
      Green: faker.number.int({ min: 1, max: 4 }),
      Formalization: faker.number.int({ min: 1, max: 4 }),
    }),
  };

  const baseData = generateMockData(BusinessSchema, 'business', businessOverrides) as Record<
    string,
    unknown
  >;
  const businessData = {
    ...baseData,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  return BusinessSchema.parse(businessData) as Business;
}

/**
 * Generates support boost data
 */
function generateSupport(businessIds: string[]): Support {
  const businessId = faker.helpers.arrayElement(businessIds);

  // Pre-calculate dates to ensure endDate is strictly after startDate
  const startDate = faker.date.past({ years: 1 });
  const endDate = new Date(
    startDate.getTime() + faker.number.int({ min: 2, max: 90 }) * 24 * 60 * 60 * 1000
  );

  const unit = faker.helpers.arrayElement(SUPPORT_QUANTITY_UNIT_OPTIONS);
  const isCurrency = unit === 'currency';

  const supportOverrides = {
    id: () => uuidv4(),
    businessId: () => businessId,
    title: () =>
      faker.helpers.arrayElement([
        'Business Training Workshop',
        'Financial Literacy Program',
        'Marketing Support',
        'Technology Upgrade Grant',
        'Mentorship Program',
        'Market Access Support',
        'Equipment Grant',
        'Business Development Service',
      ]),
    boostType: () => faker.helpers.arrayElement(BOOST_TYPE_OPTIONS),
    modality: () => faker.helpers.arrayElement(MODALITY_OPTIONS),
    channel: () => faker.helpers.arrayElement(CHANNEL_OPTIONS),
    dimension: () => faker.helpers.arrayElement(DIMENSION_OPTIONS),
    startDate: () => startDate,
    endDate: () => endDate,
    provider: () => faker.company.name(),
    quantity: () => ({
      value: faker.number.int({ min: 100, max: 10000 }),
      unit: unit,
      currency: isCurrency ? 'XOF' : undefined,
    }),
    genderMarker: () => faker.helpers.arrayElement(GENDER_MARKER_OPTIONS),
    notes: () => faker.lorem.sentence(),
  };

  const baseData = generateMockData(SupportBoostSchema, 'support', supportOverrides) as Record<
    string,
    unknown
  >;
  const supportData = {
    ...baseData,
    createdBy: faker.person.fullName(), // Ensure createdBy is a string
    updatedBy: faker.person.fullName(), // Ensure updatedBy is a string
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  return SupportBoostSchema.parse(supportData) as Support;
}

/**
 * Generates quick win data with indicator values
 */
function generateQuickWin(businesses: Business[], supports: Record<string, unknown>[]): QuickWin {
  const business = faker.helpers.arrayElement(businesses);
  const businessSupports = supports.filter(s => s.businessId === business.id);
  const linkedSupport =
    businessSupports.length > 0 && faker.datatype.boolean()
      ? faker.helpers.arrayElement(businessSupports)
      : undefined;

  const numIndicators = faker.number.int({ min: 1, max: 3 });
  const indicatorValues = [];

  for (let j = 0; j < numIndicators; j++) {
    const indicatorType = faker.helpers.arrayElement(['count', 'currency', 'percent', 'boolean']);
    indicatorValues.push({
      indicatorId: uuidv4(), // Use UUID for indicatorId
      baseline: indicatorType === 'boolean' ? 0 : faker.number.int({ min: 0, max: 100 }),
      target: indicatorType === 'boolean' ? 1 : faker.number.int({ min: 100, max: 200 }),
      currentValue:
        indicatorType === 'boolean'
          ? faker.datatype.boolean()
          : indicatorType === 'currency'
            ? faker.number.int({ min: 10000, max: 500000 })
            : faker.number.int({ min: 50, max: 250 }),
      currency: indicatorType === 'currency' ? 'XOF' : undefined,
      notes: faker.datatype.boolean() ? faker.lorem.sentence() : undefined,
    });
  }

  const dimension =
    (linkedSupport?.dimension as string) || faker.helpers.arrayElement(DIMENSION_OPTIONS);
  const milestones = MaturityCatalog[dimension as MaturityDimension];
  // Fallback to level 1 if something goes wrong
  const milestone = faker.helpers.arrayElement(milestones)?.level || 1;

  const quickWinData = {
    id: uuidv4(),
    businessId: business.id,
    supportBoostId: linkedSupport?.id as string | undefined,
    title: faker.company.catchPhrase(),
    achievedOn: faker.date.past(),
    resultSummary: faker.lorem.paragraph(),
    indicatorValues,
    tags: faker.helpers.arrayElements(
      ['Innovation', 'Growth', 'Digital', 'Green', 'Youth', 'Women'],
      faker.number.int({ min: 1, max: 3 })
    ),
    genderMarker: faker.helpers.arrayElement(GENDER_MARKER_OPTIONS),
    dimension: dimension as any,
    milestone: milestone,
    category: faker.helpers.arrayElement(QUICK_WIN_CATEGORY_OPTIONS),
    rbmLevel: 'output' as const,
    evidenceIds: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  return QuickWinSchema.parse(quickWinData) as QuickWin;
}

/**
 * Generates momentum metric with multiple readings
 */
export function generateMomentumMetrics(businesses: Business[]): MomentumMetric[] {
  const richDataCount = Math.floor(businesses.length * PROB.RICH_DATA_BUSINESSES);

  return businesses.slice(0, richDataCount).flatMap(business => {
    // Safety Guard: Skip businesses without a valid ID
    if (!business?.id) return [];

    const metrics: MomentumMetric[] = [];
    const bizId = business.id;

    // 1. Revenue Growth
    const revSettings = SIM_SETTINGS.REVENUE;
    const revenueBase = faker.number.int({ min: revSettings.MIN, max: revSettings.MAX });
    const revenueReadings = Array.from({ length: revSettings.READING_COUNT }, (_, j) => ({
      value: Math.round(
        revenueBase *
          (1 +
            j * revSettings.GROWTH_STEP +
            (Math.random() * revSettings.VOLATILITY - revSettings.VOLATILITY_OFFSET))
      ),
      asOf: faker.date
        .recent({ days: revSettings.DAYS_WINDOW - j * revSettings.DAYS_STEP })
        .toISOString()
        .split('T')[0],
    }));

    metrics.push(
      buildMetric(bizId, 'REVENUE', [
        {
          name: METRIC_CONFIGS.REVENUE.indicatorName,
          unit: METRIC_CONFIGS.REVENUE.unit,
          baseline: revenueBase,
          target: Math.round(revenueBase * revSettings.TARGET_MULT),
          readings: revenueReadings,
        },
      ])
    );

    // 2. Employment
    const jobSettings = SIM_SETTINGS.JOBS;
    const jobsReadings: any[] = [
      {
        value: faker.number.int({ min: jobSettings.MIN_VAL, max: jobSettings.MAX_VAL }),
        asOf: getTodayStr(),
        disagg: { gender: 'Woman' },
      },
      {
        value: faker.number.int({ min: jobSettings.MIN_VAL, max: jobSettings.MAX_VAL }),
        asOf: getTodayStr(),
        disagg: { ageBand: '15-24' },
      },
    ];
    if (faker.datatype.boolean()) {
      jobsReadings.push({
        value: faker.number.int({ min: jobSettings.MIN_VAL, max: jobSettings.DISABILITY_MAX }),
        asOf: getTodayStr(),
        disagg: { disability: true },
      });
    }

    metrics.push(
      buildMetric(bizId, 'EMPLOYMENT', [
        {
          name: METRIC_CONFIGS.EMPLOYMENT.indicatorName,
          unit: METRIC_CONFIGS.EMPLOYMENT.unit,
          baseline: 0,
          target: jobSettings.TARGET_TOTAL,
          readings: jobsReadings,
        },
      ])
    );

    // 3. Optional Market Expansion
    const mktSettings = SIM_SETTINGS.MARKET;
    if (faker.datatype.boolean()) {
      metrics.push(
        buildMetric(bizId, 'MARKET', [
          {
            name: METRIC_CONFIGS.MARKET.indicatorName,
            unit: METRIC_CONFIGS.MARKET.unit,
            baseline: 0,
            target: mktSettings.TARGET,
            readings: [
              {
                value: 0,
                asOf: faker.date
                  .past({ years: mktSettings.YEARS_PAST })
                  .toISOString()
                  .split('T')[0],
              },
              {
                value: faker.number.int({ min: mktSettings.VAL_MIN, max: mktSettings.VAL_MAX }),
                asOf: getTodayStr(),
              },
            ],
          },
        ])
      );
    }

    // 4. Optional Profitability
    const profSettings = SIM_SETTINGS.PROFIT;
    if (faker.datatype.boolean()) {
      metrics.push(
        buildMetric(bizId, 'PROFIT', [
          {
            name: METRIC_CONFIGS.PROFIT.indicatorName,
            unit: METRIC_CONFIGS.PROFIT.unit,
            baseline: profSettings.BASELINE,
            target: profSettings.TARGET,
            readings: [
              {
                value: profSettings.BASELINE,
                asOf: faker.date
                  .past({ years: mktSettings.YEARS_PAST })
                  .toISOString()
                  .split('T')[0],
              },
              {
                value: faker.number.int({ min: profSettings.BASELINE, max: profSettings.VAL_MAX }),
                asOf: getTodayStr(),
              },
            ],
          },
        ])
      );
    }

    return metrics;
  });
}

/**
 * Clears all database tables
 */
async function clearDatabase(): Promise<void> {
  await db.transaction(
    'rw',
    [
      db.entrepreneurs,
      db.businesses,
      db.supports,
      db.maturityAssessments,
      db.indicatorDefinitions,
      db.measurements,
      db.outputIndicators,
      db.quickWins,
      db.momentumMetrics,
    ],
    async () => {
      await Promise.all([
        db.entrepreneurs.clear(),
        db.businesses.clear(),
        db.supports.clear(),
        db.maturityAssessments.clear(),
        db.indicatorDefinitions.clear(),
        db.measurements.clear(),
        db.outputIndicators.clear(),
        db.quickWins.clear(),
        db.momentumMetrics.clear(),
      ]);
    }
  );
}

/**
 * Seeds database with mock data
 */
export const seedDatabase = async (options: SeedOptions) => {
  const {
    entrepreneurCount,
    businessCount,
    supportCount,
    quickWinCount,
    clear,
    epicenter,
    radius,
  } = options;

  if (clear) {
    await clearDatabase();
  }

  const entrepreneurs: Entrepreneur[] = [];
  const businesses: Business[] = [];
  const supports: Support[] = [];
  const quickWins: QuickWin[] = [];
  const errors: ValidationError[] = [];

  // Generate entrepreneurs
  for (let i = 0; i < entrepreneurCount; i++) {
    try {
      entrepreneurs.push(generateEntrepreneur(i));
    } catch (error) {
      errors.push({ type: 'entrepreneur', index: i, error });
      console.error(`Entrepreneur ${i} validation failed:`, error);
    }
  }

  // Generate businesses
  const entrepreneurIds = entrepreneurs.map(e => e.id).filter((id): id is string => !!id);
  if (!entrepreneurIds?.length)
    return { entrepreneurs, businesses, supports, quickWins, momentumMetrics: [], errors };

  for (let i = 0; i < businessCount; i++) {
    try {
      businesses.push(generateBusiness(i, entrepreneurIds, epicenter, radius));
    } catch (error) {
      errors.push({ type: 'business', index: i, error });
      console.error(`Business ${i} validation failed:`, error);
    }
  }

  // Generate supports
  const businessIds = businesses.map(b => b.id).filter((id): id is string => !!id);
  if (businessIds.length > 0 && supportCount > 0) {
    for (let i = 0; i < supportCount; i++) {
      try {
        supports.push(generateSupport(businessIds));
      } catch (error) {
        errors.push({ type: 'support', index: i, error });
        console.error(`Support ${i} validation failed:`, error);
      }
    }
  }

  // Generate quick wins
  for (let i = 0; i < quickWinCount && businesses.length > 0; i++) {
    try {
      quickWins.push(generateQuickWin(businesses, supports));
    } catch (error) {
      errors.push({ type: 'quickWin', index: i, error });
      console.error(`Quick win ${i} validation failed:`, error);
    }
  }

  // Generate momentum metrics
  const momentumMetrics = generateMomentumMetrics(businesses);

  // Save all data
  await db.transaction(
    'rw',
    [
      db.entrepreneurs,
      db.businesses,
      db.supports,
      db.maturityAssessments,
      db.quickWins,
      db.momentumMetrics,
    ],
    async () => {
      await Promise.all(
        [
          entrepreneurs.length > 0 && db.entrepreneurs.bulkAdd(entrepreneurs),
          businesses.length > 0 && db.businesses.bulkAdd(businesses),
          supports.length > 0 && db.supports.bulkAdd(supports),
          quickWins.length > 0 && db.quickWins.bulkAdd(quickWins),
          momentumMetrics.length > 0 && db.momentumMetrics.bulkAdd(momentumMetrics),
        ].filter(Boolean)
      );
    }
  );

  console.log(`Seeding complete:
    - ${entrepreneurs.length} entrepreneurs
    - ${businesses.length} businesses
    - ${supports.length} supports
    - ${quickWins.length} quick wins
    - ${momentumMetrics.length} momentum metrics
    - ${errors.length} validation errors`);

  return { entrepreneurs, businesses, supports, quickWins, momentumMetrics, errors };
};
