import { type Page } from '@playwright/test';

// Declaration merging: tells TypeScript that BasePage instances have all Page
// methods. The Proxy in the constructor delegates unknown property access to
// the inner page at runtime, so subclasses call this.goto() not this.page.goto().
// eslint-disable-next-line @typescript-eslint/no-empty-object-type, @typescript-eslint/no-unsafe-declaration-merging
export interface BasePage extends Page {}

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class BasePage {
  static readonly OVERVIEW_URL = '/parabank/overview.htm';
  static readonly LOGOUT_URL = '/parabank/logout.htm';

  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
    return new Proxy(this, {
      get(target, prop, receiver) {
        if (prop in target) {
          return Reflect.get(target, prop, receiver);
        }
        const value = (page as unknown as Record<string | symbol, unknown>)[prop];
        return typeof value === 'function' ? (value as (...args: unknown[]) => unknown).bind(page) : value;
      },
    }) as this;
  }

  async goToOverview() {
    await this.goto(BasePage.OVERVIEW_URL);
  }

  async logout() {
    await this.goto(BasePage.LOGOUT_URL);
  }

  async navigateHome() {
    await this.getByRole('link', { name: 'home' }).click();
  }

  async navigateAbout() {
    await this.getByRole('link', { name: 'About Us' }).click();
  }

  async navigateContact() {
    await this.getByRole('link', { name: 'Contact' }).click();
  }

  async navigateAdmin() {
    await this.getByRole('link', { name: 'Admin Page' }).click();
  }
}
