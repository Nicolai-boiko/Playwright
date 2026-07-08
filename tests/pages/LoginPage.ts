import { expect, type Locator, type Page } from "@playwright/test";

export class LoginPage {
  private readonly page: Page;
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;
  private readonly errorNotification: Locator;

  constructor(page: Page) {
    this.page = page  
    this.usernameInput = page.locator('#user-name')
    this.passwordInput = page.locator('#password')
    this.loginButton = page.locator('#login-button')
    this.errorNotification = page.locator('.error-message-container')
  }

  async goto() {
    await this.page.goto('https://www.saucedemo.com/')
  }
  
  async expectPage() {
    await expect(this.page).toHaveTitle(/Swag Labs/)
    await expect(this.usernameInput).toBeVisible()
    await expect(this.passwordInput).toBeVisible()
    await expect(this.loginButton).toBeVisible()
  }

  async expectErrorNotification() {
    await expect(this.errorNotification).toBeVisible()
    await expect(this.errorNotification).toContainText('do not match')
  }


  async login(username: string, password: string) {
    await this.usernameInput.fill(username)
    await this.passwordInput.fill(password)
    await this.loginButton.click()
  }
}