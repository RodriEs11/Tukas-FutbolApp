import { describe, it, expect } from 'vitest';
import { calculatePlayerRating, getCardTier, RATING_MIN_MATCHES } from './rating';
import type { PlayerStats } from '@/lib/types/database';

describe('Rating Utils', () => {
  describe('getCardTier', () => {
    it('debería retornar unrated si rating es null', () => {
      expect(getCardTier(null).tier).toBe('unrated');
    });
    it('debería retornar las categorías correctas', () => {
      expect(getCardTier(50).tier).toBe('bronze');
      expect(getCardTier(65).tier).toBe('silver');
      expect(getCardTier(80).tier).toBe('gold');
      expect(getCardTier(90).tier).toBe('elite');
    });
  });

  describe('calculatePlayerRating', () => {
    const defaultStats: PlayerStats = {
      player: {} as any, matches_played: 0, goals: 0, wins: 0, draws: 0, losses: 0, points: 0
    };

    it('debería retornar null si no hay suficientes partidos', () => {
      expect(calculatePlayerRating({ ...defaultStats, matches_played: RATING_MIN_MATCHES - 1 }, 10)).toBeNull();
    });

    it('debería calcular el rating', () => {
      const stats = { ...defaultStats, matches_played: 10, wins: 5, goals: 10 };
      expect(calculatePlayerRating(stats, 10)).toBe(63);
    });

    it('debería calcular el rating de un arquero utilizando valla menos vencida en vez de goles', () => {
      // Arquero con 10 partidos, 5 victorias (winComponent = 0.5 * 45 = 22.5)
      // regularidad = 10 / 10 * 25 = 25
      // clean_sheet_points_avg = 7.6 -> performanceComponent = (7.6 / 10) * 30 = 22.8
      // Total = 22.5 + 22.8 + 25 = 70.3 -> 70
      const gkStats: PlayerStats = {
        ...defaultStats,
        player: { position: 'Arquero' } as any,
        matches_played: 10,
        wins: 5,
        goals: 0,
        matches_as_gk: 10,
        clean_sheets: 2,
        clean_sheet_points_avg: 7.6,
      };
      expect(calculatePlayerRating(gkStats, 10)).toBe(70);
    });

    it('un arquero no debe sumar puntos por goles que haya marcado personalmente', () => {
      // Si el arquero marcó 5 goles pero su valla menos vencida es 0 (recibió muchos goles),
      // su performanceComponent debe basarse únicamente en valla menos vencida.
      const gkStats: PlayerStats = {
        ...defaultStats,
        player: { position: 'Arquero' } as any,
        matches_played: 10,
        wins: 5, // 22.5
        goals: 5, // NO debe contar
        matches_as_gk: 10,
        clean_sheets: 0,
        clean_sheet_points_avg: 0, // 0 pts
      };
      // 22.5 + 0 + 25 = 47.5 -> 48
      expect(calculatePlayerRating(gkStats, 10)).toBe(48);
    });
  });
});
