import { test, expect } from '@playwright/test';

test.describe('Workout Tracker - Macro Tracking', () => {
  test('should display macro tracking interface', async ({ page }) => {
    await page.goto('/');
    
    // Check for main heading
    await expect(page.locator('h1')).toContainText('Workout Tracker');
    
    // Check for macro tracking section
    const macroSection = page.locator('.macro-tracking');
    await expect(macroSection).toBeVisible();
    await expect(macroSection.locator('h2')).toContainText('Macro Tracking');
    
    // Check for load macro data button
    const loadButton = macroSection.locator('button');
    await expect(loadButton).toBeVisible();
    await expect(loadButton).toContainText('Load Macro Data');
  });

  test('should load and display macro data when button is clicked', async ({ page }) => {
    await page.goto('/');
    
    // Click the load macro data button
    const macroSection = page.locator('.macro-tracking');
    const loadButton = macroSection.locator('button');
    await loadButton.click();
    
    // Wait for content to load
    await page.waitForFunction(() => {
      const content = document.querySelector('#macro-content');
      return content && !content.textContent?.includes('Loading macro data...');
    });
    
    // Check that macro data is displayed
    const macroContent = page.locator('#macro-content');
    await expect(macroContent).toContainText('User: fitness_mike (Week 1)');
    await expect(macroContent).toContainText('Daily Averages vs Targets');
    
    // Check for macro bars
    await expect(macroContent.locator('.macro-bar')).toHaveCount(4); // protein, carbs, fat, calories
    
    // Check for specific macros
    await expect(macroContent).toContainText('Protein:');
    await expect(macroContent).toContainText('Carbs:');
    await expect(macroContent).toContainText('Fat:');
    await expect(macroContent).toContainText('Calories:');
  });

  test('should display macro progress bars with correct styling', async ({ page }) => {
    await page.goto('/');
    
    // Load macro data
    await page.click('.macro-tracking button');
    
    // Wait for content to load
    await page.waitForFunction(() => {
      const content = document.querySelector('#macro-content');
      return content && content.textContent?.includes('Daily Averages vs Targets');
    });
    
    // Check that macro bars have the correct classes
    const macroContent = page.locator('#macro-content');
    await expect(macroContent.locator('.macro-fill.protein')).toBeVisible();
    await expect(macroContent.locator('.macro-fill.carbs')).toBeVisible();
    await expect(macroContent.locator('.macro-fill.fat')).toBeVisible();
    await expect(macroContent.locator('.macro-fill.calories')).toBeVisible();
    
    // Check that progress bars have width styles
    const proteinBar = macroContent.locator('.macro-fill.protein').first();
    const style = await proteinBar.getAttribute('style');
    expect(style).toMatch(/width:\s*\d+(\.\d+)?%/);
  });

  test('should handle API errors gracefully', async ({ page }) => {
    // Intercept the API call and make it fail
    await page.route('/api/macros/user/user_1*', route => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal server error' })
      });
    });
    
    await page.goto('/');
    
    // Click the load macro data button
    await page.click('.macro-tracking button');
    
    // Check that error is displayed
    await expect(page.locator('#macro-content .error')).toBeVisible();
    await expect(page.locator('#macro-content .error')).toContainText('Error loading macro data');
  });
});