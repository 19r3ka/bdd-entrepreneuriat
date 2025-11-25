import { resolveField } from '@/utils/resolveField';

export interface CsvColumn<T> {
	key: keyof T | string; // supports nested paths like "contact.email"
	label: string; // column header
}

/**
 * Flatten an object into dot.notation keys.
 */
function flattenObject(obj: any, prefix = ''): Record<string, any> {
	return Object.keys(obj ?? {}).reduce(
		(acc, key) => {
			const value = obj[key];
			const newKey = prefix ? `${prefix}.${key}` : key;

			if (value && typeof value === 'object' && !(value instanceof Date)) {
				Object.assign(acc, flattenObject(value, newKey));
			} else {
				acc[newKey] = value;
			}
			return acc;
		},
		{} as Record<string, any>,
	);
}

/**
 * Convert array of objects to CSV string.
 */
function toCsvString<T>(data: T[], columns: CsvColumn<T>[]): string {
	const header = columns.map((c) => c.label).join(',');
	const rows = data.map((item) =>
		columns
			.map((c) => {
				const value = resolveField(item, c.key as string);
				if (value === null || value === undefined) return '';
				if (value instanceof Date) return `"${value.toISOString()}"`;
				const str = String(value);
				return str.includes(',') || str.includes('"') || str.includes('\n')
					? `"${str.replace(/"/g, '""')}"`
					: str;
			})
			.join(','),
	);
	return [header, ...rows].join('\n');
}

/**
 * Trigger browser download.
 */
function triggerDownload(content: string, filename: string): void {
	const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
	const url = URL.createObjectURL(blob);
	const link = document.createElement('a');
	link.href = url;
	link.setAttribute('download', filename);
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
}

/**
 * Generate CSV columns from an object type.
 * @param sample A sample entity (used to derive keys)
 * @param excludeFields Fields to omit from export
 * @param includeAugmented Optional augmented fields (e.g. replace entrepreneurId with ownerName)
 * @return Array of CsvColumn definitions
 */
export function generateCsvColumns<T>(
	sample: T,
	excludeFields: string[] = [],
	includeAugmented: CsvColumn<T>[] = [],
): CsvColumn<T>[] {
	// Flatten the sample object into dot.notation keys
	const flattened = flattenObject(sample);

	// Build default columns from flattened keys
	const schemaColumns: CsvColumn<T>[] = Object.keys(flattened)
		.filter((key) => !excludeFields.includes(key))
		.map((key) => ({ key, label: key }));

	// Merge with augmented fields
	return [...schemaColumns, ...includeAugmented];
}

/**
 * Composable for CSV import/export.
 */
export function useCsv<T>() {
	/**
	 * Export CSV with schema‑aware defaults.
	 *
	 * @param data - array of objects to export
	 * @param excludeFields - fields to drop (default: ['id'])
	 * @param includeAugmented - extra fields to add (default: [])
	 * @param filename - output filename (default: 'export')
	 */
	const exportCsv = (data: T[], columns: CsvColumn<T>[], filename = 'export'): void => {
		if (!data.length) return;
		const csv = toCsvString(data, columns);
		triggerDownload(csv, `${filename}.csv`);
	};

	// Stub for future import functionality
	const importCsv = (_csvString: string): T[] => {
		// TODO: implement parsing logic or integrate a library later
		return [];
	};

	return { exportCsv, importCsv };
}
