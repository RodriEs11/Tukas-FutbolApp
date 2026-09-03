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

    it('debería calcular estadísticas exclusivas de arquero correctamente', () => {
      const goalkeeper = { id: 'gk1', position: 'Arquero' } as UserProfile;
      // 5 partidos de ejemplo:
      // Partido 1: rival anota 0 goles -> 10 pts
      // Partido 2: rival anota 1 gol -> 8 pts
      // Partido 3: rival anota 2 goles -> 6 pts
      // Partido 4: rival anota 0 goles -> 10 pts
      // Partido 5: rival anota 3 goles -> 4 pts
      // Promedio = (10 + 8 + 6 + 10 + 4) / 5 = 38 / 5 = 7.6 pts
      const matches = [
        { id: 'm1', status: 'played', score_team_a: 2, score_team_b: 0 },
        { id: 'm2', status: 'played', score_team_a: 3, score_team_b: 1 },
        { id: 'm3', status: 'played', score_team_a: 2, score_team_b: 2 },
        { id: 'm4', status: 'played', score_team_a: 1, score_team_b: 0 },
        { id: 'm5', status: 'played', score_team_a: 1, score_team_b: 3 },
      ] as Match[];

      const matchPlayers = [
        { player_id: 'gk1', match_id: 'm1', team: 'A', attended: true, goals: 0, pitch_position: 'gk' },
        { player_id: 'gk1', match_id: 'm2', team: 'A', attended: true, goals: 0, pitch_position: 'gk' },
        { player_id: 'gk1', match_id: 'm3', team: 'A', attended: true, goals: 0, pitch_position: 'gk' },
        { player_id: 'gk1', match_id: 'm4', team: 'A', attended: true, goals: 0, pitch_position: 'gk' },
        { player_id: 'gk1', match_id: 'm5', team: 'A', attended: true, goals: 0, pitch_position: 'gk' },
      ] as MatchPlayer[];

      const stats = calculatePlayerStats(goalkeeper, matches, matchPlayers);
      expect(stats.matches_as_gk).toBe(5);
      expect(stats.clean_sheets).toBe(2);
      expect(stats.clean_sheet_points_avg).toBe(7.6);
    });

    it('debería asignar 0 puntos si recibe 5 o más goles y 2 puntos con 4 goles', () => {
      const goalkeeper = { id: 'gk1', position: 'Arquero' } as UserProfile;
      const matches = [
        { id: 'm1', status: 'played', score_team_a: 0, score_team_b: 4 }, // 4 goles recibidos -> 2 pts
        { id: 'm2', status: 'played', score_team_a: 0, score_team_b: 5 }, // 5 goles recibidos -> 0 pts
        { id: 'm3', status: 'played', score_team_a: 0, score_team_b: 7 }, // 7 goles recibidos -> 0 pts
      ] as Match[];

      const matchPlayers = [
        { player_id: 'gk1', match_id: 'm1', team: 'A', attended: true, goals: 0, pitch_position: 'gk' },
        { player_id: 'gk1', match_id: 'm2', team: 'A', attended: true, goals: 0, pitch_position: 'gk' },
        { player_id: 'gk1', match_id: 'm3', team: 'A', attended: true, goals: 0, pitch_position: 'gk' },
      ] as MatchPlayer[];

      const stats = calculatePlayerStats(goalkeeper, matches, matchPlayers);
      expect(stats.matches_as_gk).toBe(3);
      expect(stats.clean_sheets).toBe(0);
      // (2 + 0 + 0) / 3 = 0.666 -> 0.7
      expect(stats.clean_sheet_points_avg).toBe(0.7);
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
