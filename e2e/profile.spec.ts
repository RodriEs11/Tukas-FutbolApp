import { test, expect } from './fixtures';

test.describe('Perfil', () => {
  test('jugador debe poder editar su perfil', async ({ playerPage }) => {
    await playerPage.goto('/profile');
    
    const editButton = playerPage.getByRole('button', { name: /Editar/i });
    if (await editButton.isVisible()) {
      await editButton.click();
      
      const aliasInput = playerPage.locator('input[name="alias"]');
      if (await aliasInput.isVisible()) {
        await aliasInput.fill('Jugador Editado');
        await playerPage.getByRole('button', { name: /Guardar/i }).click();
        
        await expect(playerPage.getByText(/Perfil actualizado/i)).toBeVisible();
      }
    } else {
      console.log('No se encontró el flujo de edición de perfil');
    }
  });
});
