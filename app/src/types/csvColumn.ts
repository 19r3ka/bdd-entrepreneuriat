/**
 * Column definition for CSV export.
 */
export interface CsvColumn<T> {
  key: keyof T | string
  label: string
}
