import { faker } from '@faker-js/faker';
import { v4 as uuidv4 } from 'uuid';
import { db } from './local-db';
import type { Entrepreneur } from '@/types/entrepreneur';
import type { Business } from '@/types/business';
import { EntrepreneurSchema } from '@/schemas/entrepreneur';
import { BusinessSchema } from '@/schemas/business';

// Lomé, Togo coordinates
const LOME_LAT = 6.1375;
const LOME_LNG = 1.2125;

// Generate random coordinates around a center point
function getRandomLocation(centerLat: number, centerLng: number, radiusKm: number = 10) {
    const r = radiusKm / 111.32; // Convert km to degrees (approx)
    const u = Math.random();
    const v = Math.random();
    const w = r * Math.sqrt(u);
    const t = 2 * Math.PI * v;
    const x = w * Math.cos(t);
    const y = w * Math.sin(t);

    // Adjust for longitude shrinking as latitude increases
    const newLat = x + centerLat;
    const newLng = y / Math.cos(centerLat * (Math.PI / 180)) + centerLng;

    return { latitude: newLat, longitude: newLng };
}

// Generate Togolese phone number in E.164 format
// Pattern: +228(2|7|9)XXXXXXX (8 digits total, starting with 2, 7, or 9)
function generateTogoPhone(): string {
    const firstDigit = faker.helpers.arrayElement(['2', '7', '9']);
    const remainingDigits = faker.string.numeric(7);
    return `+228${firstDigit}${remainingDigits}`;
}

export interface SeedOptions {
    entrepreneurCount: number;
    businessCount: number;
    supportCount: number;
    clear: boolean;
}

