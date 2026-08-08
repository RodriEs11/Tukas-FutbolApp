import { test, expect } from './fixtures';

test.describe('Estadísticas', () => {
  test('jugador debe poder ver la tabla de posiciones', async ({ playerPage }) => {
    await playerPage.goto('/stats'); // O '/leaderboard', depende de la URL
    
    // Verificar que la página de estadísticas carga
    await expect(playerPage.getByRole('heading', { name: /Estadísticas|Clasificación/i })).toBeVisible();
    
    // Verificar que hay al menos una tabla o lista de jugadores
    // Dependerá de la estructura de la página
  });
});
