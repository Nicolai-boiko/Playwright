import { test, expect } from './fixtures';

test.describe('API testing with request fixture', () => {

  // ─── GET: проверяем статус ответа ───

  test('GET homepage returns 200', async ({ request }) => {
    // request.get() — как this.http.get() в Angular
    const response = await request.get('https://www.saucedemo.com/');

    // response.status() — HTTP-код. expect — обычный ассерт
    expect(response.status()).toBe(200);
  });

  // ─── GET: проверяем содержимое ответа ───

  test('GET homepage contains Swag Labs in HTML', async ({ request }) => {
    const response = await request.get('https://www.saucedemo.com/');

    // response.text() — получаем тело ответа как строку (весь HTML)
    const html = await response.text();

    // Проверяем что в HTML есть ключевая строка
    expect(html).toContain('Swag Labs');
  });

  // ─── GET: проверяем заголовки ответа ───

  test('GET homepage has correct Content-Type', async ({ request }) => {
    const response = await request.get('https://www.saucedemo.com/');

    // response.headers() — объект всех заголовков
    const headers = response.headers();

    expect(headers['content-type']).toContain('text/html');
  });

  // ─── GET: несуществующая страница возвращает 404 ───

  test('GET nonexistent page returns 404', async ({ request }) => {
    const response = await request.get('https://www.saucedemo.com/this-page-does-not-exist');

    expect(response.status()).toBe(404);
  });

  // ─── GET: проверяем что ответ успешный через ok() ───

  test('GET homepage is ok', async ({ request }) => {
    const response = await request.get('https://www.saucedemo.com/');

    // response.ok() — true если статус 2xx
    expect(response.ok()).toBe(true);
  });
});
