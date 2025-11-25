import { test, expect } from 'vitest';
import { goto } from '@vitest/browser/context'; // Assuming browser context is set up for Vitest E2E

test('dashboard map loads in under 3 seconds', async () => {
  const startTime = performance.now();
  await goto('/'); // Navigate to the home page

  // Wait for the Leaflet map container to be visible.
  // The .leaflet-container class is added by Leaflet once the map is initialized.
  await expect(page.locator('.leaflet-container')).toBeVisible({ timeout: 10000 });

  const endTime = performance.now();
  const loadTime = (endTime - startTime) / 1000; // Convert to seconds

  console.log(`Dashboard map load time: ${loadTime.toFixed(2)} seconds`);

  // Assert that the load time is under 3 seconds
  expect(loadTime).toBeLessThan(3);
});
