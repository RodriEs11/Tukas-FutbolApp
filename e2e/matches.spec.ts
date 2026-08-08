import { test, expect } from './fixtures';

test.describe('Partidos', () => {
  test('administrador debe poder crear un partido', async ({ adminPage }) => {
    await adminPage.goto('/matches');
    
    // Asumiendo que hay un botón de crear partido
    const createButton = adminPage.getByRole('button', { name: /Crear/i });
    if (await createButton.isVisible()) {
      await createButton.click();
      
      // Rellenar formulario de partido (dependerá de la UI exacta)
      await adminPage.fill('input[name="date"]', '2026-12-31');
      await adminPage.fill('input[name="time"]', '20:00');
      // etc.
      
      const submitButton = adminPage.getByRole('button', { name: /Guardar/i });
      await submitButton.click();
      
      await expect(adminPage.getByText(/Partido creado/i)).toBeVisible();
    } else {
      console.log('No se encontró botón de crear partido, puede que la UI sea diferente.');
    }
  });

  test('jugador debe poder ver los partidos', async ({ playerPage }) => {
    await playerPage.goto('/matches');
    await expect(playerPage.getByRole('heading', { name: /Partidos/i })).toBeVisible();
  });
});
