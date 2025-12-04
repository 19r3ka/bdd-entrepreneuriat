export interface ActivityLog {
  id: string
  action: 'create' | 'update' | 'delete'
  entityType: 'business' | 'entrepreneur' | 'support' | 'quick_win' | 'metric'
  entityId: string
  entityName: string
  details?: string
  timestamp: string // ISO string
  meta?: any
}
