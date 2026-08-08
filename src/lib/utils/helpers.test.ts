import { describe, it, expect } from 'vitest';
import {
  formatDate,
  formatDateTime,
  getPlayerDisplayName,
  getInitials,
  calculatePlayerStats,
  stringToColor,
  pluralize
} from './helpers';
import { POINTS } from './constants';
import type { Match, MatchPlayer, UserProfile } from '@/lib/types/database';

describe('Helpers', () => {
  describe('formatDate', () => {
    it('debería formatear la fecha correctamente', () => {
      const result = formatDate('2023-10-15T12:00:00Z');
      expect(result).toContain('15/10/2023');
    });
  });

  describe('formatDateTime', () => {
    it('debería formatear fecha y hora correctamente', () => {
      const result = formatDateTime('2023-10-15T12:00:00Z');
      expect(result).toContain('15/10/2023');
      expect(result).toMatch(/\d{2}:\d{2}/);
    });
  });

  describe('getPlayerDisplayName', () => {
    it('debería retornar el apodo si existe', () => {
      const player = { nickname: 'El Crack', first_name: 'Juan', last_name: 'Perez' } as UserProfile;
      expect(getPlayerDisplayName(player)).toBe('El Crack');
    });

    it('debería retornar nombre y apellido si no hay apodo', () => {
      const player = { first_name: 'Juan', last_name: 'Perez' } as UserProfile;
      expect(getPlayerDisplayName(player)).toBe('Juan Perez');
    });

    it('debería retornar "Sin nombre" si no hay datos', () => {
      const player = { first_name: '', last_name: '', nickname: '' } as UserProfile;
      expect(getPlayerDisplayName(player)).toBe('Sin nombre');
    });
  });

  describe('getInitials', () => {
    it('debería retornar iniciales', () => {
      const player = { first_name: 'Juan', last_name: 'Perez' } as UserProfile;
      expect(getInitials(player)).toBe('JP');
    });
  });

  describe('calculatePlayerStats', () => {
    it('debería calcular estadísticas', () => {
      const player = { id: 'p1' } as UserProfile;
      const matches = [
        { id: 'm1', status: 'played', score_team_a: 2, score_team_b: 1 },
        { id: 'm2', status: 'played', score_team_a: 1, score_team_b: 1 },
      ] as Match[];
      const matchPlayers = [
        { player_id: 'p1', match_id: 'm1', team: 'A', attended: true, goals: 1 },
        { player_id: 'p1', match_id: 'm2', team: 'A', attended: true, goals: 0 },
      ] as MatchPlayer[];

      const stats = calculatePlayerStats(player, matches, matchPlayers);
      expect(stats.matches_played).toBe(2);
      expect(stats.goals).toBe(1);
      expect(stats.wins).toBe(1);
      expect(stats.draws).toBe(1);
      expect(stats.points).toBe(POINTS.WIN * 1 + POINTS.DRAW * 1);
    });
  });

  describe('stringToColor', () => {
    it('debería generar color en hsl', () => {
      expect(stringToColor('test')).toMatch(/^hsl\(/);
    });
  });

  describe('pluralize', () => {
    it('debería pluralizar correctamente', () => {
      expect(pluralize(1, 'gol', 'goles')).toBe('1 gol');
      expect(pluralize(2, 'gol', 'goles')).toBe('2 goles');
    });
  });
});
