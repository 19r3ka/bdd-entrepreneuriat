import { defineStore } from 'pinia';
import { useCrudStore } from '@/composables/useCrudStore';
import { EntrepreneurSchema } from '@/schemas/entrepreneur';
import { db } from '@/services/local-db';
import type { Entrepreneur } from '@/types/entrepreneur';
import { isProfileCompletedStrict } from '@/utils/schemaCompletion';

export const useEntrepreneurStore = defineStore('entrepreneur', () => {
	const crudStore = useCrudStore<Entrepreneur>({
		schema: EntrepreneurSchema,
		tableName: 'entrepreneurs',
		db,
	});

	const {
		items: entrepreneurs,
		loading,
		error,
		fetchAll: baseFetchAll,
		fetchOne: baseFetchOne,
		add,
		update,
		remove,
		removeMany,
	} = crudStore;

	/** Enrichment logic for entrepreneurs */
	const enrichEntrepreneur = (entrepreneur: Entrepreneur): Entrepreneur => {
		return {
			...entrepreneur,
			isProfileCompleted: isProfileCompletedStrict(EntrepreneurSchema, entrepreneur),
		};
	};

	/** Override fetchAll to enrich entrepreneurs */
	const fetchAll = async () => {
		await baseFetchAll();
		entrepreneurs.value = entrepreneurs.value.map(enrichEntrepreneur);
	};

	/** Override fetchOne to enrich a single entrepreneur */
	const fetchOne = async (id: string) => {
		const entrepreneur = await baseFetchOne(id);
		return entrepreneur ? enrichEntrepreneur(entrepreneur) : null;
	};

	// Canonical getters
	const getById = (id: string) => entrepreneurs.value.find((e) => e.id === id);
	const getBySlug = (slug: string) => entrepreneurs.value.find((e) => e.slug === slug);
	const getByEmail = (email: string) => entrepreneurs.value.find((e) => e.contact?.email === email);

	// Canonical searches
	const searchByName = (query: string) =>
		entrepreneurs.value.filter((e) =>
			`${e.firstName} ${e.lastName}`.toLowerCase().includes(query.toLowerCase()),
		);

	const searchByEmail = (query: string) =>
		entrepreneurs.value.filter((e) =>
			(e.contact?.email || '').toLowerCase().includes(query.toLowerCase()),
		);

	return {
		entrepreneurs,
		loading,
		error,
		fetchAll,
		fetchOne,
		add,
		update,
		remove,
		removeMany,
		getById,
		getBySlug,
		getByEmail,
		searchByName,
		searchByEmail,
	};
});
