import { test, expect } from "@playwright/test";

test("should generate reports", async ({ page }) => {
	await page.goto("/reports");
	await expect(page.locator("h1")).toHaveText("Reports");

	await page
		.getByRole("button", { name: "Generate Entrepreneur Report" })
		.click();
	await expect(page.locator("h2")).toHaveText("Entrepreneur Report");

	await page.getByRole("button", { name: "Generate Business Report" }).click();
	await expect(page.locator("h2")).toHaveText("Business Report");
});
