import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  getLeaderboard,
  getPlayerStats,
  getTopScorers,
  getUpcomingMatches,
  getLastMatch,
  getMaxMatchesPlayed,
  getScorersStats,
  getPaternities,
  getGoalkeeperStats,
} from './stats';
import { createClient } from '@/lib/supabase/server';
import { calculatePlayerStats } from '@/lib/utils/helpers';

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}));

vi.mock('@/lib/utils/helpers', () => ({
  calculatePlayerStats: vi.fn(),
}));

function mockQueryBuilder(resolvedValue: { data: unknown; error: unknown }) {
  const builder: Record<string, any> = {};
  const chainMethods = ['select', 'insert', 'update', 'delete', 'eq', 'order', 'in', 'filter', 'limit', 'single', 'maybeSingle', 'gte', 'or'];
  chainMethods.forEach(m => { builder[m] = vi.fn().mockReturnValue(builder); });
  builder.single = vi.fn().mockResolvedValue(resolvedValue);
  builder.maybeSingle = vi.fn().mockResolvedValue(resolvedValue);
  const p = Promise.resolve(resolvedValue);
  builder.then = p.then.bind(p);
  builder.catch = p.catch.bind(p);
  return builder;
}

describe('stats actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getLeaderboard', () => {
    it('debería retornar el leaderboard ordenado por puntos', async () => {
      const mockPlayers = [{ id: 'p1' }, { id: 'p2' }];
      const mockMatches = [{ id: 'm1' }];
      const mockMatchPlayers = [{ id: 'mp1' }];

      const builderPlayers = mockQueryBuilder({ data: mockPlayers, error: null });
      const builderMatches = mockQueryBuilder({ data: mockMatches, error: null });
      const builderMatchPlayers = mockQueryBuilder({ data: mockMatchPlayers, error: null });

      (createClient as any).mockResolvedValue({
        from: (table: string) => {
          if (table === 'user_profiles') return builderPlayers;
          if (table === 'matches') return builderMatches;
          if (table === 'match_players') return builderMatchPlayers;
        },
      });

      (calculatePlayerStats as any)
        .mockReturnValueOnce({ matches_played: 1, points: 3, goals: 1 })
        .mockReturnValueOnce({ matches_played: 1, points: 5, goals: 2 });

      const result = await getLeaderboard();
      expect(result.length).toBe(2);
      expect(result[0].points).toBe(5);
      expect(result[1].points).toBe(3);
    });

    it('debería retornar un array vacío si faltan datos', async () => {
      const builderPlayers = mockQueryBuilder({ data: null, error: null });
      (createClient as any).mockResolvedValue({
        from: () => builderPlayers,
      });

      const result = await getLeaderboard();
      expect(result).toEqual([]);
    });
  });

  describe('getPlayerStats', () => {
    it('debería retornar las estadísticas de un jugador', async () => {
      const mockPlayer = { id: 'p1' };
      const mockMatches = [{ id: 'm1' }];
      const mockMatchPlayers = [{ id: 'mp1' }];
      
      const builderPlayer = mockQueryBuilder({ data: mockPlayer, error: null });
      const builderMatches = mockQueryBuilder({ data: mockMatches, error: null });
      const builderMatchPlayers = mockQueryBuilder({ data: mockMatchPlayers, error: null });

      (createClient as any).mockResolvedValue({
        from: (table: string) => {
          if (table === 'user_profiles') return builderPlayer;
          if (table === 'matches') return builderMatches;
          if (table === 'match_players') return builderMatchPlayers;
        },
      });

      const mockStats = { matches_played: 1, points: 3 };
      (calculatePlayerStats as any).mockReturnValue(mockStats);

      const result = await getPlayerStats('p1');
      expect(result).toEqual(mockStats);
    });

    it('debería retornar null si el jugador no existe', async () => {
      const builderPlayer = mockQueryBuilder({ data: null, error: null });
      (createClient as any).mockResolvedValue({
        from: () => builderPlayer,
      });

      const result = await getPlayerStats('p1');
      expect(result).toBeNull();
    });

    it('debería retornar null si no se pueden obtener matches o match_players', async () => {
        const mockPlayer = { id: 'p1' };
        const builderPlayer = mockQueryBuilder({ data: mockPlayer, error: null });
        const builderMatches = mockQueryBuilder({ data: null, error: null });
        (createClient as any).mockResolvedValue({
          from: (table: string) => {
            if (table === 'user_profiles') return builderPlayer;
            return builderMatches;
          },
        });
  
        const result = await getPlayerStats('p1');
        expect(result).toBeNull();
      });
  });

  describe('getTopScorers', () => {
    it('debería retornar los máximos goleadores', async () => {
      const mockPlayers = [{ id: 'p1' }, { id: 'p2' }, { id: 'p3' }];
      const builderPlayers = mockQueryBuilder({ data: mockPlayers, error: null });
      const builderMatches = mockQueryBuilder({ data: [], error: null });
      const builderMatchPlayers = mockQueryBuilder({ data: [], error: null });

      (createClient as any).mockResolvedValue({
        from: (table: string) => {
          if (table === 'user_profiles') return builderPlayers;
          if (table === 'matches') return builderMatches;
          if (table === 'match_players') return builderMatchPlayers;
        },
      });

      (calculatePlayerStats as any)
        .mockReturnValueOnce({ matches_played: 1, points: 1, goals: 1 })
        .mockReturnValueOnce({ matches_played: 1, points: 1, goals: 5 })
        .mockReturnValueOnce({ matches_played: 1, points: 1, goals: 3 });

      const result = await getTopScorers(2);
      expect(result.length).toBe(2);
      expect(result[0].goals).toBe(5);
      expect(result[1].goals).toBe(3);
    });
  });

  describe('getUpcomingMatches', () => {
    it('debería retornar partidos próximos', async () => {
      const mockMatches = [{ id: 'm1', status: 'scheduled' }];
      const builder = mockQueryBuilder({ data: mockMatches, error: null });
      (createClient as any).mockResolvedValue({
        from: vi.fn().mockReturnValue(builder),
      });

      const result = await getUpcomingMatches();
      expect(result).toEqual(mockMatches);
    });

    it('debería retornar array vacío en error', async () => {
      const builder = mockQueryBuilder({ data: null, error: new Error('test') });
      (createClient as any).mockResolvedValue({
        from: vi.fn().mockReturnValue(builder),
      });
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const result = await getUpcomingMatches();
      expect(result).toEqual([]);
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe('getLastMatch', () => {
    it('debería retornar el último partido', async () => {
      const mockMatch = { id: 'm1' };
      const builder = mockQueryBuilder({ data: mockMatch, error: null });
      (createClient as any).mockResolvedValue({
        from: vi.fn().mockReturnValue(builder),
      });

      const result = await getLastMatch();
      expect(result).toEqual(mockMatch);
    });

    it('debería retornar null en error', async () => {
      const builder = mockQueryBuilder({ data: null, error: new Error('test') });
      (createClient as any).mockResolvedValue({
        from: vi.fn().mockReturnValue(builder),
      });
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const result = await getLastMatch();
      expect(result).toBeNull();
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe('getMaxMatchesPlayed', () => {
    it('debería retornar el máximo de partidos jugados', async () => {
      const mockPlayers = [{ id: 'p1' }, { id: 'p2' }];
      const builderPlayers = mockQueryBuilder({ data: mockPlayers, error: null });
      const builderMatches = mockQueryBuilder({ data: [], error: null });
      const builderMatchPlayers = mockQueryBuilder({ data: [], error: null });

      (createClient as any).mockResolvedValue({
        from: (table: string) => {
          if (table === 'user_profiles') return builderPlayers;
          if (table === 'matches') return builderMatches;
          if (table === 'match_players') return builderMatchPlayers;
        },
      });

      (calculatePlayerStats as any)
        .mockReturnValueOnce({ matches_played: 10, points: 1, goals: 1 })
        .mockReturnValueOnce({ matches_played: 25, points: 1, goals: 1 });

      const result = await getMaxMatchesPlayed();
      expect(result).toBe(25);
    });

    it('debería retornar 0 si no hay leaderboard', async () => {
      const builderPlayers = mockQueryBuilder({ data: null, error: null });
      (createClient as any).mockResolvedValue({
        from: () => builderPlayers,
      });

      const result = await getMaxMatchesPlayed();
      expect(result).toBe(0);
    });
  });

  describe('getScorersStats', () => {
    it('debería retornar las estadísticas de los goleadores', async () => {
      const mockPlayers = [{ id: 'p1' }, { id: 'p2' }];
      const mockMatches = [{ id: 'm1', status: 'played' }];
      const mockMatchPlayers = [
        { player_id: 'p1', match_id: 'm1', goals: 2, attended: true },
        { player_id: 'p2', match_id: 'm1', goals: 1, attended: true },
        { player_id: 'p1', match_id: 'm2', goals: 3, attended: true }, 
      ];

      const builderPlayers = mockQueryBuilder({ data: mockPlayers, error: null });
      const builderMatches = mockQueryBuilder({ data: mockMatches, error: null });
      const builderMatchPlayers = mockQueryBuilder({ data: mockMatchPlayers, error: null });

      (createClient as any).mockResolvedValue({
        from: (table: string) => {
          if (table === 'user_profiles') return builderPlayers;
          if (table === 'matches') return builderMatches;
          if (table === 'match_players') return builderMatchPlayers;
        },
      });

      const result = await getScorersStats();
      expect(result.length).toBe(2);
      expect(result[0].player.id).toBe('p1');
      expect(result[0].goals).toBe(2);
      expect(result[0].matches_played).toBe(1);
    });

    it('debería retornar array vacío si no hay datos', async () => {
      const builderPlayers = mockQueryBuilder({ data: null, error: null });
      (createClient as any).mockResolvedValue({
        from: () => builderPlayers,
      });

      const result = await getScorersStats();
      expect(result).toEqual([]);
    });

    it('debería ordenar por goals, luego por matches_played, luego por goals_per_match', async () => {
      const mockPlayers = [{ id: 'p1' }, { id: 'p2' }, { id: 'p3' }];
      const mockMatches = [{ id: 'm1', status: 'played' }, { id: 'm2', status: 'played' }, { id: 'm3', status: 'played' }];
      // p1: 1 match, 2 goals -> 2.00 gpm
      // p2: 2 matches, 2 goals -> 1.00 gpm
      // p3: 2 matches, 2 goals -> 1.00 gpm
      const mockMatchPlayers = [
        { player_id: 'p1', match_id: 'm1', goals: 2, attended: true },
        
        { player_id: 'p2', match_id: 'm1', goals: 1, attended: true },
        { player_id: 'p2', match_id: 'm2', goals: 1, attended: true },

        { player_id: 'p3', match_id: 'm1', goals: 2, attended: true },
        { player_id: 'p3', match_id: 'm2', goals: 0, attended: true },
        { player_id: 'p3', match_id: 'm3', goals: 0, attended: true }, // Add 3rd match for p3
      ];

      const builderPlayers = mockQueryBuilder({ data: mockPlayers, error: null });
      const builderMatches = mockQueryBuilder({ data: mockMatches, error: null });
      const builderMatchPlayers = mockQueryBuilder({ data: mockMatchPlayers, error: null });

      (createClient as any).mockResolvedValue({
        from: (table: string) => {
          if (table === 'user_profiles') return builderPlayers;
          if (table === 'matches') return builderMatches;
          if (table === 'match_players') return builderMatchPlayers;
        },
      });

      const result = await getScorersStats();
      
      expect(result.length).toBe(3);
      // All have 2 goals.
      // matches_played: p3 (3), p2 (2), p1 (1). Sort by matches_played desc: p3, p2, p1
      // If goals and matches are same, sorts by GPM
      expect(result[0].player.id).toBe('p3');
      expect(result[1].player.id).toBe('p2');
      expect(result[2].player.id).toBe('p1');
    });
  });

  describe('getPaternities', () => {
    it('debería retornar las paternidades calculadas', async () => {
      const mockPlayers = [
        { id: 'f1', name: 'Father 1' },
        { id: 's1', name: 'Son 1' }
      ];
      const mockPaternities = [
        { father_id: 'f1', son_id: 's1', net_wins: 3 }
      ];

      const builderPlayers = mockQueryBuilder({ data: mockPlayers, error: null });
      const builderPaternities = mockQueryBuilder({ data: mockPaternities, error: null });

      (createClient as any).mockResolvedValue({
        from: (table: string) => {
          if (table === 'user_profiles') return builderPlayers;
          if (table === 'paternities') return builderPaternities;
        },
      });

      const result = await getPaternities();
      expect(result.length).toBe(1);
      expect(result[0].father.id).toBe('f1');
      expect(result[0].sons[0].son.id).toBe('s1');
      expect(result[0].sons[0].net_wins).toBe(3);
    });

    it('debería retornar array vacío si no hay datos', async () => {
      const builderPlayers = mockQueryBuilder({ data: null, error: null });
      (createClient as any).mockResolvedValue({
        from: () => builderPlayers,
      });

      const result = await getPaternities();
      expect(result).toEqual([]);
    });

    it('debería ordenar paternidades por cantidad de hijos y luego por victorias netas', async () => {
      const mockPlayers = [
        { id: 'f1', name: 'Father 1' },
        { id: 'f2', name: 'Father 2' },
        { id: 's1', name: 'Son 1' },
        { id: 's2', name: 'Son 2' },
      ];
      // f1 has 1 son (s1) with 5 net_wins
      // f2 has 1 son (s2) with 3 net_wins
      const mockPaternities = [
        { father_id: 'f1', son_id: 's1', net_wins: 5 },
        { father_id: 'f2', son_id: 's2', net_wins: 3 }
      ];

      const builderPlayers = mockQueryBuilder({ data: mockPlayers, error: null });
      const builderPaternities = mockQueryBuilder({ data: mockPaternities, error: null });

      (createClient as any).mockResolvedValue({
        from: (table: string) => {
          if (table === 'user_profiles') return builderPlayers;
          if (table === 'paternities') return builderPaternities;
        },
      });

      const result = await getPaternities();
      
      // Both f1 and f2 have 1 son, so it should sort by total net wins (5 vs 3)
      expect(result.length).toBe(2);
      expect(result[0].father.id).toBe('f1'); // 5 net wins
      expect(result[1].father.id).toBe('f2'); // 3 net wins
    });
  });

  describe('getGoalkeeperStats', () => {
    it('debería retornar array vacío si no hay datos', async () => {
      const builder = mockQueryBuilder({ data: null, error: null });
      (createClient as any).mockResolvedValue({
        from: () => builder,
      });

      const result = await getGoalkeeperStats();
      expect(result).toEqual([]);
    });

    it('debería calcular correctamente partidos como arquero, goles recibidos, vallas invictas y promedio', async () => {
      const mockPlayers = [
        { id: 'gk1', first_name: 'Juan', nickname: 'Juani' },
        { id: 'gk2', first_name: 'Pedro', nickname: 'Pedrito' },
        { id: 'field1', first_name: 'Lucas' },
      ];

      const mockMatches = [
        { id: 'm1', status: 'played', score_team_a: 2, score_team_b: 0 }, // Team A received 0 (VI for gk1), Team B received 2
        { id: 'm2', status: 'played', score_team_a: 3, score_team_b: 3 }, // Team A received 3
      ];

      const mockMatchPlayers = [
        // Match 1: gk1 in Team A (received 0 goals -> 1 clean sheet), gk2 in Team B (received 2 goals -> 0 clean sheets)
        { player_id: 'gk1', match_id: 'm1', team: 'A', attended: true, pitch_position: 'gk' },
        { player_id: 'gk2', match_id: 'm1', team: 'B', attended: true, pitch_position: 'gk' },
        { player_id: 'field1', match_id: 'm1', team: 'A', attended: true, pitch_position: 'fwd' },
        // Match 2: gk1 in Team A (received 3 goals), gk2 did not play as gk
        { player_id: 'gk1', match_id: 'm2', team: 'A', attended: true, pitch_position: 'gk' },
        { player_id: 'gk2', match_id: 'm2', team: 'B', attended: true, pitch_position: 'def-c' },
      ];

      const builderPlayers = mockQueryBuilder({ data: mockPlayers, error: null });
      const builderMatches = mockQueryBuilder({ data: mockMatches, error: null });
      const builderMatchPlayers = mockQueryBuilder({ data: mockMatchPlayers, error: null });

      (createClient as any).mockResolvedValue({
        from: (table: string) => {
          if (table === 'user_profiles') return builderPlayers;
          if (table === 'matches') return builderMatches;
          if (table === 'match_players') return builderMatchPlayers;
        },
      });

      const result = await getGoalkeeperStats();

      // Only gk1 and gk2 should appear, field1 was never a goalkeeper
      expect(result.length).toBe(2);

      // gk1: 2 matches, received 0 + 3 = 3 goals -> avg 1.50, 1 clean sheet
      // gk2: 1 match, received 2 goals -> avg 2.00, 0 clean sheets
      expect(result[0].player.id).toBe('gk1');
      expect(result[0].matches_as_gk).toBe(2);
      expect(result[0].goals_conceded).toBe(3);
      expect(result[0].clean_sheets).toBe(1);
      expect(result[0].average_goals_conceded).toBe(1.5);

      expect(result[1].player.id).toBe('gk2');
      expect(result[1].matches_as_gk).toBe(1);
      expect(result[1].goals_conceded).toBe(2);
      expect(result[1].clean_sheets).toBe(0);
      expect(result[1].average_goals_conceded).toBe(2);
    });

    it('debería desempatar por vallas invictas (VI) ante igual promedio y luego por partidos jugados (PJ)', async () => {
      const mockPlayers = [
        { id: 'gk1', first_name: 'Gk1' },
        { id: 'gk2', first_name: 'Gk2' },
        { id: 'gk3', first_name: 'Gk3' },
      ];

      // 4 matches
      const mockMatches = [
        { id: 'm1', status: 'played', score_team_a: 0, score_team_b: 0 },
        { id: 'm2', status: 'played', score_team_a: 2, score_team_b: 0 },
        { id: 'm3', status: 'played', score_team_a: 1, score_team_b: 1 },
        { id: 'm4', status: 'played', score_team_a: 1, score_team_b: 1 },
      ];

      // gk1: 2 matches, conceded 2 (avg 1.00), 1 clean sheet (m1: 0 conceded, m2: 2 conceded)
      // gk2: 2 matches, conceded 2 (avg 1.00), 0 clean sheets (m3: 1 conceded, m4: 1 conceded)
      // gk3: 1 match, conceded 1 (avg 1.00), 0 clean sheets (m3: 1 conceded)
      const mockMatchPlayers = [
        { player_id: 'gk1', match_id: 'm1', team: 'A', attended: true, pitch_position: 'gk' }, // 0 conceded
        { player_id: 'gk1', match_id: 'm2', team: 'B', attended: true, pitch_position: 'gk' }, // 2 conceded
        { player_id: 'gk2', match_id: 'm3', team: 'A', attended: true, pitch_position: 'gk' }, // 1 conceded
        { player_id: 'gk2', match_id: 'm4', team: 'A', attended: true, pitch_position: 'gk' }, // 1 conceded
        { player_id: 'gk3', match_id: 'm3', team: 'B', attended: true, pitch_position: 'gk' }, // 1 conceded
      ];

      const builderPlayers = mockQueryBuilder({ data: mockPlayers, error: null });
      const builderMatches = mockQueryBuilder({ data: mockMatches, error: null });
      const builderMatchPlayers = mockQueryBuilder({ data: mockMatchPlayers, error: null });

      (createClient as any).mockResolvedValue({
        from: (table: string) => {
          if (table === 'user_profiles') return builderPlayers;
          if (table === 'matches') return builderMatches;
          if (table === 'match_players') return builderMatchPlayers;
        },
      });

      const result = await getGoalkeeperStats();

      // All 3 have average 1.00
      // 1st place: gk1 (1 clean sheet vs 0)
      // 2nd place: gk2 (0 clean sheets, 2 PJ vs 1 PJ)
      // 3rd place: gk3 (0 clean sheets, 1 PJ)
      expect(result[0].player.id).toBe('gk1');
      expect(result[0].clean_sheets).toBe(1);

      expect(result[1].player.id).toBe('gk2');
      expect(result[1].clean_sheets).toBe(0);
      expect(result[1].matches_as_gk).toBe(2);

      expect(result[2].player.id).toBe('gk3');
      expect(result[2].clean_sheets).toBe(0);
      expect(result[2].matches_as_gk).toBe(1);
    });

    it('debería priorizar a los arqueros elegibles (mínimo de partidos cumplido) antes que a los no elegibles', async () => {
      const mockPlayers = [
        { id: 'gk_guest', first_name: 'Guest GK' },
        { id: 'gk_regular', first_name: 'Regular GK' },
      ];

      // 10 matches -> min required is Math.max(3, Math.ceil(10 * 0.3)) = 3
      const mockMatches = Array.from({ length: 10 }, (_, i) => ({
        id: `m${i + 1}`,
        status: 'played',
        score_team_a: 1,
        score_team_b: 0,
      }));

      // gk_guest played 1 match and conceded 0 (avg 0.00, clean_sheets 1, but ineligible because 1 < 3)
      // gk_regular played 4 matches and conceded 4 (avg 1.00, eligible because 4 >= 3)
      const mockMatchPlayers = [
        { player_id: 'gk_guest', match_id: 'm1', team: 'A', attended: true, pitch_position: 'gk' },
        { player_id: 'gk_regular', match_id: 'm2', team: 'B', attended: true, pitch_position: 'gk' },
        { player_id: 'gk_regular', match_id: 'm3', team: 'B', attended: true, pitch_position: 'gk' },
        { player_id: 'gk_regular', match_id: 'm4', team: 'B', attended: true, pitch_position: 'gk' },
        { player_id: 'gk_regular', match_id: 'm5', team: 'B', attended: true, pitch_position: 'gk' },
      ];

      const builderPlayers = mockQueryBuilder({ data: mockPlayers, error: null });
      const builderMatches = mockQueryBuilder({ data: mockMatches, error: null });
      const builderMatchPlayers = mockQueryBuilder({ data: mockMatchPlayers, error: null });

      (createClient as any).mockResolvedValue({
        from: (table: string) => {
          if (table === 'user_profiles') return builderPlayers;
          if (table === 'matches') return builderMatches;
          if (table === 'match_players') return builderMatchPlayers;
        },
      });

      const result = await getGoalkeeperStats();

      // gk_regular is eligible, so appears first in official ranking despite having higher avg
      expect(result[0].player.id).toBe('gk_regular');
      expect(result[0].is_eligible).toBe(true);

      // gk_guest is not eligible
      expect(result[1].player.id).toBe('gk_guest');
      expect(result[1].is_eligible).toBe(false);
    });
  });
});

