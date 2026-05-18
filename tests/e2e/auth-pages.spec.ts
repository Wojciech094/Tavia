import { expect, test } from '@playwright/test';

test.describe('Authentication pages', () => {
	test('login page loads and shows login form', async ({ page }) => {
		await page.goto('/login');

		await expect(page.getByRole('button', { name: /log in/i })).toBeVisible();
		await expect(page.getByRole('textbox').first()).toBeVisible();
	});

	test('register page loads and shows register form', async ({ page }) => {
		await page.goto('/register');

		await expect(page.getByRole('button', { name: /register/i })).toBeVisible();
		await expect(page.getByRole('textbox').first()).toBeVisible();
	});
});
