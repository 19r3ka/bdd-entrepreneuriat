import { describe, it, expect } from 'vitest';
import { QuickWinSchema } from './QuickWin';

describe('QuickWinSchema', () => {
  const validQuickWin = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    businessId: '123e4567-e89b-12d3-a456-426614174001',
    supportBoostId: '123e4567-e89b-12d3-a456-426614174002',
    title: 'Digital storefront launched',
    category: 'digital_adoption',
    dimension: 'Digital',
    milestone: 2,
    resultSummary: 'Successfully launched online store which increased customer reach by 40%.',
    achievedOn: '2023-06-15',
    rbmLevel: 'output',
    cpdOutputCode: 'CPD456',
    spOutcomeCode: 'SPO789',
    irrfIndicatorIds: ['IRRF1', 'IRRF2'],
    sdgTargets: ['SDG8', 'SDG9'],
    genderMarker: 'GEN1',
    indicatorValues: [
      {
        indicatorId: '123e4567-e89b-12d3-a456-426614174003',
        baseline: 0,
        target: 1,
        currentValue: 1,
        currency: 'USD',
        notes: 'Digital presence established',
      },
    ],
    evidenceIds: ['123e4567-e89b-12d3-a456-426614174004', '123e4567-e89b-12d3-a456-426614174005'],
    tags: ['digital', 'marketing'],
    createdAt: '2023-01-01T00:00:00Z',
    createdBy: 'test-user',
    updatedAt: '2023-01-01T00:00:00Z',
    updatedBy: 'test-user',
  };

  it('should accept valid quick win data', () => {
    const result = QuickWinSchema.safeParse(validQuickWin);
    expect(result.success).toBe(true);
  });

  it('should reject quick win with invalid UUIDs', () => {
    const invalidQuickWin = {
      ...validQuickWin,
      id: 'invalid-uuid',
    };
    const result = QuickWinSchema.safeParse(invalidQuickWin);
    expect(result.success).toBe(false);
  });

  it('should reject quick win with missing required fields', () => {
    const incompleteQuickWin = {
      ...validQuickWin,
      title: '', // Missing required field
    };
    const result = QuickWinSchema.safeParse(incompleteQuickWin);
    expect(result.success).toBe(false);
    expect(result.error!.issues[0]!.message).toContain('Too small');
  });

  it('should reject quick win with invalid title length', () => {
    const invalidQuickWin = {
      ...validQuickWin,
      title: 'A', // Too short, min length is 2
    };
    const result = QuickWinSchema.safeParse(invalidQuickWin);
    expect(result.success).toBe(false);
  });

  const MAX_TITLE_LENGTH = 140;
  const EXCEEDING_TITLE_LENGTH = MAX_TITLE_LENGTH + 1; // 141
  const MIN_RESULT_SUMMARY_LENGTH = 10;
  const MAX_RESULT_SUMMARY_LENGTH = 500;
  const EXCEEDING_SUMMARY_LENGTH = MAX_RESULT_SUMMARY_LENGTH + 1; // 501
  const BELOW_MIN_SUMMARY_LENGTH = MIN_RESULT_SUMMARY_LENGTH - 1; // 9
  const MAX_INDICATOR_NOTES_LENGTH = 200;
  const EXCEEDING_NOTES_LENGTH = MAX_INDICATOR_NOTES_LENGTH + 1; // 201
  const MIN_MILESTONE = 1;
  const MAX_MILESTONE = 4;
  const BELOW_MIN_MILESTONE = MIN_MILESTONE - 1; // 0
  const ABOVE_MAX_MILESTONE = MAX_MILESTONE + 1; // 5

  it('should reject quick win with title exceeding max length', () => {
    const invalidQuickWin = {
      ...validQuickWin,
      title: 'a'.repeat(EXCEEDING_TITLE_LENGTH), // Exceeds max length of MAX_TITLE_LENGTH
    };
    const result = QuickWinSchema.safeParse(invalidQuickWin);
    expect(result.success).toBe(false);
  });

  it('should accept quick win with valid category values', () => {
    const categories = [
      'digital_adoption',
      'finance_access',
      'market_integration',
      'innovation',
      'performance',
      'employment_inclusion',
      'resilience',
      'sustainability',
    ];

    for (const category of categories) {
      const quickWin = {
        ...validQuickWin,
        category: category,
      };
      const result = QuickWinSchema.safeParse(quickWin);
      expect(result.success).toBe(true);
    }
  });

  it('should reject quick win with invalid category', () => {
    const invalidQuickWin = {
      ...validQuickWin,
      category: 'invalid_category' as any,
    };
    const result = QuickWinSchema.safeParse(invalidQuickWin);
    expect(result.success).toBe(false);
  });

  it('should validate milestone range', () => {
    // Test below minimum
    const belowMinimum = {
      ...validQuickWin,
      milestone: BELOW_MIN_MILESTONE,
    };
    let result = QuickWinSchema.safeParse(belowMinimum);
    expect(result.success).toBe(false);

    // Test above maximum
    const aboveMaximum = {
      ...validQuickWin,
      milestone: ABOVE_MAX_MILESTONE,
    };
    result = QuickWinSchema.safeParse(aboveMaximum);
    expect(result.success).toBe(false);

    // Test valid ranges
    for (const validMilestone of [
      MIN_MILESTONE,
      MIN_MILESTONE + 1,
      MIN_MILESTONE + 2,
      MAX_MILESTONE,
    ]) {
      const quickWin = {
        ...validQuickWin,
        milestone: validMilestone,
      };
      result = QuickWinSchema.safeParse(quickWin);
      expect(result.success).toBe(true);
    }
  });

  it('should reject quick win with resultSummary below minimum length', () => {
    const invalidQuickWin = {
      ...validQuickWin,
      resultSummary: 'A'.repeat(BELOW_MIN_SUMMARY_LENGTH), // Below minimum length of MIN_RESULT_SUMMARY_LENGTH
    };
    const result = QuickWinSchema.safeParse(invalidQuickWin);
    expect(result.success).toBe(false);
  });

  it('should reject quick win with resultSummary exceeding maximum length', () => {
    const invalidQuickWin = {
      ...validQuickWin,
      resultSummary: 'A'.repeat(EXCEEDING_SUMMARY_LENGTH), // Exceeds maximum length of MAX_RESULT_SUMMARY_LENGTH
    };
    const result = QuickWinSchema.safeParse(invalidQuickWin);
    expect(result.success).toBe(false);
  });

  it('should validate date format for achievedOn', () => {
    const invalidQuickWin = {
      ...validQuickWin,
      achievedOn: 'invalid-date',
    };
    const result = QuickWinSchema.safeParse(invalidQuickWin);
    expect(result.success).toBe(false);
  });

  it('should accept quick win with valid achievedOn date format', () => {
    const quickWin = {
      ...validQuickWin,
      achievedOn: '2023-06-15', // Valid date format
    };
    const result = QuickWinSchema.safeParse(quickWin);
    expect(result.success).toBe(true);
  });

  it('should accept quick win with optional fields omitted', () => {
    const quickWinWithoutOptionals = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      businessId: '123e4567-e89b-12d3-a456-426614174001',
      title: 'Simple Win',
      category: 'performance',
      resultSummary: 'Achieved simple result',
      achievedOn: '2023-06-15',
    };
    const result = QuickWinSchema.safeParse(quickWinWithoutOptionals);
    expect(result.success).toBe(true);
  });

  it('should accept quick win with empty indicatorValues array', () => {
    const quickWinWithEmptyIndicators = {
      ...validQuickWin,
      indicatorValues: [],
    };
    const result = QuickWinSchema.safeParse(quickWinWithEmptyIndicators);
    expect(result.success).toBe(true);
  });

  it('should have rbmLevel default to output', () => {
    const quickWinWithoutRbmLevel = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      businessId: '123e4567-e89b-12d3-a456-426614174001',
      title: 'Simple Win',
      category: 'performance',
      resultSummary: 'Achieved simple result',
      achievedOn: '2023-06-15',
    };
    const result = QuickWinSchema.safeParse(quickWinWithoutRbmLevel);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.rbmLevel).toBe('output');
    }
  });

  it('should validate indicator values', () => {
    const quickWinWithValidIndicator = {
      ...validQuickWin,
      indicatorValues: [
        {
          indicatorId: '123e4567-e89b-12d3-a456-426614174003',
          baseline: 0,
          target: 1,
          currentValue: 1,
          currency: 'USD',
          notes: 'Valid indicator notes',
        },
      ],
    };
    const result = QuickWinSchema.safeParse(quickWinWithValidIndicator);
    expect(result.success).toBe(true);

    // Test invalid indicator - currency without currency code
    const quickWinWithInvalidIndicator = {
      ...validQuickWin,
      indicatorValues: [
        {
          indicatorId: '123e4567-e89b-12d3-a456-426614174003',
          baseline: 5000,
          target: 7500,
          currentValue: 6000,
          currency: 'US', // Invalid - should be 3 letters
        },
      ],
    };
    const invalidResult = QuickWinSchema.safeParse(quickWinWithInvalidIndicator);
    expect(invalidResult.success).toBe(false);
  });

  it('should accept various value types for currentValue in indicator values', () => {
    const testCases = [
      { currentValue: 100 },
      { currentValue: true },
      { currentValue: 'completed' },
    ];

    for (const testCase of testCases) {
      const quickWinWithIndicatorType = {
        ...validQuickWin,
        indicatorValues: [
          {
            indicatorId: '123e4567-e89b-12d3-a456-426614174003',
            ...testCase,
          },
        ],
      };
      const result = QuickWinSchema.safeParse(quickWinWithIndicatorType);
      expect(
        result.success,
        `Failed for current value: ${JSON.stringify(testCase.currentValue)}`
      ).toBe(true);
    }
  });

  it('should respect max length for indicator notes', () => {
    const quickWinWithLongNotes = {
      ...validQuickWin,
      indicatorValues: [
        {
          indicatorId: '123e4567-e89b-12d3-a456-426614174003',
          notes: 'a'.repeat(EXCEEDING_NOTES_LENGTH), // Exceeds max length of MAX_INDICATOR_NOTES_LENGTH
        },
      ],
    };
    const result = QuickWinSchema.safeParse(quickWinWithLongNotes);
    expect(result.success).toBe(false);
  });
});
