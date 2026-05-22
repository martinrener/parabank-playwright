import { test, expect } from '../../fixtures';

test.describe('Performance', () => {
  test.afterEach(async ({ page }) => {
    await page.unrouteAll();
  });

  test(
    'PERF-001 > Performance > overview loads within performance budget',
    { annotation: { type: 'id', description: 'PERF-001' } },
    async ({ accountsPage }) => {
      // Arrange — authenticated session via storageState

      // Act — navigate to the overview
      await accountsPage.goToOverview()

      // Assert — load time is within the 3000ms budget
      const loadTime = await accountsPage.getLoadTime()
      expect(loadTime).toBeLessThan(3000)
    },
  );
});
