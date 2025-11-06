import { test, expect } from '@playwright/test';

test.describe('User Login', () => {
  test('should login with valid credentials', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="username"]', 'testuser');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/dashboard');
  });

  test('should show error with invalid credentials', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="username"]', 'invaliduser');
    await page.fill('input[name="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');
    await expect(page.locator('.error')).toHaveText('Invalid username or password');
  });
});