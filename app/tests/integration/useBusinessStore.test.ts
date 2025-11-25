import { describe, it, expect } from "vitest";
import { useBusinessStore } from "../../src/stores/useBusinessStore";

describe("Business Store", () => {
	it("should add a business", async () => {
		const store = useBusinessStore();
		const business = {
			name: "My Business",
			entrepreneurId: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
		};
		await store.add(business);
		expect(store.businesses).toHaveLength(1);
	});

	it("should update a business", async () => {
		const store = useBusinessStore();
		const business = {
			name: "My Business",
			entrepreneurId: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
		};
		const added = await store.add(business);
		const updated = { ...added, name: "My Updated Business" };
		await store.update(updated);
		expect(store.businesses[0].name).toBe("My Updated Business");
	});

	it("should delete a business", async () => {
		const store = useBusinessStore();
		const business = {
			name: "My Business",
			entrepreneurId: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
		};
		const added = await store.add(business);
		await store.remove(added.id);
		expect(store.businesses).toHaveLength(0);
	});
});
