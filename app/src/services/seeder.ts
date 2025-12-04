import { faker } from '@faker-js/faker'
import { v4 as uuidv4 } from 'uuid'
import { db } from './local-db'
import type { Entrepreneur } from '@/types/entrepreneur'
import type { Business } from '@/types/business'
import { EntrepreneurSchema } from '@/schemas/entrepreneur'
import { BusinessSchema } from '@/schemas/business'
import {
  MaturityDimensions,
  MaturityCatalog,
  type MaturityDimension,
  type MilestoneDefinition
} from '@/constants/maturityCatalog'

// Lomé, Togo coordinates
const LOME_LAT = 6.1375
const LOME_LNG = 1.2125

// Generate random coordinates around a center point
function getRandomLocation(centerLat: number, centerLng: number, radiusKm: number = 10) {
  const r = radiusKm / 111.32 // Convert km to degrees (approx)
  const u = Math.random()
  const v = Math.random()
  const w = r * Math.sqrt(u)
  const t = 2 * Math.PI * v
  const x = w * Math.cos(t)
  const y = w * Math.sin(t)

  // Adjust for longitude shrinking as latitude increases
  const newLat = x + centerLat
  const newLng = y / Math.cos(centerLat * (Math.PI / 180)) + centerLng

  return { latitude: newLat, longitude: newLng }
}

// Generate Togolese phone number in E.164 format
// Pattern: +228(2|7|9)XXXXXXX (8 digits total, starting with 2, 7, or 9)
function generateTogoPhone(): string {
  const firstDigit = faker.helpers.arrayElement(['2', '7', '9'])
  const remainingDigits = faker.string.numeric(7)
  return `+228${firstDigit}${remainingDigits}`
}

export interface SeedOptions {
  entrepreneurCount: number
  businessCount: number
  supportCount: number
  quickWinCount: number
  momentumMetricCount?: number
  clear: boolean
  epicenter?: { latitude: number; longitude: number }
  radius?: number
}

