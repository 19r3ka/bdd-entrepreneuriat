import { mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it } from "vitest";
import { useRoute, useRouter } from "vue-router";
import EntrepreneurForm from "../../src/components/EntrepreneurForm.vue";
import { db } from "../../src/services/local-db";
import EntrepreneurListView from "../../src/views/EntrepreneurListView.vue";

// Mock vue-router
vi.mock("vue-router", () => ({
	useRouter: vi.fn(() => ({
		push: vi.fn(),
	})),
	useRoute: vi.fn(() => ({
		params: {},
	})),
}));

describe("Entrepreneur CRUD Integration", () => {
	beforeEach(async () => {
		setActivePinia(createPinia());
		await db.entrepreneurs.clear();
	});

	it("should create a new entrepreneur and display it in the list", async () => {
		const router = useRouter();
		const listViewWrapper = mount(EntrepreneurListView);
		expect(listViewWrapper.text()).toContain("Add Entrepreneur");

		// Simulate adding a new entrepreneur
		useRoute.mockImplementation(() => ({ params: {} }));
		const formWrapper = mount(EntrepreneurForm);
		await formWrapper.find("#firstName").setValue("Integration");
		await formWrapper.find("#lastName").setValue("Test");
		await formWrapper.find("#slug").setValue("integration-test");
		await formWrapper.find('button[type="submit"]').trigger("submit");

		expect(router.push).toHaveBeenCalledWith("/entrepreneurs");

		// Re-mount the list view to reflect changes
		await listViewWrapper.vm.$nextTick();
		expect(listViewWrapper.text()).toContain("Integration");
	});

	// Add more integration tests for update, delete, and detail view
});
