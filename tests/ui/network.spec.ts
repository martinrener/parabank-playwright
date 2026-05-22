import { test } from '../../fixtures';

test.describe('Network', () => {
  test.afterEach(async ({ page }) => {
    await page.unrouteAll();
  });

  test(
    'NET-001 > Network > when api returns 500 ui shows error message',
    { annotation: { type: 'id', description: 'NET-001' } },
    async ({ accountsPage }) => {
      // Arrange
      await accountsPage.simulateServerError('**/accounts*')

      // Act
      await accountsPage.goToOverview()

      // Assert
      await accountsPage.expectErrorMessage()
    },
  );
});
