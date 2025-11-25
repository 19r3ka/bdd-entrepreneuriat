// /composables/useBusinessAreas.ts
import { businessAreaOptions } from '@/constants/businessAreas';
import type { BusinessArea } from '@/types/businessArea';

export function useBusinessAreas() {
	const businessAreaMap: Record<string, string> = businessAreaOptions.reduce(
		(acc, { code, name }) => {
			acc[code] = name;
			return acc;
		},
		{} as Record<string, string>,
	);

	const getBusinessAreaLabel = (code: string): string => businessAreaMap[code] || code;

	const getBusinessAreaOptions = (): { value: string; label: string }[] =>
		businessAreaOptions.map(({ code, name }) => ({ value: code, label: name }));

	const isValidBusinessArea = (code: string): code is BusinessArea['code'] =>
		Object.hasOwn(businessAreaMap, code);

	return {
		businessAreaMap,
		getBusinessAreaLabel,
		getBusinessAreaOptions,
		isValidBusinessArea,
	};
}
