import { test, expect } from '@playwright/test';

test.describe('Autenticación', () => {
  // Use isolated page context for unauthenticated tests
  test('debe permitir iniciar sesión', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', 'admin@tukas-test.com');
    await page.fill('input[type="password"]', 'TestAdmin123!');
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL('/dashboard');
    await expect(page.getByRole('heading', { name: 'Las Tukas' })).toBeVisible();
  });

  test('debe mostrar error con credenciales inválidas', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', 'wrong@email.com');
    await page.fill('input[type="password"]', 'WrongPassword123!');
    await page.click('button[type="submit"]');

    await expect(page.locator('text=Invalid login credentials').or(page.locator('text=Credenciales inválidas'))).toBeVisible({ timeout: 10000 });
  });

  test('debe redirigir a login desde rutas protegidas', async ({ page }) => {
    await page.goto('/matches');
    await expect(page).toHaveURL(/.*\/login/);
  });
});
