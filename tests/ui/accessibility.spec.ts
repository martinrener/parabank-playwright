import { test } from '../../fixtures';
import { checkAccessibility } from '../../functions/accessibility';

test.describe('Accessibility', () => {
  test(
    'ACC-A11Y-001 > Accessibility > overview has no critical accessibility violations',
    { annotation: { type: 'id', description: 'ACC-A11Y-001' } },
    async ({ accountsPage }) => {
      // Act
      await accountsPage.goToOverview()

      // Assert
      await checkAccessibility(accountsPage.page, [
        'color-contrast',
        'html-has-lang',
        'landmark-one-main',
        'region',
        'image-alt',
        'link-name',
      ])
    },
  );
});
