import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useMomentumMetricStore } from '@/stores/useMomentumMetricStore'
import type { MomentumMetric } from '@/types/monitoring-evaluation/MomentumMetric'
import { db } from '@/services/local-db'

// Mock db serialization utilities
vi.mock('@/utils/db-serialization', () => ({
  serializeForDb: (obj: any) => obj,
  deserializeFromDb: (obj: any) => obj
}))

// Mock uuid to return predictable values
vi.mock('uuid', () => ({
  v4: () => 'mock-uuid'
}))

// Mock the db
vi.mock('@/services/local-db', () => ({
  db: {
    momentumMetrics: {
      add: vi.fn(() => Promise.resolve()),
      update: vi.fn(() => Promise.resolve(1)),
      delete: vi.fn(() => Promise.resolve(1)),
      get: vi.fn(() => Promise.resolve(null)),
      where: vi.fn(() => ({
        equals: vi.fn(() => ({
          reverse: vi.fn(() => ({
            sortBy: vi.fn(() => Promise.resolve([]))
          }))
        }))
      })),
      toArray: vi.fn(() => Promise.resolve([]))
    }
  }
}))

describe('useMomentumMetricStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('should initialize with empty metrics array', () => {
    const store = useMomentumMetricStore()
    expect(store.metrics).toEqual([])
  })

  it('should add a new metric', async () => {
    const store = useMomentumMetricStore()
    
    // Mock return for get after adding
    vi.mocked(db.momentumMetrics.get).mockResolvedValueOnce({
      momentumMetricId: 'mock-uuid',
      businessId: '123e4567-e89b-12d3-a456-426614174000',
      title: 'Test Metric',
      category: 'performance',
      rbmLevel: 'outcome',
      indicators: [],
      evidenceIds: []
    })

    const newMetric = await store.addMetric({
      businessId: '123e4567-e89b-12d3-a456-426614174000',
      title: 'Test Metric',
      category: 'performance',
      rbmLevel: 'outcome',
      indicators: [],
      evidenceIds: []
    })

    expect(db.momentumMetrics.add).toHaveBeenCalledWith(
      expect.objectContaining({
        momentumMetricId: 'mock-uuid', 
        title: 'Test Metric',
        businessId: '123e4567-e89b-12d3-a456-426614174000',
        category: 'performance',
        rbmLevel: 'outcome'
      })
    )
    expect(store.metrics.length).toBe(1)
    expect(newMetric.momentumMetricId).toBe('mock-uuid')
  })

  it('should update an existing metric', async () => {
    const store = useMomentumMetricStore()
    
    // Mock initial data in store
    store.metrics = [
      {
        momentumMetricId: 'test-id',
        businessId: '123e4567-e89b-12d3-a456-426614174000',
        title: 'Original Metric',
        category: 'performance',
        rbmLevel: 'outcome',
        indicators: [],
        evidenceIds: [],
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z'
      }
    ]
    
    // Mock the get after update
    vi.mocked(db.momentumMetrics.get).mockResolvedValueOnce({
      momentumMetricId: 'test-id',
      businessId: '123e4567-e89b-12d3-a456-426614174000',
      title: 'Updated Metric',
      category: 'performance',
      rbmLevel: 'outcome',
      indicators: [],
      evidenceIds: [],
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2023-01-02T00:00:00Z'
    })

    await store.updateMetric('test-id', { 
      title: 'Updated Metric' 
    })

    // Mock get for verification
    vi.mocked(db.momentumMetrics.get).mockResolvedValueOnce({
      momentumMetricId: 'test-id',
      businessId: '123e4567-e89b-12d3-a456-426614174000',
      title: 'Updated Metric',
      category: 'performance',
      rbmLevel: 'outcome',
      indicators: [],
      evidenceIds: [],
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2023-01-02T00:00:00Z'
    })

    const updatedMetric = await store.getMetricById('test-id')

    expect(db.momentumMetrics.update).toHaveBeenCalledWith('test-id', {
      title: 'Updated Metric',
      updatedAt: expect.any(String)
    })
    expect(updatedMetric!.title).toBe('Updated Metric')
    expect(store.metrics[0]!.title).toBe('Updated Metric')
  })

  it('should delete a metric', async () => {
    const store = useMomentumMetricStore()
    
    // Mock store with initial data
    store.metrics = [
      {
        momentumMetricId: 'test-id',
        businessId: '123e4567-e89b-12d3-a456-426614174000',
        title: 'Test Metric',
        category: 'performance',
        rbmLevel: 'outcome',
        indicators: [],
        evidenceIds: [],
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z'
      }
    ]

    await store.deleteMetric('test-id')

    expect(db.momentumMetrics.delete).toHaveBeenCalledWith('test-id')
    expect(store.metrics.length).toBe(0)
  })

  it('should get a metric by ID', async () => {
    const store = useMomentumMetricStore()
    
    const mockMetric = {
      momentumMetricId: 'test-id',
      businessId: '123e4567-e89b-12d3-a456-426614174000',
      title: 'Test Metric',
      category: 'performance',
      rbmLevel: 'outcome',
      indicators: [],
      evidenceIds: [],
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2023-01-01T00:00:00Z'
    }
    
    vi.mocked(db.momentumMetrics.get).mockResolvedValueOnce(mockMetric)

    const result = await store.getMetricById('test-id')

    expect(db.momentumMetrics.get).toHaveBeenCalledWith('test-id')
    expect(result).toEqual(mockMetric)
  })

  it('should get metrics by business ID', async () => {
    const store = useMomentumMetricStore()
    
    const mockMetrics = [
      {
        momentumMetricId: 'metric-1',
        businessId: 'business-test',
        title: 'Test Metric 1',
        category: 'performance',
        rbmLevel: 'outcome',
        indicators: [],
        evidenceIds: [],
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z'
      },
      {
        momentumMetricId: 'metric-2',
        businessId: 'business-test',
        title: 'Test Metric 2',
        category: 'performance',
        rbmLevel: 'outcome',
        indicators: [],
        evidenceIds: [],
        createdAt: '2023-01-02T00:00:00Z',
        updatedAt: '2023-01-02T00:00:00Z'
      }
    ]
    
    const mockChain = {
      equals: vi.fn(() => ({
        reverse: vi.fn(() => ({
          sortBy: vi.fn(() => Promise.resolve(mockMetrics))
        }))
      }))
    }
    
    vi.mocked(db.momentumMetrics.where).mockReturnValueOnce(mockChain as any)

    const result = await store.getMetricsByBusinessId('business-test')

    expect(db.momentumMetrics.where).toHaveBeenCalledWith('businessId')
    expect(mockChain.equals).toHaveBeenCalledWith('business-test')
    expect(result).toEqual(mockMetrics)
  })

  it('should get metrics by quick win ID', async () => {
    const store = useMomentumMetricStore()
    
    const mockMetrics = [
      {
        momentumMetricId: 'metric-1',
        businessId: 'business-test',
        quickWinId: 'quickwin-test',
        title: 'Test Metric 1',
        category: 'performance',
        rbmLevel: 'outcome',
        indicators: [],
        evidenceIds: [],
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z'
      }
    ]
    
    const mockChain = {
      equals: vi.fn(() => ({
        reverse: vi.fn(() => ({
          sortBy: vi.fn(() => Promise.resolve(mockMetrics))
        }))
      }))
    }
    
    vi.mocked(db.momentumMetrics.where).mockReturnValueOnce(mockChain as any)

    const result = await store.getMetricsByQuickWinId('quickwin-test')

    expect(db.momentumMetrics.where).toHaveBeenCalledWith('quickWinId')
    expect(mockChain.equals).toHaveBeenCalledWith('quickwin-test')
    expect(result).toEqual(mockMetrics)
  })

  it('should fetch all metrics', async () => {
    const store = useMomentumMetricStore()
    
    const mockMetrics = [
      {
        momentumMetricId: 'metric-1',
        businessId: 'business-test',
        title: 'Test Metric 1',
        category: 'performance',
        rbmLevel: 'outcome',
        indicators: [],
        evidenceIds: [],
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z'
      }
    ]
    
    vi.mocked(db.momentumMetrics.toArray).mockResolvedValueOnce(mockMetrics)

    await store.fetchAll()

    expect(db.momentumMetrics.toArray).toHaveBeenCalled()
    expect(store.metrics).toEqual(mockMetrics)
  })
})