import { test, expect } from '@playwright/test';

test.describe('Workout Tracker - Leaderboard', () => {
  test('should display leaderboard interface', async ({ page }) => {
    await page.goto('/');
    
    // Check for leaderboard section
    const leaderboardSection = page.locator('.leaderboard');
    await expect(leaderboardSection).toBeVisible();
    await expect(leaderboardSection.locator('h2')).toContainText('Leaderboard');
    
    // Check for load leaderboard button
    const loadButton = leaderboardSection.locator('button');
    await expect(loadButton).toBeVisible();
    await expect(loadButton).toContainText('Load Challenge Leaderboard');
  });

  test('should load and display leaderboard when button is clicked', async ({ page }) => {
    await page.goto('/');
    
    // Click the load leaderboard button
    const leaderboardSection = page.locator('.leaderboard');
    const loadButton = leaderboardSection.locator('button');
    await loadButton.click();
    
    // Wait for content to load
    await page.waitForFunction(() => {
      const content = document.querySelector('#leaderboard-content');
      return content && !content.textContent?.includes('Loading leaderboard...');
    });
    
    // Check that leaderboard data is displayed
    const leaderboardContent = page.locator('#leaderboard-content');
    await expect(leaderboardContent.locator('table')).toBeVisible();
    
    // Check for table headers
    await expect(leaderboardContent).toContainText('Rank');
    await expect(leaderboardContent).toContainText('Username');
    await expect(leaderboardContent).toContainText('Name');
    await expect(leaderboardContent).toContainText('Total Score');
  });

  test('should display users in correct ranking order', async ({ page }) => {
    await page.goto('/');
    
    // Load leaderboard
    await page.click('.leaderboard button');
    
    // Wait for content to load
    await page.waitForFunction(() => {
      const content = document.querySelector('#leaderboard-content table');
      return content && content.querySelectorAll('tr').length > 1;
    });
    
    // Get all table rows (excluding header)
    const rows = page.locator('#leaderboard-content table tr').nth(1); // Skip header row
    
    // Check that first row exists (should be rank 1)
    await expect(rows.locator('td').first()).toContainText('1');
    
    // Check that usernames are displayed
    const tableContent = page.locator('#leaderboard-content table');
    await expect(tableContent).toContainText('fitness_mike');
    await expect(tableContent).toContainText('healthy_sarah');
    await expect(tableContent).toContainText('strong_alex');
  });

  test('should display user details in leaderboard', async ({ page }) => {
    await page.goto('/');
    
    // Load leaderboard
    await page.click('.leaderboard button');
    
    // Wait for content to load
    await page.waitForFunction(() => {
      const content = document.querySelector('#leaderboard-content table');
      return content && content.querySelectorAll('tr').length > 1;
    });
    
    const tableContent = page.locator('#leaderboard-content table');
    
    // Check for user names (first and last names)
    await expect(tableContent).toContainText('Mike Johnson');
    await expect(tableContent).toContainText('Sarah Williams');
    await expect(tableContent).toContainText('Alex Chen');
    
    // Check that scores are displayed (should be numbers)
    const scoreCells = tableContent.locator('td:nth-child(4)'); // Total Score column
    const firstScore = await scoreCells.first().textContent();
    expect(firstScore).toMatch(/^\d+$/); // Should be a number
  });

  test('should handle API errors gracefully for leaderboard', async ({ page }) => {
    // Intercept the API call and make it fail
    await page.route('/api/leaderboard/challenge/*', route => {
      route.fulfill({
        status: 404,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Challenge not found' })
      });
    });
    
    await page.goto('/');
    
    // Click the load leaderboard button
    await page.click('.leaderboard button');
    
    // Check that error is displayed
    await expect(page.locator('#leaderboard-content .error')).toBeVisible();
    await expect(page.locator('#leaderboard-content .error')).toContainText('Error loading leaderboard');
  });

  test('should show loading state while fetching leaderboard', async ({ page }) => {
    await page.goto('/');
    
    // Intercept API call to add delay
    await page.route('/api/leaderboard/challenge/*', async route => {
      // Add a small delay to see loading state
      await new Promise(resolve => setTimeout(resolve, 100));
      const response = await page.request.fetch(route.request());
      route.fulfill({ response });
    });
    
    // Click the load leaderboard button
    await page.click('.leaderboard button');
    
    // Check that loading message appears initially
    await expect(page.locator('#leaderboard-content')).toContainText('Loading leaderboard...');
    
    // Wait for content to finish loading
    await page.waitForFunction(() => {
      const content = document.querySelector('#leaderboard-content');
      return content && !content.textContent?.includes('Loading leaderboard...');
    });
    
    // Check that actual content is now displayed
    await expect(page.locator('#leaderboard-content table')).toBeVisible();
  });
});