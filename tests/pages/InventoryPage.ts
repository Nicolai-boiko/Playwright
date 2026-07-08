import { expect, type Locator, type Page } from "@playwright/test";

export class InventoryPage {
  private readonly page: Page;
  private readonly title: Locator;
  private readonly filter: Locator;
  private readonly inventoryItems: Locator;
  private readonly cartBadge: Locator;
  private readonly cartLink: Locator;

  constructor(page: Page) {
    this.page = page;

    // Заголовок страницы "Products"
    this.title = page.locator('.title');

    // Дропдаун сортировки (select)
    this.filter = page.locator('[data-test="product-sort-container"]');

    // Все карточки товаров (их 6 штук)
    this.inventoryItems = page.locator('.inventory_item');

    // Бейдж с количеством на иконке корзины
    this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');

    // Ссылка-иконка корзины
    this.cartLink = page.locator('[data-test="shopping-cart-link"]');
  }

  // Проверяем что страница загрузилась
  async expectPage() {
    // Заголовок браузера
    await expect(this.page).toHaveTitle(/Swag Labs/);
    // Заголовок "Products" виден
    await expect(this.title).toBeVisible();
    // Дропдаун сортировки виден
    await expect(this.filter).toBeVisible();
    // Хотя бы один товар на странице есть
    await expect(this.inventoryItems.first()).toBeVisible();
  }

  // Выбрать сортировку: 'az' (A→Z), 'za' (Z→A), 'lohi' (дешёвые), 'hilo' (дорогие)
  async sortBy(option: 'az' | 'za' | 'lohi' | 'hilo') {
    await this.filter.selectOption(option);
  }

  // Получить текст названия первого товара в списке
  async getFirstItemName(): Promise<string> {
    // .inventory_item_name лежит внутри каждого .inventory_item
    const name = await this.inventoryItems
      .first()                              // первый товар
      .locator('.inventory_item_name')      // внутри — его название
      .innerText();                         // берём текст
    return name;
  }

  // Получить все названия товаров (массив строк)
  async getAllItemNames(): Promise<string[]> {
    return await this.page
      .locator('.inventory_item_name')
      .allInnerTexts();                     // Playwright собирает текст со всех совпадений
  }

  // Получить все цены товаров (массив строк вида "$7.99")
  async getAllPrices(): Promise<string[]> {
    return await this.page
      .locator('.inventory_item_price')
      .allInnerTexts();
  }

  // Добавить товар в корзину по названию
  async addToCart(productName: string) {
    await this.page
      .locator('.inventory_item')           // все контейнеры товаров
      .filter({ hasText: productName })     // сужаем до того, где есть нужный текст
      .locator('button')                    // внутри него кнопка (она там одна)
      .click();                             // жмём
  }

  // Получить число на бейдже корзины (вернёт пустую строку если корзина пуста)
  async getCartBadgeCount(): Promise<string> {
    return await this.cartBadge.innerText();
  }

  // Перейти в корзину
  async openCart() {
    await this.cartLink.click();
  }
}
