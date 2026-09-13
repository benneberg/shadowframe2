import { test, expect } from '@playwright/test';

test.describe('Simulated Player Viewport Rendering', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Switch to Virtual Player / Engine tab
    const engineTab = page.locator('aside button:has-text("Engine")').or(page.locator('button:has-text("Engine")')).first();
    await engineTab.click();
    await expect(page.locator('h1:has-text("Edge")')).toBeVisible();
  });

  test('renders player viewport and standby state correctly', async ({ page }) => {
    // Check standby banner
    await expect(page.locator('text=VIRTUAL_HARDWARE_STANDBY')).toBeVisible();
    await expect(page.locator('text=IDLE_WAITING_FOR_BOOT')).toBeVisible();

    // Check node selection dropdown is present and populated
    const select = page.locator('select');
    await expect(select).toBeVisible();
    const options = await select.locator('option').count();
    expect(options).toBeGreaterThan(0);

    // Verify INITIALIZE_KERNEL control button is visible
    const bootButton = page.locator('button:has-text("INITIALIZE_KERNEL")');
    await expect(bootButton).toBeVisible();
    await expect(bootButton).toBeEnabled();
  });

  test('boots engine, mounts viewport layers, and runs execution simulation', async ({ page }) => {
    const bootButton = page.locator('button:has-text("INITIALIZE_KERNEL")');
    await bootButton.click();

    // Verify state transition
    const haltButton = page.locator('button:has-text("HALT_EXECUTION")');
    await expect(haltButton).toBeVisible();

    // Expect node status badge to indicate active simulation
    const statusIndicator = page.locator('text=NODE_EXECUTING').or(page.locator('text=KERNEL_WARMUP'));
    await expect(statusIndicator.first()).toBeVisible();

    // Live telemetry indicator should be visible
    await expect(page.locator('text=Live Telemetry')).toBeVisible();

    // Processing load metric should update from idle 0.0 GFLOPS
    await expect(page.locator('text=Processing Load')).toBeVisible();
    await expect(page.locator('text=12.4')).toBeVisible();

    // Halt execution and verify return to standby
    await haltButton.click();
    await expect(page.locator('button:has-text("INITIALIZE_KERNEL")')).toBeVisible();
    await expect(page.locator('text=VIRTUAL_HARDWARE_STANDBY')).toBeVisible();
    await expect(page.locator('text=IDLE_WAITING_FOR_BOOT')).toBeVisible();
  });
});
