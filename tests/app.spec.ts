import { test, expect } from '@playwright/test';

test.describe('IronCircle App', () => {
  test('should load the landing page', async ({ page }) => {
    await page.goto('/');
    
    await expect(page).toHaveTitle('IronCircle - Fitness Community & Tracker');
    await expect(page.getByText('Transform Your Fitness Journey')).toBeVisible();
    await expect(page.getByText('IronCircle')).toBeVisible();
  });

  test('should navigate to dashboard when clicking Get Started', async ({ page }) => {
    await page.goto('/');
    
    await page.getByRole('button', { name: 'Get Started' }).click();
    
    await expect(page.getByText('Welcome, Demo User')).toBeVisible();
    await expect(page.getByText('Daily Check-in')).toBeVisible();
    await expect(page.getByText("Today's Macros")).toBeVisible();
  });

  test('should allow protein tracking', async ({ page }) => {
    await page.goto('/');
    
    // Navigate to dashboard
    await page.getByRole('button', { name: 'Get Started' }).click();
    
    // Add protein
    await page.getByPlaceholder('Add protein (g)').fill('30');
    await page.getByRole('button', { name: 'Add' }).click();
    
    // Check if protein was added
    await expect(page.getByText('30g / 120g')).toBeVisible();
  });

  test('should show daily check-in options', async ({ page }) => {
    await page.goto('/');
    
    // Navigate to dashboard
    await page.getByRole('button', { name: 'Get Started' }).click();
    
    // Check daily check-in options
    await expect(page.getByText('😊 Great')).toBeVisible();
    await expect(page.getByText('😐 Okay')).toBeVisible();
    await expect(page.getByText('😴 Tired')).toBeVisible();
    await expect(page.getByText('💪 Energized')).toBeVisible();
  });

  test('should show user stats and progress', async ({ page }) => {
    await page.goto('/');
    
    // Navigate to dashboard
    await page.getByRole('button', { name: 'Get Started' }).click();
    
    // Check stats
    await expect(page.getByText('7 day streak')).toBeVisible();
    await expect(page.getByText('Level 5 (1250 XP)')).toBeVisible();
    await expect(page.getByText('4/5')).toBeVisible(); // Workouts
    await expect(page.getByText('98g')).toBeVisible(); // Avg Protein
  });
});