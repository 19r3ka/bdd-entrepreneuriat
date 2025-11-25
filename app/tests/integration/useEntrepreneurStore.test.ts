import { describe, it, expect } from "vitest";
import { useEntrepreneurStore } from "@/stores/entrepreneur";

describe("Entrepreneur Store", () => {
	it("should add an entrepreneur", async () => {
		const store = useEntrepreneurStore();
		const entrepreneur = {
			firstName: "John",
			lastName: "Doe",
			slug: "john-doe",
		};
		await store.add(entrepreneur);
		expect(store.entrepreneurs).toHaveLength(1);
	});

	it("should update an entrepreneur", async () => {
		const store = useEntrepreneurStore();
		const entrepreneur = {
			firstName: "John",
			lastName: "Doe",
			slug: "john-doe",
		};
		const added = await store.add(entrepreneur);
		const updated = { ...added, firstName: "Jane" };
		await store.update(updated);
		expect(store.entrepreneurs[0].firstName).toBe("Jane");
	});

	it("should delete an entrepreneur", async () => {
		const store = useEntrepreneurStore();
		const entrepreneur = {
			firstName: "John",
			lastName: "Doe",
			slug: "john-doe",
		};
		const added = await store.add(entrepreneur);
		await store.remove(added.id);
		expect(store.entrepreneurs).toHaveLength(0);
	});
});
