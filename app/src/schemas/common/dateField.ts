import z from 'zod'

export const dateField = z.union([z.string(), z.date(), z.null()]).transform((value) => {
  if (!value) return null
  return value instanceof Date ? value : new Date(value)
})
