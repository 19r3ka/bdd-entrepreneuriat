import { setActivePinia, createPinia } from 'pinia';
import { beforeEach, describe, it, expect, vi } from 'vitest';
import { useMaturityStore } from './useMaturityStore';
import { db } from '@/services/local-db';
import type { MaturityAssessment } from '@/types/monitoring-evaluation/Maturity';

// Mock the local-db Dexie instance
vi.mock('@/services/local-db', () => {
  const assessments: MaturityAssessment[] = [];
  return {
    db: {
      maturityAssessments: {
        add: vi.fn(async (assessment: MaturityAssessment) => {
          assessments.push(assessment);
          return assessment.id;
        }),
        get: vi.fn(async (id: string) => assessments.find(a => a.id === id)),
        toArray: vi.fn(async () => assessments),
        where: vi.fn((criteria: { businessId?: string }) => ({
          toArray: vi.fn(async () => assessments.filter(a => a.businessId === criteria.businessId)),
        })),
        update: vi.fn(async (id: string, changes: Partial<MaturityAssessment>) => {
          const index = assessments.findIndex(a => a.id === id);
          if (index !== -1) {
            Object.assign(assessments[index], changes);
            return 1;
          }
          return 0;
        }),
        delete: vi.fn(async (id: string) => {
            const index = assessments.findIndex(a => a.id === id);
            if (index !== -1) {
                assessments.splice(index, 1);
                return 1;
            }
            return 0;
        }),
      },
    },
  };
});

describe('useMaturityStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    // Reset the mock db before each test
    db.maturityAssessments.toArray = vi.fn(async () => []);
    db.maturityAssessments.add = vi.fn(async (assessment: MaturityAssessment) => {
        const assessments = await db.maturityAssessments.toArray();
        assessments.push(assessment);
        return assessment.id;
    });
  });

  const mockAssessment: Omit<MaturityAssessment, 'id' | 'createdAt' | 'updatedAt'> = {
    businessId: 'business-123',
    achievedMilestoneIds: ['FORM_1'],
    computedScores: { FORMALIZATION: 20 },
    notes: 'Test assessment',
  };

  it('should add a new maturity assessment', async () => {
    const store = useMaturityStore();
    const addedAssessment = await store.addMaturityAssessment(mockAssessment);

    expect(addedAssessment).toHaveProperty('id');
    expect(addedAssessment.businessId).toBe('business-123');
    expect(store.assessments).toContainEqual(addedAssessment);
    expect(db.maturityAssessments.add).toHaveBeenCalled();
  });

  it('should get a maturity assessment by id', async () => {
    const store = useMaturityStore();
    const addedAssessment = await store.addMaturityAssessment(mockAssessment);
    
    // Adjust mock for get
    db.maturityAssessments.get = vi.fn(async (id: string) => {
        if (id === addedAssessment.id) {
            return addedAssessment;
        }
        return undefined;
    });

    const fetched = await store.getMaturityAssessmentById(addedAssessment.id);
    expect(fetched).toEqual(addedAssessment);
  });

  it('should get a maturity assessment by business id', async () => {
    const store = useMaturityStore();
    const addedAssessment = await store.addMaturityAssessment(mockAssessment);
    
    // Adjust mock for where
    db.maturityAssessments.where = vi.fn((criteria: { businessId?: string }) => ({
      toArray: vi.fn(async () => {
        if (criteria.businessId === addedAssessment.businessId) {
            return [addedAssessment];
        }
        return [];
      }),
    }));

    const fetched = await store.getMaturityAssessmentByBusinessId(addedAssessment.businessId);
    expect(fetched).toEqual(addedAssessment);
  });

  it('should update a maturity assessment', async () => {
    const store = useMaturityStore();
    const addedAssessment = await store.addMaturityAssessment(mockAssessment);
    const updates: Partial<MaturityAssessment> = { notes: 'Updated notes' };
    
    db.maturityAssessments.update = vi.fn().mockResolvedValue(1);

    await store.updateMaturityAssessment(addedAssessment.id, updates);
    expect(db.maturityAssessments.update).toHaveBeenCalledWith(addedAssessment.id, expect.objectContaining(updates));
  });

  it('should delete a maturity assessment', async () => {
    const store = useMaturityStore();
    const addedAssessment = await store.addMaturityAssessment(mockAssessment);
    
    db.maturityAssessments.delete = vi.fn().mockResolvedValue(1);
    store.assessments = [addedAssessment]; // Manually set store state for test

    await store.deleteMaturityAssessment(addedAssessment.id);
    expect(db.maturityAssessments.delete).toHaveBeenCalledWith(addedAssessment.id);
    expect(store.assessments).not.toContainEqual(addedAssessment);
  });
});
