import { test, expect } from './fixtures';

test.describe('Check login page and login', () => {
  test('Check login page', async ({ page, loginPage }) => {
    await loginPage.goto();
    await loginPage.expectPage();
  });

  test('Login with valid credentials', async ({ page, loginPage }) => {
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
  });

  test('Login with invalid credentials', async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login('321', '123');
    await loginPage.expectErrorNotification();
  });
});
