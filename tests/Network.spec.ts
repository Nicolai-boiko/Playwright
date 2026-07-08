import { test, expect } from './fixtures';

test.describe('Network interception', () => {

  test('Page works even when images fail to load', async ({ page, loginPage, networkPage }) => {
    // 1. Перехват ДО навигации
    await networkPage.blockAllImages();

    // 2. POM через фикстуры
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');

    // 3. Страница работает без картинок
    await expect(page.locator('.title')).toBeVisible();
    await expect(page.locator('.inventory_item').first()).toBeVisible();
  });

  test('JS files return status 200', async ({ networkPage }) => {
    const status = await networkPage.gotoLoginAndWaitForResponse('**/*.js');
    expect(status).toBe(200);
  });

  test('Log all network requests', async ({ page, loginPage, networkPage }) => {
    await networkPage.logAllRequests();
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');

    await expect(page.locator('.title')).toBeVisible();
  });
});
