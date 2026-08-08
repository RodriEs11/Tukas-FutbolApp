import { test, expect } from './fixtures';

test.describe('Permisos', () => {
  test('jugador regular no debe ver opciones de administrador', async ({ playerPage }) => {
    await playerPage.goto('/matches');
    
    // Verificar que el botón de crear partido no está visible para el jugador
    await expect(playerPage.getByRole('button', { name: /Crear/i })).not.toBeVisible();
  });
});
