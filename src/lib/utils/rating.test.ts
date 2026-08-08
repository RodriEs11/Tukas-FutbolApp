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

    it('debería topear el rating a 99', () => {
      const stats = { ...defaultStats, matches_played: 10, wins: 10, goals: 50 };
      expect(calculatePlayerRating(stats, 10)).toBe(99);
    });
  });
});
