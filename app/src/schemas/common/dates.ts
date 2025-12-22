import { z } from 'zod';

// Schema for database layer - ISO string format
// Coerces Date objects to ISO string for database storage
export const DatabaseDateSchema = z.preprocess(arg => {
  if (typeof arg == 'string' || arg instanceof Date) {
    // If it's already a valid ISO string, return as is
    if (typeof arg === 'string' && !isNaN(Date.parse(arg))) return arg;
    // Otherwise convert to ISO string
    return new Date(arg).toISOString();
  }
  return arg;
}, z.string().datetime());

export type DatabaseDate = z.infer<typeof DatabaseDateSchema>;

// Schema for application layer - Date object format
// Coerces ISO strings to Date objects for in-app usage
export const AppDateSchema = z.preprocess(arg => {
  if (typeof arg === 'string') {
    // If it's a string, try to parse it as a date
    const date = new Date(arg);
    // Check if the date is valid
    if (!isNaN(date.getTime())) return date;
  }
  if (arg instanceof Date) return arg;
  return arg;
}, z.date());

export type AppDate = z.infer<typeof AppDateSchema>;

// Legacy DateStringSchema kept for backward compatibility during transition
// Coerces Date objects to ISO string
export const DateStringSchema = z.preprocess(arg => {
  if (typeof arg == 'string' || arg instanceof Date) return new Date(arg).toISOString();
  return arg;
}, z.string().datetime());

export type DateString = z.infer<typeof DateStringSchema>;
