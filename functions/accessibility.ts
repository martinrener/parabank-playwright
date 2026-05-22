import { type Page } from '@playwright/test';
import { injectAxe, checkA11y } from 'axe-playwright';

export async function checkAccessibility(page: Page, disabledRules: string[] = []) {
  const rules = Object.fromEntries(disabledRules.map(rule => [rule, { enabled: false }]));
  await injectAxe(page);
  await checkA11y(page, undefined, { axeOptions: { rules } });
}
