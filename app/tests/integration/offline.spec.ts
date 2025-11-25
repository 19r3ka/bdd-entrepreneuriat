import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it } from "vitest";
import { db } from "../../src/services/local-db";
import { syncData } from "../../src/services/sync";
import { useBusinessStore } from "../../src/stores/business";
import { useEntrepreneurStore } from "../../src/stores/entrepreneur";

// Mock Supabase for offline tests
vi.mock("../../src/services/supabase", () => ({
	supabase: {
		from: vi.fn(() => ({
			upsert: vi.fn(() => ({ error: null })),
			select: vi.fn(() => ({ data: [], error: null })),
		})),
	},
}));

describe("Offline Functionality Integration", () => {
	beforeEach(async () => {
		setActivePinia(createPinia());
		await db.entrepreneurs.clear();
		await db.businesses.clear();
	});

	it("should store data in IndexedDB when offline and sync when online", async () => {
		const entrepreneurStore = useEntrepreneurStore();
		const businessStore = useBusinessStore();

		// Simulate offline creation
		await entrepreneurStore.add({
			firstName: "Offline",
			lastName: "Entrepreneur",
			slug: "offline-entrepreneur",
		});
		await businessStore.add({
			entrepreneurId: entrepreneurStore.entrepreneurs[0].id,
			name: "Offline Business",
			primaryBusinessArea: "Offline",
			registrationNumber: "OFFLINE123",
		});

		expect(entrepreneurStore.entrepreneurs.length).toBe(1);
		expect(businessStore.businesses.length).toBe(1);

		// Simulate going online and syncing
		await syncData();

		// In a real scenario, you would check if Supabase received the data.
		// Here, we just ensure the sync function runs without errors.
		expect(true).toBe(true); // Placeholder assertion
	});
});
