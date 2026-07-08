import { test as base, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';
import { InventoryPage } from './pages/InventoryPage';
import { NetworkPage } from './pages/NetworkPage';

export const test = base.extend<{
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  networkPage: NetworkPage;
}>({
  // Просто создаём объект — без goto() и login(), их вызовет тест
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },

  // inventoryPage зависит от loginPage — использует его для входа
  inventoryPage: async ({ page, loginPage }, use) => {
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
    const inventoryPage = new InventoryPage(page);
    await use(inventoryPage);
  },

  networkPage: async ({ page }, use) => {
    const networkPage = new NetworkPage(page);
    await use(networkPage);
  },
});

export { expect };