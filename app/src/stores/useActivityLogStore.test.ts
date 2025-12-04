import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useActivityLogStore } from '@/stores/useActivityLogStore'
import type { ActivityLog } from '@/types/ActivityLog'
import { db } from '@/services/local-db'

// Mock uuid to return predictable values
vi.mock('uuid', () => ({
  v4: () => 'mock-uuid'
}))

// Mock the db
vi.mock('@/services/local-db', () => ({
  db: {
    activityLogs: {
      add: vi.fn(() => Promise.resolve()),
      orderBy: vi.fn(() => ({
        reverse: vi.fn(() => ({
          toArray: vi.fn(() => Promise.resolve([]))
        }))
      }))
    }
  }
}))

describe('useActivityLogStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('should initialize with empty logs array', () => {
    const store = useActivityLogStore()
    expect(store.logs).toEqual([])
  })

  it('should log an action', async () => {
    const store = useActivityLogStore()
    
    const mockLog: ActivityLog = {
      id: 'mock-uuid',
      action: 'create',
      entityType: 'business',
      entityId: 'test-id',
      entityName: 'Test Business',
      details: 'Created new business',
      timestamp: '2023-01-01T00:00:00Z',
      meta: { user: 'test-user' }
    }
    
    vi.mocked(db.activityLogs.add).mockResolvedValueOnce(undefined as any)
    vi.useFakeTimers().setSystemTime(new Date('2023-01-01T00:00:00Z'))

    await store.logAction(
      'create',
      'business',
      'test-id',
      'Test Business',
      'Created new business',
      { user: 'test-user' }
    )

    expect(db.activityLogs.add).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'mock-uuid',
        action: 'create',
        entityType: 'business',
        entityId: 'test-id',
        entityName: 'Test Business',
        details: 'Created new business',
        timestamp: '2023-01-01T00:00:00Z',
        meta: { user: 'test-user' }
      })
    )
    expect(store.logs.length).toBe(1)
    expect(store.logs[0]!.action).toBe('create')
    vi.useRealTimers()
  })

  it('should fetch all logs', async () => {
    const store = useActivityLogStore()
    
    const mockLogs: ActivityLog[] = [
      {
        id: 'log-1',
        action: 'create',
        entityType: 'business',
        entityId: 'test-id-1',
        entityName: 'Test Business 1',
        details: 'Created business',
        timestamp: '2023-01-01T00:00:00Z'
      },
      {
        id: 'log-2',
        action: 'update',
        entityType: 'entrepreneur',
        entityId: 'test-id-2',
        entityName: 'Test Entrepreneur 2',
        details: 'Updated entrepreneur',
        timestamp: '2023-01-02T00:00:00Z'
      }
    ]
    
    const mockOrderChain = {
      reverse: vi.fn(() => ({
        toArray: vi.fn(() => Promise.resolve(mockLogs))
      }))
    }
    
    vi.mocked(db.activityLogs.orderBy).mockReturnValueOnce(mockOrderChain as any)

    const result = await store.fetchAll()

    expect(db.activityLogs.orderBy).toHaveBeenCalledWith('timestamp')
    expect(mockOrderChain.reverse).toHaveBeenCalled()
    expect(result).toEqual(mockLogs)
    expect(store.logs).toEqual(mockLogs)
  })

  it('should add new log to beginning of logs array', async () => {
    const store = useActivityLogStore()
    
    // Simulate existing logs
    store.logs = [
      {
        id: 'log-1',
        action: 'update',
        entityType: 'business',
        entityId: 'test-id-1',
        entityName: 'Test Business 1',
        details: 'Updated business',
        timestamp: '2023-01-01T00:00:00Z'
      }
    ]
    
    vi.mocked(db.activityLogs.add).mockResolvedValueOnce(undefined as any)
    vi.useFakeTimers().setSystemTime(new Date('2023-01-02T00:00:00Z'))

    await store.logAction(
      'create',
      'business',
      'test-id-2',
      'Test Business 2',
      'Created new business'
    )

    expect(store.logs.length).toBe(2)
    expect(store.logs[0]!.action).toBe('create') // New log at beginning
    expect(store.logs[1]!.action).toBe('update') // Previous log at end
    vi.useRealTimers()
  })

  it('should log action with minimal parameters', async () => {
    const store = useActivityLogStore()
    
    vi.mocked(db.activityLogs.add).mockResolvedValueOnce(undefined as any)
    vi.useFakeTimers().setSystemTime(new Date('2023-01-01T00:00:00Z'))

    await store.logAction(
      'delete',
      'entrepreneur',
      'test-id',
      'Test Entrepreneur'
      // No details or meta
    )

    expect(db.activityLogs.add).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'mock-uuid',
        action: 'delete',
        entityType: 'entrepreneur',
        entityId: 'test-id',
        entityName: 'Test Entrepreneur',
        details: undefined,
        timestamp: '2023-01-01T00:00:00Z',
        meta: undefined
      })
    )
    vi.useRealTimers()
  })
})