import { type Page } from "@playwright/test";

export class NetworkPage {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Включить перехват: обрываем все картинки
  async blockAllImages() {
    await this.page.route('**/*.{png,jpg,jpeg,svg,gif}', (route) => {
      route.abort();
    });
  }

  // Логировать все запросы в консоль
  async logAllRequests() {
    await this.page.route('**/*', (route) => {
      console.log(`[NETWORK] ${route.request().method()} ${route.request().url()}`);
      route.continue();
    });
  }

  // Подменить ответ API на свои данные
  async mockApiResponse(urlPattern: string, fakeData: object) {
    await this.page.route(urlPattern, (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(fakeData),
      });
    });
  }

  // Открыть сайт и дождаться ответа по паттерну.
  // waitForResponse() запускается ДО goto — иначе ответ уже улетит.
  async gotoLoginAndWaitForResponse(urlPattern: string): Promise<number> {
    const responsePromise = this.page.waitForResponse(urlPattern); // 1. заряжаем ожидание
    await this.page.goto('https://www.saucedemo.com/');            // 2. действие → запрос летит
    const response = await responsePromise;                        // 3. получаем ответ
    return response.status();
  }
}
