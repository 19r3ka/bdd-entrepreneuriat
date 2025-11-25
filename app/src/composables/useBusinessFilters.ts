import { computed } from 'vue';
import { useBusinessAreas } from '@/composables/useBusinessAreas';
import { useBusinessStore } from '@/stores/useBusinessStore';

export function useBusinessFilters() {
	const businessStore = useBusinessStore();
	const { getBusinessAreaLabel } = useBusinessAreas();

	const ownerOptions = computed(() =>
		Array.from(
			new Set(
				businessStore.businesses
					.map((business) => business.ownerName)
					.filter((name): name is string => !!name),
			),
		)
			.sort()
			.map((name) => ({ label: name, value: name })),
	);

	const businessAreaOptions = computed(() => {
		const codes = new Set<string>();
		for (const business of businessStore.businesses) {
			if (business.primaryBusinessArea) codes.add(business.primaryBusinessArea);
		}
		return Array.from(codes).map((code) => ({
			label: getBusinessAreaLabel(code),
			value: code,
		}));
	});

	return {
		ownerOptions,
		businessAreaOptions,
	};
}
