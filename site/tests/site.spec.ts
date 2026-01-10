import { test, expect } from '@playwright/test';

const BASE_URL = process.env.TEST_URL || 'http://localhost:4321';

test.describe('AI Tools HQ Site', () => {
  test('homepage loads correctly', async ({ page }) => {
    await page.goto(BASE_URL);

    // Check title
    await expect(page).toHaveTitle(/AI Tools HQ/);

    // Check hero section
    await expect(page.locator('h1')).toContainText('Find the Perfect AI Tool');

    // Check search box exists
    await expect(page.locator('#search')).toBeVisible();

    // Check navigation
    await expect(page.locator('nav .logo')).toContainText('AI Tools HQ');
    await expect(page.locator('nav')).toContainText('All Tools');
    await expect(page.locator('nav')).toContainText('Compare');
  });

  test('navigation links work', async ({ page }) => {
    await page.goto(BASE_URL);

    // Click All Tools
    await page.click('text=All Tools');
    await expect(page).toHaveURL(/\/tools/);

    // Go back and click Compare
    await page.goto(BASE_URL);
    await page.click('text=Compare');
    await expect(page).toHaveURL(/\/compare/);
  });

  test('tools page displays tools', async ({ page }) => {
    await page.goto(`${BASE_URL}/tools`);

    // Check page title
    await expect(page.locator('h1')).toBeVisible();

    // Check tool cards exist
    const toolCards = page.locator('.tool-card');
    await expect(toolCards.first()).toBeVisible();
  });

  test('category pages work', async ({ page }) => {
    await page.goto(`${BASE_URL}/category/marketing`);

    // Check category header
    await expect(page.locator('h1')).toContainText(/Marketing/i);
  });

  test('best lists pages work', async ({ page }) => {
    await page.goto(`${BASE_URL}/best/ai-writing-tools`);

    // Check page loads
    await expect(page.locator('h1')).toContainText(/Writing Tools/i);
  });

  test('compare page loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/compare`);

    await expect(page.locator('h1')).toBeVisible();
  });

  test('footer contains expected links', async ({ page }) => {
    await page.goto(BASE_URL);

    const footer = page.locator('footer');
    await expect(footer).toContainText('AI Tools HQ');
    await expect(footer).toContainText('Categories');
  });

  test('mobile responsive - menu visible', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(BASE_URL);

    // Logo should still be visible
    await expect(page.locator('.logo')).toBeVisible();
  });
});
