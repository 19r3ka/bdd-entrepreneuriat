import { setActivePinia, createPinia } from 'pinia'
import { beforeEach, describe, it, expect, vi } from 'vitest'
import { useSupportStore } from './useSupportStore'
import { db } from '@/services/local-db'
import type { Support } from '@/types/monitoring-evaluation/Support'
import { v4 as uuidv4 } from 'uuid'

// Mock the local-db Dexie instance
vi.mock('@/services/local-db', () => {
  const supports: Support[] = []
  return {
    db: {
      supports: {
        add: vi.fn(async (support: Support) => {
          supports.push(support)
          return support.id
        }),
        get: vi.fn(async (id: string) => supports.find((s) => s.id === id)),
        toArray: vi.fn(async () => supports),
        where: vi.fn((criteria: { businessId?: string; indicatorId?: string }) => ({
          toArray: vi.fn(async () => supports.filter((s) => s.businessId === criteria.businessId))
        })),
        update: vi.fn(async (id: string, changes: Partial<Support>) => {
          const index = supports.findIndex((s) => s.id === id)
          if (index !== -1 && supports[index]) {
            Object.assign(supports[index], changes)
            return 1 // Number of updated items
          }
          return 0
        }),
        delete: vi.fn(async (id: string) => {
          const index = supports.findIndex((s) => s.id === id)
          if (index !== -1) {
            supports.splice(index, 1)
            return 1 // Number of deleted items
          }
          return 0
        }),
        clear: vi.fn(async () => {
          supports.length = 0
          return
        })
      }
    }
  }
})

describe('useSupportStore', () => {
  beforeEach(async () => {
    setActivePinia(createPinia())
    // Clear the mock database before each test
    await db.supports.clear()
  })

  const mockSupportData: Omit<Support, 'id' | 'createdAt' | 'updatedAt'> = {
    businessId: 'business-123',
    title: 'Digital Kickstart Grant',
    boostType: 'financial_grant',
    modality: 'DIM',
    dimension: 'Digital',
    startDate: '2025-01-15',
    genderMarker: 'GEN0',
    quantity: {
      value: 1000,
      unit: 'currency',
      currency: 'USD'
    }
  }

  it('should add a new support intervention', async () => {
    const store = useSupportStore()
    const supportToAdd: Support = {
      ...mockSupportData,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    const addedSupport = await store.addSupport(supportToAdd)

    expect(addedSupport).toHaveProperty('id')
    expect(addedSupport.businessId).toBe(mockSupportData.businessId)
    const allSupports = await store.fetchAll()
    expect(allSupports.length).toBe(1)
    expect(db.supports.add).toHaveBeenCalledWith(supportToAdd)
  })

  it('should retrieve a support intervention by ID', async () => {
    const store = useSupportStore()
    const supportToAdd: Support = {
      ...mockSupportData,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    const addedSupport = await store.addSupport(supportToAdd)
    const fetchedSupport = await store.getSupportById(addedSupport.id)

    expect(fetchedSupport).toEqual(addedSupport)
  })

  it('should return undefined for a non-existent support ID', async () => {
    const store = useSupportStore()
    const fetchedSupport = await store.getSupportById('non-existent-id')

    expect(fetchedSupport).toBeUndefined()
  })

  it('should retrieve all support interventions', async () => {
    const store = useSupportStore()
    const support1: Support = {
      ...mockSupportData,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    const support2: Support = {
      ...mockSupportData,
      id: uuidv4(),
      title: 'Another support',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    await store.addSupport(support1)
    await store.addSupport(support2)

    await store.fetchAll()
    expect(store.supports.length).toBe(2)
    expect(db.supports.toArray).toHaveBeenCalled()
  })

  it('should retrieve supports by business ID', async () => {
    const store = useSupportStore()
    const support1: Support = {
      ...mockSupportData,
      id: uuidv4(),
      businessId: 'business-123',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    const support2: Support = {
      ...mockSupportData,
      id: uuidv4(),
      businessId: 'business-456',
      title: 'Another business support',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    await store.addSupport(support1)
    await store.addSupport(support2)

    const businessSupports = await store.getSupportsByBusinessId('business-123')
    expect(businessSupports.length).toBe(1)
    expect(businessSupports[0]!.businessId).toBe('business-123')
    expect(db.supports.where).toHaveBeenCalledWith({ businessId: 'business-123' })
  })

  it('should update an existing support intervention', async () => {
    const store = useSupportStore()
    const supportToAdd: Support = {
      ...mockSupportData,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    const addedSupport = await store.addSupport(supportToAdd)

    const updates = { title: 'Updated policy advice', genderMarker: 'GEN1' as 'GEN1' }
    await store.updateSupport(addedSupport!.id, updates)

    const updatedSupport = await store.getSupportById(addedSupport!.id)
    expect(updatedSupport?.title).toBe(updates.title)
    expect(updatedSupport?.genderMarker).toBe(updates.genderMarker)
    expect(updatedSupport?.updatedAt).not.toEqual(addedSupport!.createdAt) // updatedAt should be changed
    expect(db.supports.update).toHaveBeenCalledWith(addedSupport!.id, expect.objectContaining(updates))
  })

  it('should delete a support intervention', async () => {
    const store = useSupportStore()
    const supportToAdd: Support = {
      ...mockSupportData,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    const addedSupport = await store.addSupport(supportToAdd)

    await store.deleteSupport(addedSupport.id)
    const fetchedSupport = await store.getSupportById(addedSupport.id)

    expect(fetchedSupport).toBeUndefined()
    await store.fetchAll()
    expect(store.supports.length).toBe(0)
    expect(db.supports.delete).toHaveBeenCalledWith(addedSupport.id)
  })
})