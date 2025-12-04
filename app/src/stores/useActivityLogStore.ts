import { defineStore } from 'pinia'
import { db } from '@/services/local-db'
import type { ActivityLog } from '@/types/ActivityLog'
import { v4 as uuidv4 } from 'uuid'

interface ActivityLogState {
  logs: ActivityLog[]
}

export const useActivityLogStore = defineStore('activityLog', {
  state: (): ActivityLogState => ({
    logs: []
  }),
  actions: {
    async logAction(
      action: ActivityLog['action'],
      entityType: ActivityLog['entityType'],
      entityId: string,
      entityName: string,
      details?: string,
      meta?: any
    ): Promise<void> {
      const log: ActivityLog = {
        id: uuidv4(),
        action,
        entityType,
        entityId,
        entityName,
        details,
        timestamp: new Date().toISOString(),
        meta
      }

      await db.activityLogs.add(log)
      this.logs.unshift(log) // Add to beginning
    },

    async fetchAll(): Promise<ActivityLog[]> {
      const logs = await db.activityLogs.orderBy('timestamp').reverse().toArray()
      this.logs = logs
      return logs
    }
  }
})
