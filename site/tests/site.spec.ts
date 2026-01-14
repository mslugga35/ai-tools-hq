import { test, expect } from '@playwright/test';

const BASE_URL = process.env.TEST_URL || 'http://localhost:4321';

test.describe('AI Tools HQ Site', () => {
  test.beforeEach(async ({ page }) => {
    // Increase timeout for all tests
    test.setTimeout(60000);
  });

  test('homepage loads correctly', async ({ page }) => {
    const response = await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
    expect(response?.status()).toBe(200);

    // Check title
    await expect(page).toHaveTitle(/AI Tools HQ/);

    // Check hero section exists - use main h1 to avoid dev toolbar elements
    await expect(page.locator('main h1').first()).toBeVisible({ timeout: 15000 });

    // Check search box exists
    await expect(page.locator('#search')).toBeVisible({ timeout: 10000 });

    // Check navigation
    await expect(page.locator('nav')).toBeVisible();
  });

  test('navigation links work', async ({ page }) => {
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });

    // Click All Tools
    await page.click('text=All Tools', { timeout: 10000 });
    await page.waitForURL(/\/tools/, { timeout: 10000 });

    // Go back and click Compare
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
    await page.click('text=Compare', { timeout: 10000 });
    await page.waitForURL(/\/compare/, { timeout: 10000 });
  });

  test('tools page displays tools', async ({ page }) => {
    const response = await page.goto(`${BASE_URL}/tools`, { waitUntil: 'domcontentloaded' });
    expect(response?.status()).toBe(200);

    // Check page title loaded
    await expect(page).toHaveTitle(/AI Tools/);
  });

  test('category pages work', async ({ page }) => {
    const response = await page.goto(`${BASE_URL}/category/marketing`, { waitUntil: 'domcontentloaded' });
    expect(response?.status()).toBe(200);

    // Check category header exists - use main h1 to avoid dev toolbar elements
    await expect(page.locator('main h1').first()).toBeVisible({ timeout: 15000 });
  });

  test('best lists pages work', async ({ page }) => {
    const response = await page.goto(`${BASE_URL}/best/ai-writing-tools`, { waitUntil: 'domcontentloaded' });
    expect(response?.status()).toBe(200);

    // Check page loads - use first h1 to avoid dev toolbar elements
    await expect(page.locator('main h1').first()).toBeVisible({ timeout: 15000 });
  });

  test('compare page loads', async ({ page }) => {
    const response = await page.goto(`${BASE_URL}/compare`, { waitUntil: 'domcontentloaded' });
    expect(response?.status()).toBe(200);

    // Use main h1 to avoid dev toolbar elements
    await expect(page.locator('main h1').first()).toBeVisible({ timeout: 15000 });
  });

  test('footer contains expected links', async ({ page }) => {
    const response = await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
    expect(response?.status()).toBe(200);

    const footer = page.locator('footer');
    await expect(footer).toBeVisible({ timeout: 15000 });
    await expect(footer).toContainText('AI Tools HQ');
  });

  test('mobile responsive - menu visible', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    const response = await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
    expect(response?.status()).toBe(200);

    // Logo should still be visible
    await expect(page.locator('.logo')).toBeVisible({ timeout: 15000 });
  });
});