export const seedDatabase = async (options: SeedOptions) => {
  const {
    entrepreneurCount,
    businessCount,
    supportCount,
    quickWinCount,
    clear,
    epicenter,
    radius
  } = options

  // Clear database if requested
  if (clear) {
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
        db.momentumMetrics
      ],
      async () => {
        await db.entrepreneurs.clear()
        await db.businesses.clear()
        await db.supports.clear()
        await db.maturityAssessments.clear()
        await db.indicatorDefinitions.clear()
        await db.measurements.clear()
        await db.outputIndicators.clear()
        await db.quickWins.clear()
        await db.momentumMetrics.clear()
      }
    )
  }

  const entrepreneurs: Entrepreneur[] = []
  const businesses: Business[] = []
  const supports: any[] = []
  const errors: Array<{ type: string; index: number | string; error: any }> = []

  // Generate entrepreneurs
  for (let i = 0; i < entrepreneurCount; i++) {
    const sex = faker.person.sexType()
    const firstName = faker.person.firstName(sex)
    const lastName = faker.person.lastName()
    const email = faker.internet.email({ firstName, lastName })

    const entrepreneurId = uuidv4()

    // Create entrepreneur data with varied optional field completeness
    const entrepreneurData = {
      id: entrepreneurId,
      firstName,
      lastName,
      slug: faker.helpers.slugify(`${firstName} ${lastName}-${i}`).toLowerCase(),
      contact: {
        email,
        telephone: generateTogoPhone()
      },
      // Only 30% have demographics
      ...(faker.number.float() < 0.3 && {
        demographics: {
          gender: sex,
          ageGroup: faker.helpers.arrayElement(['18-24', '25-34', '35-44', '45-54', '55+']),
          educationLevel: faker.helpers.arrayElement([
            'none',
            'primary',
            'secondary',
            'university',
            'vocational'
          ])
        }
      }),
      // Only 20% have bio
      ...(faker.number.float() < 0.2 && {
        bio: faker.lorem.paragraph()
      }),
      // Only 40% have address
      ...(faker.number.float() < 0.4 && {
        address: faker.location.streetAddress()
      }),
      createdAt: new Date(),
      updatedAt: new Date()
    }

    // Validate entrepreneur data
    try {
      const validatedEntrepreneur = EntrepreneurSchema.parse(entrepreneurData) as Entrepreneur
      entrepreneurs.push(validatedEntrepreneur)
    } catch (error) {
      errors.push({ type: 'entrepreneur', index: i, error })
      console.error(`Entrepreneur ${i} validation failed:`, error)
    }
  }

  // Generate businesses - distribute among entrepreneurs
  // Some entrepreneurs may have 0, 1, or 2 businesses
  const entrepreneurIds = entrepreneurs.map((e) => e.id)
  if (entrepreneurIds.length > 0) {
    for (let i = 0; i < businessCount; i++) {
      // Pick a random entrepreneur
      const entrepreneurId = faker.helpers.arrayElement(entrepreneurIds)

      // Use provided epicenter or default to Lomé
      const centerLat = epicenter?.latitude || LOME_LAT
      const centerLng = epicenter?.longitude || LOME_LNG
      const genRadius = radius || 15

      const location = getRandomLocation(centerLat, centerLng, genRadius)

      const businessData = {
        id: uuidv4(),
        entrepreneurId,
        name: faker.company.name(),
        primaryBusinessArea: faker.helpers.arrayElement([
          'A',
          'B',
          'C',
          'D',
          'E',
          'F',
          'G',
          'H',
          'I',
          'J',
          'K',
          'L',
          'M',
          'N',
          'O',
          'P',
          'Q',
          'R',
          'S',
          'T',
          'U'
        ]),
        // Only 70% have activityStartDate - this affects profile completeness!
        activityStartDate: faker.number.float() < 0.7 ? faker.date.past({ years: 3 }) : null,
        supportStartDate: faker.date.past({ years: 2 }),
        location: {
          latitude: location.latitude,
          longitude: location.longitude,
          address: faker.location.streetAddress(),
          city: 'Lomé',
          region: 'Maritime',
          country: 'Togo'
        },
        contact: {
          email: faker.internet.email(),
          // Only 80% have telephone - affects profile completeness!
          ...(faker.number.float() < 0.8 && {
            telephone: generateTogoPhone()
          })
        },
        // Only 50% have description (optional field)
        ...(faker.number.float() < 0.5 && {
          description: faker.company.catchPhrase()
        }),
        // Only 30% have secondary business area (optional field)
        ...(faker.number.float() < 0.3 && {
          secondaryBusinessArea: faker.helpers.arrayElement([
            'A',
            'B',
            'C',
            'D',
            'E',
            'F',
            'G',
            'H',
            'I',
            'J',
            'K',
            'L',
            'M',
            'N',
            'O',
            'P',
            'Q',
            'R',
            'S',
            'T',
            'U'
          ])
        }),
        // Only 60% have registration number (optional field)
        ...(faker.number.float() < 0.6 && {
          registrationNumber: faker.string.alphanumeric(10).toUpperCase()
        }),
        // Only 70% have registration date (optional field)
        ...(faker.number.float() < 0.7 && {
          registrationDate: faker.date.past({ years: 5 })
        }),
        // Only 40% have social media (optional field)
        ...(faker.number.float() < 0.4 && {
          socialMedia: {
            ...(faker.datatype.boolean() && {
              facebook: `https://facebook.com/${faker.lorem.slug()}`
            }),
            ...(faker.datatype.boolean() && { whatsapp: generateTogoPhone() })
          }
        }),
        createdAt: new Date(),
        updatedAt: new Date(),
        maturityLevels: {
          Digital: faker.number.int({ min: 1, max: 4 }),
          Finance: faker.number.int({ min: 1, max: 4 }),
          Market: faker.number.int({ min: 1, max: 4 }),
          Green: faker.number.int({ min: 1, max: 4 }),
          Formalization: faker.number.int({ min: 1, max: 4 })
        }
      }

      // Validate business data
      try {
        const validatedBusiness = BusinessSchema.parse(businessData) as Business
        businesses.push(validatedBusiness)
      } catch (error) {
        errors.push({ type: 'business', index: i, error })
        console.error(`Business ${i} validation failed:`, error)
      }
    }
  }

  // Generate supports - distribute among businesses
  // Not all businesses will have supports
  const businessIds = businesses.map((b) => b.id)
  if (businessIds.length > 0 && supportCount > 0) {
    for (let i = 0; i < supportCount; i++) {
      const businessId = faker.helpers.arrayElement(businessIds)

      const supportData = {
        id: uuidv4(),
        businessId,
        title: faker.helpers.arrayElement([
          'Business Training Workshop',
          'Financial Literacy Program',
          'Marketing Support',
          'Technology Upgrade Grant',
          'Mentorship Program',
          'Market Access Support',
          'Equipment Grant',
          'Business Development Service'
        ]),
        boostType: faker.helpers.arrayElement([
          'training',
          'finance',
          'mentorship',
          'infrastructure',
          'market_access',
          'technology'
        ]),
        modality: faker.helpers.arrayElement(['DIM', 'NIM', 'hybrid']),
        dimension: faker.helpers.arrayElement(MaturityDimensions),
        startDate: faker.date.past({ years: 1 }).toISOString().split('T')[0],
        ...(faker.number.float() < 0.6 && {
          endDate: faker.date.recent({ days: 30 }).toISOString().split('T')[0]
        }),
        ...(faker.number.float() < 0.7 && {
          provider: faker.company.name()
        }),
        ...(faker.number.float() < 0.5 && {
          channel: faker.helpers.arrayElement(['in-person', 'online', 'hybrid'])
        }),
        quantity: {
          ...(faker.number.float() < 0.6 && {
            value: faker.number.int({ min: 100, max: 10000 }),
            unit: faker.helpers.arrayElement(['currency', 'hours', 'sessions', 'participants']),
            ...(faker.number.float() < 0.5 && { currency: 'XOF' })
          })
        },
        genderMarker: faker.helpers.arrayElement(['GEN0', 'GEN1', 'GEN2', 'GEN3']),
        ...(faker.number.float() < 0.3 && {
          notes: faker.lorem.sentence()
        }),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      supports.push(supportData)
    }
  }

  // Generate Quick Wins
  const quickWins: any[] = []

  for (let i = 0; i < quickWinCount; i++) {
    if (businesses.length === 0) break

    const business = faker.helpers.arrayElement(businesses)
    // 50% chance to link to a support if available for this business
    const businessSupports = supports.filter((s) => s.businessId === business.id)
    const linkedSupport =
      businessSupports.length > 0 && faker.datatype.boolean()
        ? faker.helpers.arrayElement(businessSupports)
        : undefined

    // Generate 1-3 indicator values directly for this QuickWin
    const numIndicators = faker.number.int({ min: 1, max: 3 })
    const indicatorValues = []

    for (let j = 0; j < numIndicators; j++) {
      const indicatorType = faker.helpers.arrayElement(['count', 'currency', 'percent', 'boolean'])
      indicatorValues.push({
        indicatorId: faker.helpers.arrayElement([
          'revenue_growth',
          'customer_acquisition',
          'funding_secured',
          'staff_hired',
          'market_share',
          'digital_adoption',
          'certification_obtained'
        ]),
        baseline: indicatorType === 'boolean' ? 0 : faker.number.int({ min: 0, max: 100 }),
        target: indicatorType === 'boolean' ? 1 : faker.number.int({ min: 100, max: 200 }),
        currentValue:
          indicatorType === 'boolean'
            ? faker.datatype.boolean()
            : indicatorType === 'currency'
              ? faker.number.int({ min: 10000, max: 500000 })
              : faker.number.int({ min: 50, max: 250 }),
        notes: faker.datatype.boolean() ? faker.lorem.sentence() : undefined
      })
    }

    const dimension = linkedSupport?.dimension || faker.helpers.arrayElement(MaturityDimensions)

    // Pick a random milestone for this dimension
    const milestones = MaturityCatalog[dimension as MaturityDimension]
    const milestone = faker.helpers.arrayElement(milestones)

    const quickWin = {
      id: uuidv4(),
      businessId: business.id,
      supportBoostId: linkedSupport?.id,
      title: faker.company.catchPhrase(),
      achievedOn: faker.date.past().toISOString(),
      resultSummary: faker.lorem.paragraph(),
      indicatorValues,
      tags: faker.helpers.arrayElements(
        ['Innovation', 'Growth', 'Digital', 'Green', 'Youth', 'Women'],
        faker.number.int({ min: 1, max: 3 })
      ),
      genderMarker: faker.helpers.arrayElement(['GEN0', 'GEN1', 'GEN2', 'GEN3']),
      dimension,
      milestone: (milestone as MilestoneDefinition).level, // Store just the level number
      category: 'performance' as const, // Add required category field
      rbmLevel: 'output' as const, // Add required rbmLevel field
      evidenceIds: [], // Add required evidenceIds field
      createdAt: new Date(),
      updatedAt: new Date()
    }

    quickWins.push(quickWin)
  }

  // Generate Momentum Metrics
  const momentumMetrics: any[] = []
  const momentumMetricCount = options.momentumMetricCount || 0

  // Generate Momentum Metrics with specific Business Health focus
  const richDataBusinesses = businesses.slice(0, Math.floor(businesses.length * 0.4)) // 40% get rich data

  for (const business of richDataBusinesses) {
    // 1. Revenue Growth (Economic)
    const revenueMetricId = uuidv4()
    const revenueBase = faker.number.int({ min: 1000000, max: 5000000 })
    const revenueReadings = []
    for (let j = 0; j < 6; j++) {
      revenueReadings.push({
        value: Math.round(revenueBase * (1 + j * 0.05 + (Math.random() * 0.1 - 0.05))), // Upward trend
        asOf: faker.date
          .recent({ days: 180 - j * 30 })
          .toISOString()
          .split('T')[0]
      })
    }

    momentumMetrics.push({
      momentumMetricId: revenueMetricId,
      businessId: business.id,
      title: 'Monthly Revenue Growth',
      category: 'performance',
      rbmLevel: 'outcome',
      dimension: 'Finance',
      indicators: [
        {
          name: 'Monthly Revenue',
          unit: 'currency',
          baseline: revenueBase,
          target: Math.round(revenueBase * 1.5),
          readings: revenueReadings
        }
      ],
      irrfIndicatorIds: ['IRRF-1.1.2'],
      sdgTargets: ['8.3'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })

    // 2. Jobs Created (Social) - with Disaggregation
    const jobsMetricId = uuidv4()
    const jobsBase = faker.number.int({ min: 2, max: 10 })
    const jobsReadings = []
    // Create a reading that represents the total, but we'll add disagg metadata if schema allowed
    // Since schema has disagg object on reading, we create separate readings or one reading with disagg?
    // The store logic sums up readings if they have disagg.
    // Let's create specific readings for disaggregated groups to test the store summation logic

    // Reading 1: Women
    jobsReadings.push({
      value: faker.number.int({ min: 1, max: 5 }),
      asOf: new Date().toISOString().split('T')[0],
      disagg: { gender: 'female' }
    })
    // Reading 2: Youth
    jobsReadings.push({
      value: faker.number.int({ min: 1, max: 5 }),
      asOf: new Date().toISOString().split('T')[0],
      disagg: { ageBand: '15-24' }
    })
    // Reading 3: Disability
    if (faker.datatype.boolean()) {
      jobsReadings.push({
        value: faker.number.int({ min: 1, max: 2 }),
        asOf: new Date().toISOString().split('T')[0],
        disagg: { disability: true }
      })
    }

    momentumMetrics.push({
      momentumMetricId: jobsMetricId,
      businessId: business.id,
      title: 'Employment Creation',
      category: 'employment_inclusion',
      rbmLevel: 'outcome',
      dimension: 'Formalization', // or Social
      indicators: [
        {
          name: 'Full-time Jobs Created',
          unit: 'count',
          baseline: 0,
          target: 10,
          readings: jobsReadings
        }
      ],
      irrfIndicatorIds: ['IRRF-2.3.1'],
      sdgTargets: ['8.5'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })

    // 3. Market Growth (Export/Regional)
    if (faker.datatype.boolean()) {
      const marketMetricId = uuidv4()
      const exportReadings = [
        { value: 0, asOf: faker.date.past({ years: 1 }).toISOString().split('T')[0] },
        {
          value: faker.number.int({ min: 10000, max: 50000 }),
          asOf: new Date().toISOString().split('T')[0]
        }
      ]

      momentumMetrics.push({
        momentumMetricId: marketMetricId,
        businessId: business.id,
        title: 'Export Sales Expansion',
        category: 'market_integration',
        rbmLevel: 'outcome',
        dimension: 'Market',
        indicators: [
          {
            name: 'Export Sales Volume',
            unit: 'currency',
            baseline: 0,
            target: 100000,
            readings: exportReadings
          }
        ],
        irrfIndicatorIds: ['IRRF-MKT-3A'],
        sdgTargets: ['17.11'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
    }

    // 4. Profitability
    if (faker.datatype.boolean()) {
      const profitMetricId = uuidv4()
      const profitReadings = [
        { value: 5, asOf: faker.date.past({ years: 1 }).toISOString().split('T')[0] },
        {
          value: faker.number.int({ min: 10, max: 25 }),
          asOf: new Date().toISOString().split('T')[0]
        }
      ]

      momentumMetrics.push({
        momentumMetricId: profitMetricId,
        businessId: business.id,
        title: 'Net Profit Margin',
        category: 'performance',
        rbmLevel: 'outcome',
        dimension: 'Finance',
        indicators: [
          {
            name: 'Net Profit Margin',
            unit: 'percent',
            baseline: 5,
            target: 20,
            readings: profitReadings
          }
        ],
        irrfIndicatorIds: ['IRRF-FIN-1A'], // Approximate
        sdgTargets: ['8.2'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
    }
  }

  // Save all data
  await db.transaction(
    'rw',
    [
      db.entrepreneurs,
      db.businesses,
      db.supports,
      db.maturityAssessments,
      db.quickWins,
      db.momentumMetrics
    ],
    async () => {
      if (entrepreneurs.length > 0) await db.entrepreneurs.bulkAdd(entrepreneurs)
      if (businesses.length > 0) await db.businesses.bulkAdd(businesses)
      if (supports.length > 0) await db.supports.bulkAdd(supports)
      if (quickWins.length > 0) await db.quickWins.bulkAdd(quickWins)
      if (momentumMetrics.length > 0) await db.momentumMetrics.bulkAdd(momentumMetrics)
    }
  )

  console.log(`Seeding complete:
    - ${entrepreneurs.length} entrepreneurs
    - ${businesses.length} businesses
    - ${supports.length} supports
    - ${quickWins.length} quick wins
    - ${momentumMetrics.length} momentum metrics
    - ${errors.length} validation errors`)

  return { entrepreneurs, businesses, supports, quickWins, momentumMetrics, errors }
}
