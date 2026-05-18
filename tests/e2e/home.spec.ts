import { expect, test } from '@playwright/test';

test.describe('Home page', () => {
	test('loads the home page and shows main navigation', async ({ page }) => {
		await page.setViewportSize({ width: 1280, height: 900 });

		await page.goto('/');

		await expect(page.getByText(/tavia/i).first()).toBeVisible();

		const venuesLink = page.getByRole('link', { name: /^venues$/i }).first();
		await expect(venuesLink).toBeVisible();
	});

	test('can navigate from home to venues page', async ({ page }) => {
		await page.setViewportSize({ width: 1280, height: 900 });

		await page.goto('/');

		await page
			.getByRole('link', { name: /^venues$/i })
			.first()
			.click();

		await expect(page).toHaveURL(/\/venues/);
		await expect(page.getByText(/venues found|loading venues/i)).toBeVisible({
			timeout: 20_000,
		});
	});
});
