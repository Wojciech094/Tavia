import { expect, test } from '@playwright/test';

test.describe('Search and filters', () => {
	test('search can be submitted and updates the URL', async ({ page }) => {
		await page.goto('/venues');

		const searchInput = page.getByPlaceholder(/search by name, city or country/i);
		await expect(searchInput).toBeVisible({ timeout: 20_000 });

		await searchInput.fill('Norway');
		await page.getByRole('button', { name: /^search$/i }).click();

		await expect(page).toHaveURL(/where=Norway/i);
		await expect(searchInput).toHaveValue('Norway');
	});

	test('max price filter can be applied and reset', async ({ page }) => {
		await page.goto('/venues');

		const maxPriceSelect = page.locator('select').filter({ hasText: 'Max price' });
		await expect(maxPriceSelect).toBeVisible({ timeout: 20_000 });

		await maxPriceSelect.selectOption('2500');

		await expect(maxPriceSelect).toHaveValue('2500');
		await expect(page).toHaveURL(/maxPrice=2500/i);

		await page.getByRole('button', { name: /reset/i }).click();

		await expect(page).not.toHaveURL(/maxPrice=2500/i);
	});

	test('amenity filter can be selected', async ({ page }) => {
		await page.goto('/venues');

		const amenitySelect = page.locator('select').filter({ hasText: 'Amenities' });
		await expect(amenitySelect).toBeVisible({ timeout: 20_000 });

		await amenitySelect.selectOption('wifi');

		await expect(amenitySelect).toHaveValue('wifi');
		await expect(page).toHaveURL(/amenity=wifi/i);
	});

	test('sort by newest can be selected', async ({ page }) => {
		await page.goto('/venues');

		const sortSelect = page.locator('select').filter({ hasText: 'Sort by' });
		await expect(sortSelect).toBeVisible({ timeout: 20_000 });

		await sortSelect.selectOption('newest');

		await expect(sortSelect).toHaveValue('newest');
		await expect(page).toHaveURL(/sort=newest/i);
	});
});
