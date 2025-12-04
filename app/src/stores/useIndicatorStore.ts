import { defineStore } from 'pinia'
import { db } from '@/services/local-db'
import type { IndicatorDefinition, Measurement } from '@/types/monitoring-evaluation/Indicator'

interface IndicatorState {
  indicators: IndicatorDefinition[]
  measurements: Measurement[]
}

export const useIndicatorStore = defineStore('indicator', {
  state: (): IndicatorState => ({
    indicators: [],
    measurements: []
  }),
  actions: {
    // Indicator Actions
    async addIndicator(
      indicator: Omit<IndicatorDefinition, 'id' | 'createdAt' | 'updatedAt'>
    ): Promise<IndicatorDefinition> {
      const newIndicator: IndicatorDefinition = {
        ...indicator,
        id: crypto.randomUUID(),
        createdAt: new Date(),
        updatedAt: new Date()
      }
      await db.indicatorDefinitions.add(newIndicator)
      this.indicators.push(newIndicator)
      return newIndicator
    },

    async getIndicatorsByBusinessId(businessId: string): Promise<IndicatorDefinition[]> {
      return await db.indicatorDefinitions.where({ businessId }).toArray()
    },

    async updateIndicator(
      id: string,
      updates: Partial<Omit<IndicatorDefinition, 'id' | 'createdAt'>>
    ): Promise<void> {
      await db.indicatorDefinitions.update(id, { ...updates, updatedAt: new Date() })
      const index = this.indicators.findIndex((i) => i.id === id)
      const indicator = this.indicators[index]
      if (index !== -1 && indicator) {
        Object.assign(indicator, { ...updates, updatedAt: new Date() })
      }
    },

    async deleteIndicator(id: string): Promise<void> {
      await db.indicatorDefinitions.delete(id)
      this.indicators = this.indicators.filter((i) => i.id !== id)

      // Also delete associated measurements
      await db.measurements.where({ indicatorId: id }).delete()
      this.measurements = this.measurements.filter((m) => m.indicatorId !== id)
    },

    // Measurement Actions
    async addMeasurement(
      measurement: Omit<Measurement, 'id' | 'createdAt' | 'updatedAt'>
    ): Promise<Measurement> {
      const newMeasurement: Measurement = {
        ...measurement,
        id: crypto.randomUUID(),
        createdAt: new Date(),
        updatedAt: new Date()
      }
      await db.measurements.add(newMeasurement)
      this.measurements.push(newMeasurement)
      return newMeasurement
    },

    async getMeasurementsByIndicatorId(indicatorId: string): Promise<Measurement[]> {
      return await db.measurements.where({ indicatorId }).toArray()
    },

    async updateMeasurement(
      id: string,
      updates: Partial<Omit<Measurement, 'id' | 'createdAt'>>
    ): Promise<void> {
      await db.measurements.update(id, { ...updates, updatedAt: new Date() })
      const index = this.measurements.findIndex((m) => m.id === id)
      const measurement = this.measurements[index]
      if (index !== -1 && measurement) {
        Object.assign(measurement, { ...updates, updatedAt: new Date() })
      }
    },

    async deleteMeasurement(id: string): Promise<void> {
      await db.measurements.delete(id)
      this.measurements = this.measurements.filter((m) => m.id !== id)
    }
  }
})
