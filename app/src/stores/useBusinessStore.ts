// src/stores/useBusinessStore.ts
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { z } from 'zod'
import { useCrudStore } from '@/composables/useCrudStore'
import { BusinessSchema } from '@/schemas/business'
import { db } from '@/services/local-db'
import type { Business } from '@/types/business'
import { isProfileCompletedStrict } from '@/utils/schemaCompletion'
import { useEntrepreneurStore } from './useEntrepreneurStore'
import { useActivityLogStore } from './useActivityLogStore'

// Schema-derived types
type BusinessInput = z.input<typeof BusinessSchema> // raw persisted shape
type BusinessBase = z.output<typeof BusinessSchema> // parsed shape

export const useBusinessStore = defineStore('business', () => {
  // CRUD store works with raw persisted input
  // We cast to any to avoid strict type mismatch between Zod output and T constraint
  // The store internally handles the difference via parsedBusinesses
  const crudStore = useCrudStore<any>({
    schema: BusinessSchema,
    tableName: 'businesses',
    db
  })

  const validationError = ref<string | null>(null)

  const {
    items: rawBusinessRecords,
    loading,
    error,
    fetchAll: fetchAllRaw,
    fetchOne: fetchOneRaw,
    add: addRaw,
    update: updateRaw,
    remove,
    removeMany
  } = crudStore

  const entrepreneurStore = useEntrepreneurStore()
  const activityLogStore = useActivityLogStore()

  // Parse raw records into schema-validated objects
  const parsedBusinesses = computed<BusinessBase[]>(() => {
    validationError.value = null // Reset error
    return rawBusinessRecords.value
      .map((rawRecord: any) => {
        try {
          return BusinessSchema.parse(rawRecord)
        } catch (err) {
          console.error('Business validation failed for record:', rawRecord, err)
          if (!validationError.value) {
            validationError.value = `Validation failed: ${err instanceof Error ? err.message : String(err)}`
          }
          return null
        }
      })
      .filter((b: any): b is BusinessBase => b !== null)
  })

  // Enrich parsed businesses with entrepreneur info and computed flags
  const businesses = computed<Business[]>(() =>
    parsedBusinesses.value.map((parsedBusiness) => {
      const entrepreneur =
        entrepreneurStore.entrepreneurs.find((e) => e.id === parsedBusiness.entrepreneurId) ?? null

      return {
        ...parsedBusiness,
        ownerName: entrepreneur ? `${entrepreneur.firstName} ${entrepreneur.lastName}` : null,
        // Ensure date fields are Date objects for UI components (DatePicker) or null
        registrationDate: parsedBusiness.registrationDate
          ? new Date(parsedBusiness.registrationDate)
          : null,
        activityStartDate: parsedBusiness.activityStartDate
          ? new Date(parsedBusiness.activityStartDate)
          : null,
        supportStartDate: parsedBusiness.supportStartDate
          ? new Date(parsedBusiness.supportStartDate)
          : null,
        isRegistered: Boolean(parsedBusiness.registrationNumber && parsedBusiness.registrationDate),
        profileCompleted: isProfileCompletedStrict(BusinessSchema, parsedBusiness)
      }
    })
  )

  // Conversion helper for persistence
  const toBusinessInput = (business: Business): BusinessInput => ({
    id: business.id ?? undefined, // schema allows optional id
    entrepreneurId: business.entrepreneurId,
    name: business.name,
    location: {
      longitude: business.location.longitude,
      latitude: business.location.latitude
    },
    contact: {
      email: business.contact.email,
      telephone: business.contact.telephone
    },
    primaryBusinessArea: business.primaryBusinessArea,
    secondaryBusinessArea: business.secondaryBusinessArea,
    socialMedia: business.socialMedia
      ? {
          linkedin: business.socialMedia.linkedin ?? undefined,
          twitter: business.socialMedia.twitter ?? undefined,
          facebook: business.socialMedia.facebook ?? undefined,
          tiktok: business.socialMedia.tiktok ?? undefined,
          instagram: business.socialMedia.instagram ?? undefined
        }
      : undefined,
    registrationNumber: business.registrationNumber,
    registrationDate: business.registrationDate ? business.registrationDate.toISOString() : null,
    activityStartDate: business.activityStartDate ? business.activityStartDate.toISOString() : null,
    supportStartDate: business.supportStartDate ? business.supportStartDate.toISOString() : null,
    avatar: business.avatar
  })

  // Public API (same composable signatures, just typed and named clearly)
  const fetchAll = async (): Promise<void> => {
    await entrepreneurStore.fetchAll()
    await fetchAllRaw()
  }

  const fetchOne = async (id: string): Promise<Business | null> => {
    await entrepreneurStore.fetchAll()
    const rawRecord = await fetchOneRaw(id)
    if (!rawRecord) return null

    const parsedBusiness = BusinessSchema.parse(rawRecord)

    const entrepreneur =
      entrepreneurStore.entrepreneurs.find((e) => e.id === parsedBusiness.entrepreneurId) ?? null

    return {
      ...parsedBusiness,
      // convert ISO date strings returned from DB into Date objects
      registrationDate: parsedBusiness.registrationDate
        ? new Date(parsedBusiness.registrationDate)
        : null,
      activityStartDate: parsedBusiness.activityStartDate
        ? new Date(parsedBusiness.activityStartDate)
        : null,
      supportStartDate: parsedBusiness.supportStartDate
        ? new Date(parsedBusiness.supportStartDate)
        : null,
      ownerName: entrepreneur ? `${entrepreneur.firstName} ${entrepreneur.lastName}` : null,
      isRegistered: Boolean(parsedBusiness.registrationNumber && parsedBusiness.registrationDate),
      profileCompleted: isProfileCompletedStrict(BusinessSchema, parsedBusiness)
    }
  }

  const add = async (business: Business): Promise<void> => {
    await addRaw(toBusinessInput(business))
    await activityLogStore.logAction('create', 'business', business.id || 'unknown', business.name)
  }

  const update = async (business: Business): Promise<void> => {
    await updateRaw(toBusinessInput(business))
    await activityLogStore.logAction('update', 'business', business.id || 'unknown', business.name)
  }

  const removeWithLog = async (id: string): Promise<void> => {
    const business = getById(id)
    const name = business?.name || 'Unknown Business'
    await remove(id)
    await activityLogStore.logAction('delete', 'business', id, name)
  }

  const getById = (id: string): Business | undefined => businesses.value.find((b) => b.id === id)

  const getByRegistrationNumber = (registrationNumber: string): Business | undefined =>
    businesses.value.find((b) => b.registrationNumber === registrationNumber)

  const getByEmail = (email: string): Business | undefined =>
    businesses.value.find((b) => b.contact?.email === email)

  const searchByName = (query: string) =>
    computed(() =>
      businesses.value.filter((b) => b.name.toLowerCase().includes(query.toLowerCase()))
    )

  return {
    businesses,
    loading,
    error,
    fetchAll,
    fetchOne,
    add,
    update,
    remove: removeWithLog,
    removeMany,
    getById,
    getByRegistrationNumber,
    getByEmail,
    searchByName,
    validationError
  }
})
