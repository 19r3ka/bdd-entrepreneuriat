import { defineStore } from 'pinia';
import { db } from '@/services/local-db';
import type { MaturityAssessment } from '@/types/monitoring-evaluation/Maturity';
import { v4 as uuidv4 } from 'uuid';

interface MaturityState {
  assessments: MaturityAssessment[];
}

export const useMaturityStore = defineStore('maturity', {
  state: (): MaturityState => ({
    assessments: [],
  }),
  actions: {
    async addMaturityAssessment(assessment: Omit<MaturityAssessment, 'id' | 'createdAt' | 'updatedAt'>): Promise<MaturityAssessment> {
      const newAssessment: MaturityAssessment = {
        ...assessment,
        id: uuidv4(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      await db.maturityAssessments.add(newAssessment);
      this.assessments.push(newAssessment);
      return newAssessment;
    },

    async getMaturityAssessmentById(id: string): Promise<MaturityAssessment | undefined> {
      return await db.maturityAssessments.get(id);
    },

    async getMaturityAssessmentByBusinessId(businessId: string): Promise<MaturityAssessment | undefined> {
        const assessments = await db.maturityAssessments.where({ businessId }).toArray();
        // Assuming one assessment per business for now
        return assessments[0];
    },

    async getAllMaturityAssessments(): Promise<MaturityAssessment[]> {
      this.assessments = await db.maturityAssessments.toArray();
      return this.assessments;
    },

    async updateMaturityAssessment(id: string, updates: Partial<Omit<MaturityAssessment, 'id' | 'createdAt'>>): Promise<void> {
      await db.maturityAssessments.update(id, { ...updates, updatedAt: new Date() });
      const index = this.assessments.findIndex(a => a.id === id);
      if (index !== -1) {
        Object.assign(this.assessments[index], { ...updates, updatedAt: new Date() });
      }
    },

    async deleteMaturityAssessment(id: string): Promise<void> {
      await db.maturityAssessments.delete(id);
      this.assessments = this.assessments.filter(a => a.id !== id);
    },
  },
});
