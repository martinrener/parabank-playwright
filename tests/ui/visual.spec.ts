import { test, expect } from '../../fixtures';

test.describe('Visual', () => {
  test(
    'VIS-001 > Visual > overview matches snapshot',
    { annotation: { type: 'id', description: 'VIS-001' } },
    async ({ accountsPage }) => {
      // Arrange

      // Act
      await accountsPage.goToOverview()

      // Assert
      await expect(accountsPage).toHaveScreenshot('overview.png')
    },
  );
});
