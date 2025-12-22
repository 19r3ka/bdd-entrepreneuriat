/* eslint-disable @typescript-eslint/no-explicit-any */
import { faker } from '@faker-js/faker';
import {
  ZodType,
  ZodNumber,
  ZodString,
  ZodObject,
  ZodArray,
  ZodUnion,
  ZodEnum,
  ZodDate,
  ZodLiteral,
  ZodNullable,
  ZodOptional,
  ZodRecord,
} from 'zod';
import { v4 as uuidv4 } from 'uuid';

// --- Constants (to avoid Magic Numbers) ---
const MAX_WORD_LENGTH = 10;
const DEFAULT_MAX_INT = 1000;
const MIN_ARRAY_LENGTH = 1;
const MAX_ARRAY_LENGTH = 3;
const MIN_RECORD_ENTRIES = 1;
const MAX_RECORD_ENTRIES = 3;
const TOGO_PHONE_NUMBER_DIGITS = 7;
const MAX_LOREM_WORDS = 5;

// --- Custom Data Generation Functions (Shared with seeder.ts) ---

/**
 * Generates a Togolese phone number in E.164 format.
 */
export function generateTogoPhone(): string {
  const firstDigit = faker.helpers.arrayElement(['2', '7', '9']);
  const remainingDigits = faker.string.numeric(TOGO_PHONE_NUMBER_DIGITS);
  return `+228${firstDigit}${remainingDigits}`;
}

/**
 * Type for custom generation functions, keyed by field name.
 */
export type GeneratorOverrides = {
  [key: string]: () => unknown;
};

// --- Zod Type Handlers ---

/**
 * Handles Zod String types, attempting to respect min/max length.
 */
function handleZodString(schema: ZodString): string {
  const def = schema._def;

  let min = 1;
  let max = MAX_WORD_LENGTH;

  if (def.checks) {
    for (const check of def.checks as any[]) {
      if (check.kind === 'min') {
        min = Math.max(min, check.value);
      } else if (check.kind === 'max') {
        max = Math.min(max, check.value);
      } else if (check.kind === 'length') {
        min = max = check.value;
      }
    }
  }

  // Use a sensible default like word/sentence, avoiding lorem.text() for max length limits
  if (max === min) {
    return faker.lorem.word(max);
  }
  return faker.lorem.words(faker.number.int({ min, max: Math.min(max, MAX_LOREM_WORDS) }));
}

/**
 * Handles Zod Number types, respecting min/max.
 */
function handleZodNumber(schema: ZodNumber): number {
  const def = schema._def;
  let min = 0;
  let max = DEFAULT_MAX_INT;

  if (def.checks) {
    for (const check of def.checks as any[]) {
      if (check.kind === 'min') {
        min = Math.max(min, check.value);
      } else if (check.kind === 'max') {
        max = Math.min(max, check.value);
      }
    }
  }

  return faker.number.int({ min, max });
}

/**
 * Handles Zod String types with field name context
 */
function handleZodStringWithContext(baseSchema: ZodString, fieldName: string): string {
  const checks = baseSchema._def.checks || [];

  if (fieldName === 'email' || checks.some((c: any) => c.kind === 'email'))
    return faker.internet.email();
  if (fieldName === 'slug') return faker.helpers.slugify(faker.lorem.words()).toLowerCase();
  if (fieldName === 'address') return faker.location.streetAddress();
  if (fieldName === 'bio' || fieldName.includes('summary')) return faker.lorem.paragraph();
  if (fieldName === 'title' || fieldName === 'name') return faker.person.jobTitle();
  if (fieldName === 'telephone' || fieldName.includes('phone')) return generateTogoPhone();
  if (checks.some((c: any) => c.kind === 'url')) return faker.internet.url();
  if (fieldName === 'gender')
    return faker.helpers.arrayElement(['Woman', 'Man', 'Non-binary', 'Prefer not to say']);
  if (['businessId', 'entrepreneurId'].includes(fieldName)) return uuidv4();

  return handleZodString(baseSchema);
}

/**
 * Handles primitive types for generateMockData.
 */
