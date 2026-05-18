import { expect, test } from '@playwright/test';

test.describe('Venues page', () => {
	test('loads venues and shows venue cards', async ({ page }) => {
		await page.goto('/venues');

		await expect(page.getByText(/venues found/i)).toBeVisible({
			timeout: 20_000,
		});

		await expect(page.getByText(/view full venue/i).first()).toBeVisible({
			timeout: 20_000,
		});
	});

	test('can open a venue details page from a card', async ({ page }) => {
		await page.goto('/venues');

		await page
			.getByText(/view full venue/i)
			.first()
			.click();

		await expect(page).toHaveURL(/\/venues\/.+/);
		await expect(page.getByText(/night|guests|availability|book/i).first()).toBeVisible({
			timeout: 20_000,
		});
	});
});
