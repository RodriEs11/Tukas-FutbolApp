import { test, expect } from './fixtures';

test.describe('Navegación', () => {
  test('debe mostrar la navegación para usuarios autenticados', async ({ playerPage }) => {
    await playerPage.goto('/');
    
    // Verificar que los enlaces principales estén presentes (dependerá de si es desktop o mobile)
    await expect(playerPage.getByRole('link', { name: /Inicio/i })).toBeVisible();
    await expect(playerPage.getByRole('link', { name: /Partidos/i })).toBeVisible();
    await expect(playerPage.getByRole('link', { name: /Perfil/i })).toBeVisible();
  });
});