function handlePrimitiveTypes(baseSchema: ZodType<any, any, any>, fieldName: string): unknown {
  if (baseSchema instanceof ZodString) {
    return handleZodStringWithContext(baseSchema, fieldName);
  }

  if (baseSchema instanceof ZodNumber) {
    return handleZodNumber(baseSchema);
  }

  if (baseSchema instanceof ZodDate) {
    return faker.date.past();
  }

  if ((baseSchema._def as any).typeName === 'ZodBoolean') {
    return faker.datatype.boolean();
  }

  if (fieldName === 'avatar') {
    return faker.image.avatar();
  }

  return undefined;
}

/**
 * Handles complex/container types for generateMockData.
 */
function handleComplexTypes(
  baseSchema: ZodType<any, any, any>,
  fieldName: string,
  overrides: GeneratorOverrides
): unknown {
  if (baseSchema instanceof ZodObject) {
    const obj: Record<string, any> = {};
    for (const [key, value] of Object.entries(baseSchema.shape)) {
      if (value instanceof ZodOptional && !overrides[key] && faker.datatype.boolean()) {
        continue;
      }
      obj[key] = generateMockData(value as ZodType<any, any, any>, key, overrides);
    }
    return obj;
  }

  if (baseSchema instanceof ZodArray) {
    const arrayLength = faker.number.int({ min: MIN_ARRAY_LENGTH, max: MAX_ARRAY_LENGTH });
    const itemSchema = baseSchema.element;
    return Array.from({ length: arrayLength }, () =>
      generateMockData(itemSchema as any, fieldName, overrides)
    );
  }

  if (baseSchema instanceof ZodEnum) {
    return faker.helpers.arrayElement(baseSchema.options);
  }

  if (baseSchema instanceof ZodUnion) {
    return generateMockData(
      faker.helpers.arrayElement(baseSchema.options) as any,
      fieldName,
      overrides
    );
  }

  if (baseSchema instanceof ZodLiteral) {
    return baseSchema.value;
  }

  if (baseSchema instanceof ZodRecord) {
    const record: Record<string, any> = {};
    const numEntries = faker.number.int({ min: MIN_RECORD_ENTRIES, max: MAX_RECORD_ENTRIES });
    for (let i = 0; i < numEntries; i++) {
      record[faker.lorem.word()] = generateMockData(
        baseSchema._def.valueType as ZodType<any, any, any>,
        fieldName,
        overrides
      );
    }
    return record;
  }

  return handlePrimitiveTypes(baseSchema, fieldName);
}

// --- Main Recursive Generator ---

/**
 * Recursively generates mock data from a Zod schema.
 * @param schema The Zod schema to process.
 * @param fieldName The name of the field (used for context-specific generation).
 * @param overrides Custom generation functions for specific field names.
 */
export function generateMockData<T extends ZodType<any, any, any>>(
  schema: T,
  fieldName: string = '',
  overrides: GeneratorOverrides = {}
): unknown {
  // 1. Explicit Overrides (Highest Priority)
  if (overrides[fieldName]) {
    return overrides[fieldName]();
  }

  // 2. Generic Field Overrides (ID, Date)
  if (fieldName === 'id' || fieldName.endsWith('Id')) {
    return uuidv4();
  }
  if (fieldName.toLowerCase().includes('date')) {
    return faker.date.past();
  }

  // 3. Handle ZodEffects
  if ((schema as any)._def?.typeName === 'ZodEffects') {
    const effectSchema = schema as any;
    if (effectSchema._def.effect?.type === 'preprocess') {
      return faker.date.past();
    }
  }

  // 4. Handle ZodNullable and ZodOptional
  if (schema instanceof ZodNullable || schema instanceof ZodOptional) {
    const innerSchema = schema._def.innerType as ZodType<any, any, any>;
    if (faker.datatype.boolean()) {
      return generateMockData(innerSchema, fieldName, overrides);
    }
    return schema instanceof ZodNullable ? null : undefined;
  }

  // 5. Handlers for base types
  return handleComplexTypes(schema, fieldName, overrides);
}