export const seedDatabase = async (options: SeedOptions) => {
    const { entrepreneurCount, businessCount, supportCount, clear } = options;

    if (clear) {
        await db.transaction('rw', [db.entrepreneurs, db.businesses, db.supports, db.maturityAssessments, db.indicatorDefinitions, db.measurements], async () => {
            await db.entrepreneurs.clear();
            await db.businesses.clear();
            await db.supports.clear();
            await db.maturityAssessments.clear();
            await db.indicatorDefinitions.clear();
            await db.measurements.clear();
        });
    }

    const entrepreneurs: Entrepreneur[] = [];
    const businesses: Business[] = [];
    const supports: any[] = []; // Will be Support[] when we generate them
    const errors: Array<{ type: string; index: number | string; error: any }> = [];

    // Generate entrepreneurs
    for (let i = 0; i < entrepreneurCount; i++) {
        const sex = faker.person.sexType();
        const firstName = faker.person.firstName(sex);
        const lastName = faker.person.lastName();
        const email = faker.internet.email({ firstName, lastName });

        const entrepreneurId = uuidv4();

        // Create entrepreneur data with varied optional field completeness
        const entrepreneurData = {
            id: entrepreneurId,
            firstName,
            lastName,
            slug: faker.helpers.slugify(`${firstName} ${lastName}-${i}`).toLowerCase(),
            contact: {
                email,
                telephone: generateTogoPhone(),
            },
            // Only 30% have demographics
            ...(faker.number.float() < 0.3 && {
                demographics: {
                    gender: sex,
                    ageGroup: faker.helpers.arrayElement(['18-24', '25-34', '35-44', '45-54', '55+']),
                    educationLevel: faker.helpers.arrayElement(['none', 'primary', 'secondary', 'university', 'vocational']),
                },
            }),
            // Only 20% have bio
            ...(faker.number.float() < 0.2 && {
                bio: faker.lorem.paragraph(),
            }),
            // Only 40% have address
            ...(faker.number.float() < 0.4 && {
                address: faker.location.streetAddress(),
            }),
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        // Validate entrepreneur data
        try {
            const validatedEntrepreneur = EntrepreneurSchema.parse(entrepreneurData) as Entrepreneur;
            entrepreneurs.push(validatedEntrepreneur);
        } catch (error) {
            errors.push({ type: 'entrepreneur', index: i, error });
            console.error(`Entrepreneur ${i} validation failed:`, error);
        }
    }

    // Generate businesses - distribute among entrepreneurs
    // Some entrepreneurs may have 0, 1, or 2 businesses
    const entrepreneurIds = entrepreneurs.map(e => e.id);
    if (entrepreneurIds.length > 0) {
        for (let i = 0; i < businessCount; i++) {
            // Pick a random entrepreneur
            const entrepreneurId = faker.helpers.arrayElement(entrepreneurIds);
            const location = getRandomLocation(LOME_LAT, LOME_LNG, 15);

            const businessData = {
                id: uuidv4(),
                entrepreneurId,
                name: faker.company.name(),
                primaryBusinessArea: faker.helpers.arrayElement(['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U']),
                activityStartDate: faker.date.past({ years: 3 }),
                supportStartDate: faker.date.past({ years: 2 }),
                location: {
                    latitude: location.latitude,
                    longitude: location.longitude,
                    address: faker.location.streetAddress(),
                    city: 'Lomé',
                    region: 'Maritime',
                    country: 'Togo',
                },
                contact: {
                    email: faker.internet.email(),
                    telephone: generateTogoPhone(),
                },
                // Only 50% have description
                ...(faker.number.float() < 0.5 && {
                    description: faker.company.catchPhrase(),
                }),
                // Only 30% have secondary business area
                ...(faker.number.float() < 0.3 && {
                    secondaryBusinessArea: faker.helpers.arrayElement(['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U']),
                }),
                // Only 60% have registration number
                ...(faker.number.float() < 0.6 && {
                    registrationNumber: faker.string.alphanumeric(10).toUpperCase(),
                }),
                // Only 70% have registration date
                ...(faker.number.float() < 0.7 && {
                    registrationDate: faker.date.past({ years: 5 }),
                }),
                // Only 40% have social media
                ...(faker.number.float() < 0.4 && {
                    socialMedia: {
                        ...(faker.datatype.boolean() && { facebook: `https://facebook.com/${faker.lorem.slug()}` }),
                        ...(faker.datatype.boolean() && { whatsapp: generateTogoPhone() }),
                    },
                }),
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            // Validate business data
            try {
                const validatedBusiness = BusinessSchema.parse(businessData) as Business;
                businesses.push(validatedBusiness);
            } catch (error) {
                errors.push({ type: 'business', index: i, error });
                console.error(`Business ${i} validation failed:`, error);
            }
        }
    }

    // Generate supports - distribute among businesses
    // Not all businesses will have supports
    const businessIds = businesses.map(b => b.id);
    if (businessIds.length > 0 && supportCount > 0) {
        for (let i = 0; i < supportCount; i++) {
            const businessId = faker.helpers.arrayElement(businessIds);

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
                    'Business Development Service',
                ]),
                boostType: faker.helpers.arrayElement(['training', 'finance', 'mentorship', 'infrastructure', 'market_access', 'technology']),
                modality: faker.helpers.arrayElement(['DIM', 'NIM', 'hybrid']),
                startDate: faker.date.past({ years: 1 }).toISOString().split('T')[0],
                ...(faker.number.float() < 0.6 && {
                    endDate: faker.date.recent({ days: 30 }).toISOString().split('T')[0],
                }),
                ...(faker.number.float() < 0.7 && {
                    provider: faker.company.name(),
                }),
                ...(faker.number.float() < 0.5 && {
                    channel: faker.helpers.arrayElement(['in-person', 'online', 'hybrid']),
                }),
                quantity: {
                    ...(faker.number.float() < 0.6 && {
                        value: faker.number.int({ min: 100, max: 10000 }),
                        unit: faker.helpers.arrayElement(['currency', 'hours', 'sessions', 'participants']),
                        ...(faker.number.float() < 0.5 && { currency: 'XOF' }),
                    }),
                },
                genderMarker: faker.helpers.arrayElement(['GEN0', 'GEN1', 'GEN2', 'GEN3']),
                ...(faker.number.float() < 0.3 && {
                    notes: faker.lorem.sentence(),
                }),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };

            supports.push(supportData);
        }
    }

    // Save all data
    if (entrepreneurs.length > 0 || businesses.length > 0 || supports.length > 0) {
        await db.transaction('rw', [db.entrepreneurs, db.businesses, db.supports], async () => {
            if (entrepreneurs.length > 0) {
                await db.entrepreneurs.bulkAdd(entrepreneurs);
            }
            if (businesses.length > 0) {
                await db.businesses.bulkAdd(businesses);
            }
            if (supports.length > 0) {
                await db.supports.bulkAdd(supports);
            }
        });
    }

    // Return results including any errors
    return {
        entrepreneurs: entrepreneurs.length,
        businesses: businesses.length,
        supports: supports.length,
        errors: errors.length > 0 ? errors : undefined
    };
};
