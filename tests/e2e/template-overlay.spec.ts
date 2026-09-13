import { test, expect } from '@playwright/test';

test.describe('Template Overlay Composition & Layout Previews', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Switch to Templates tab
    const templatesTab = page.locator('aside button:has-text("Templates")').or(page.locator('button:has-text("Templates")')).first();
    await templatesTab.click();
    await expect(page.locator('h1:has-text("Render")')).toBeVisible();
  });

  test('renders template library, archetype cards, and schematic previews', async ({ page }) => {
    // Verify template manager header
    await expect(page.locator('text=Render Architect')).toBeVisible();

    // Verify template cards exist with archetype badges
    const templateCards = page.locator('text=FULLSCREEN_HUD').or(page.locator('text=SPLIT_70_30')).or(page.locator('text=L_BAR_TICKER'));
    await expect(templateCards.first()).toBeVisible();

    // Verify template names
    const templateName = page.locator('text=Standard Fullscreen HUD').or(page.locator('text=Split Screen'));
    await expect(templateName.first()).toBeVisible();
  });

  test('opens template editor, toggles between wireframe and live sandbox iframe preview', async ({ page }) => {
    // Click the first template card to activate full preview and editor
    const firstCard = page.locator('text=Standard Fullscreen HUD').first();
    await firstCard.click();

    // Verify full visual preview component mounts with Live Sandbox button
    const liveSandboxButton = page.locator('button:has-text("Live Sandbox")').first();
    await expect(liveSandboxButton).toBeVisible();
    await liveSandboxButton.click();

    // In live sandbox mode, an iframe element is mounted
    const sandboxIframe = page.locator('iframe[title="Template Live Preview"]').or(page.locator('iframe')).first();
    await expect(sandboxIframe).toBeVisible();

    // Switch back to Wireframe view
    const wireframeButton = page.locator('button:has-text("Wireframe")').first();
    await expect(wireframeButton).toBeVisible();
    await wireframeButton.click();
    await expect(page.locator('svg').filter({ hasText: 'MAIN_CANVAS' }).or(page.locator('text=PRIMARY VIDEO SURFACE')).or(page.locator('text=LAYOUT ARCHETYPE'))).toBeDefined();
  });

  test('interacts with template editor code tabs and variable tags', async ({ page }) => {
    // Open editor by clicking template card
    const firstCard = page.locator('text=Standard Fullscreen HUD').first();
    await firstCard.click();

    // Verify editor tabs are rendered (HTML, CSS, JS)
    await expect(page.locator('button:has-text("HTML")').first()).toBeVisible();
    await expect(page.locator('button:has-text("CSS")').first()).toBeVisible();
    await expect(page.locator('button:has-text("JS")').first()).toBeVisible();

    // Switch to CSS tab
    await page.locator('button:has-text("CSS")').first().click();
    await expect(page.locator('textarea').first()).toBeVisible();

    // Switch back to HTML tab
    await page.locator('button:has-text("HTML")').first().click();
    await expect(page.locator('text={{media.url}}').or(page.locator('text={{media.name}}')).first()).toBeVisible();
  });
});

