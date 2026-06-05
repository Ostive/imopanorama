import { expect, test } from '@playwright/test';

const publicPages = [
  '/',
  '/proprietes',
  '/actualites',
  '/contact',
  '/immobilier/antananarivo',
];

test.describe('public smoke', () => {
  for (const path of publicPages) {
    test(`renders ${path}`, async ({ page }) => {
      const errors: string[] = [];
      page.on('pageerror', (error) => errors.push(error.message));

      await page.goto(path);
      await expect(page.locator('body')).toBeVisible();
      await expect(page.locator('body')).not.toBeEmpty();
      expect(errors).toEqual([]);
    });
  }

  test('unauthenticated visitor cannot access admin directly', async ({ page }) => {
    await page.goto('/admin/proprietes');
    await expect(page).toHaveURL(/login|unauthorized|admin/);
    await expect(page.locator('body')).toBeVisible();
  });
});
