import { test, expect } from './fixtures';

test.describe('Inventory page', () => {
  test.afterEach(async ({ page }) => {
    await page.evaluate(() => localStorage.clear());
  });

  // Проверка что страница товаров загрузилась
  test('Page loads after login', async ({ inventoryPage }) => {
    await inventoryPage.expectPage();
  });

  const sortOptions = [
    { option: 'az', direction: 'A→Z' },
    { option: 'za', direction: 'Z→A' },
  ] as const;
  for (const { option, direction } of sortOptions) {
    test(`Sort ${direction}`, async ({ inventoryPage }) => {
      await inventoryPage.sortBy(option);
      const names = await inventoryPage.getAllItemNames();
      const sorted = [...names].sort();
      option === 'az' ? expect(names).toEqual(sorted) : expect(names).toEqual(sorted.reverse());
    });
  }

  const sortOptionsPrice = [
    { option: 'lohi', direction: 'low to high' },
    { option: 'hilo', direction: 'high to low' },
  ] as const;
  for (const { option, direction } of sortOptionsPrice) {
    test(`Sort price ${direction}`, async ({ inventoryPage }) => {
      await inventoryPage.sortBy(option);
      const prices = await inventoryPage.getAllPrices();
      const nums = prices.map(p => parseFloat(p.replace('$', '')));
      for (let i = 1; i < nums.length; i++) {
        option === 'lohi' ? expect(nums[i]).toBeGreaterThanOrEqual(nums[i - 1]) : expect(nums[i]).toBeLessThanOrEqual(nums[i - 1]);
      }
    });
  }

  test('Add item to cart', async ({ inventoryPage }) => {
    await inventoryPage.addToCart('Sauce Labs Backpack');
    const badge = await inventoryPage.getCartBadgeCount();
    expect(badge).toBe('1');
  });
});
