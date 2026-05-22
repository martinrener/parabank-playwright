import { test } from '../../fixtures';
import { checkAccessibility } from '../../functions/accessibility';

test.describe('Accessibility', () => {
  test.afterEach(async ({ page }) => {
    await page.unrouteAll();
  });

  test(
    'ACC-A11Y-001 > Accessibility > overview has no critical accessibility violations',
    { annotation: { type: 'id', description: 'ACC-A11Y-001' } },
    async ({ accountsPage }) => {
      // Act
      await accountsPage.goToOverview();

      // Assert
      await checkAccessibility(accountsPage.page, [
        'color-contrast',
        'html-has-lang',
        'landmark-one-main',
        'region',
        'image-alt',
        'link-name',
      ]);
    },
  );

  test(
    'ACC-A11Y-002 > Accessibility > login page has no critical accessibility violations',
    { annotation: { type: 'id', description: 'ACC-A11Y-002' } },
    async ({ loginPage }) => {
      // Act
      await loginPage.goToLogin();

      // Assert
      await checkAccessibility(loginPage.page, [
        'color-contrast',
        'heading-order',
        'html-has-lang',
        'image-alt',
        'label',
        'link-name',
        'landmark-one-main',
        'page-has-heading-one',
        'region',
        'select-name',
      ]);
    },
  );

  test(
    'ACC-A11Y-003 > Accessibility > bill payment page has no critical accessibility violations',
    { annotation: { type: 'id', description: 'ACC-A11Y-003' } },
    async ({ billPage }) => {
      // Act
      await billPage.goToBillPay();

      // Assert
      await checkAccessibility(billPage.page, [
        'color-contrast',
        'html-has-lang',
        'image-alt',
        'label',
        'link-name',
        'landmark-one-main',
        'region',
        'select-name',
      ]);
    },
  );
});
