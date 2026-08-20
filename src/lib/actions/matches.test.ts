import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  getMatches,
  getPlayerMatches,
  getMatch,
  createMatch,
  updateMatch,
  deleteMatch,
  addPlayerToMatch,
  addPlayersToMatch,
  updateMatchPlayer,
  removePlayerFromMatch,
  finishMatch,
  setTeamGoalkeeper,
} from './matches';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}));

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

function mockQueryBuilder(resolvedValue: { data: unknown; error: unknown }) {
  const builder: Record<string, any> = {};
  const chainMethods = ['select', 'insert', 'update', 'delete', 'eq', 'order', 'in', 'filter', 'limit', 'single', 'maybeSingle'];
  chainMethods.forEach(m => { builder[m] = vi.fn().mockReturnValue(builder); });
  builder.single = vi.fn().mockResolvedValue(resolvedValue);
  const p = Promise.resolve(resolvedValue);
  builder.then = p.then.bind(p);
  builder.catch = p.catch.bind(p);
  return builder;
}

describe('matches actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getMatches', () => {
    it('debería retornar la lista de partidos', async () => {
      const mockMatches = [{ id: '1', match_date: '2026-01-01' }];
      const builder = mockQueryBuilder({ data: mockMatches, error: null });
      (createClient as any).mockResolvedValue({
        from: vi.fn().mockReturnValue(builder),
      });

      const result = await getMatches();
      expect(result).toEqual(mockMatches);
    });

    it('debería retornar un array vacío si hay un error', async () => {
      const builder = mockQueryBuilder({ data: null, error: new Error('test') });
      (createClient as any).mockResolvedValue({
        from: vi.fn().mockReturnValue(builder),
      });
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const result = await getMatches();
      expect(result).toEqual([]);
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe('getPlayerMatches', () => {
    it('debería retornar los partidos de un jugador', async () => {
      const mockMatches = [{ id: '1', match_date: '2026-01-01' }];
      const mockPlayerMatches = [{ match_id: '1' }];
      
      const builderMatches = mockQueryBuilder({ data: mockMatches, error: null });
      const builderPlayerMatches = mockQueryBuilder({ data: mockPlayerMatches, error: null });
      
      (createClient as any).mockResolvedValue({
        from: (table: string) => table === 'match_players' ? builderPlayerMatches : builderMatches,
      });

      const result = await getPlayerMatches('player1');
      expect(result).toEqual(mockMatches);
    });

    it('debería retornar un array vacío si hay un error al obtener player matches', async () => {
      const builderPlayerMatches = mockQueryBuilder({ data: null, error: new Error('test') });
      (createClient as any).mockResolvedValue({
        from: vi.fn().mockReturnValue(builderPlayerMatches),
      });
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const result = await getPlayerMatches('player1');
      expect(result).toEqual([]);
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    it('debería retornar array vacío si el jugador no tiene partidos', async () => {
      const builderPlayerMatches = mockQueryBuilder({ data: [], error: null });
      (createClient as any).mockResolvedValue({
        from: vi.fn().mockReturnValue(builderPlayerMatches),
      });

      const result = await getPlayerMatches('player1');
      expect(result).toEqual([]);
    });

    it('debería retornar un array vacío si hay un error al obtener los detalles de los partidos', async () => {
      const mockPlayerMatches = [{ match_id: '1' }];
      const builderPlayerMatches = mockQueryBuilder({ data: mockPlayerMatches, error: null });
      const builderMatches = mockQueryBuilder({ data: null, error: new Error('test') });
      
      (createClient as any).mockResolvedValue({
        from: (table: string) => table === 'match_players' ? builderPlayerMatches : builderMatches,
      });
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const result = await getPlayerMatches('player1');
      expect(result).toEqual([]);
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe('getMatch', () => {
    it('debería retornar el partido si existe', async () => {
      const mockMatch = { id: '1', match_date: '2026-01-01' };
      const builder = mockQueryBuilder({ data: mockMatch, error: null });
      (createClient as any).mockResolvedValue({
        from: vi.fn().mockReturnValue(builder),
      });

      const result = await getMatch('1');
      expect(result).toEqual(mockMatch);
    });

    it('debería retornar null si hay un error', async () => {
      const builder = mockQueryBuilder({ data: null, error: new Error('test') });
      (createClient as any).mockResolvedValue({
        from: vi.fn().mockReturnValue(builder),
      });
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const result = await getMatch('1');
      expect(result).toBeNull();
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe('createMatch', () => {
    it('debería retornar error si no hay usuario autenticado', async () => {
      (createClient as any).mockResolvedValue({
        auth: { getUser: vi.fn().mockResolvedValue({ data: { user: null } }) },
      });

      const formData = new FormData();
      const result = await createMatch(formData);
      expect(result).toEqual({ error: 'No autorizado' });
    });

    it('debería crear el partido con éxito', async () => {
      const mockUser = { id: 'user1' };
      const mockField = { id: 'field1' };
      const mockMatchData = { id: '1', match_date: '2026-01-01' };

      const builderField = mockQueryBuilder({ data: mockField, error: null });
      const builderMatch = mockQueryBuilder({ data: mockMatchData, error: null });

      (createClient as any).mockResolvedValue({
        auth: { getUser: vi.fn().mockResolvedValue({ data: { user: mockUser } }) },
        from: (table: string) => table === 'fields' ? builderField : builderMatch,
      });

      const formData = new FormData();
      formData.append('match_date', '2026-01-01');
      formData.append('notes', 'test match');

      const result = await createMatch(formData);
      expect(result).toEqual({ success: true, data: mockMatchData });
      expect(revalidatePath).toHaveBeenCalledWith('/matches');
    });

    it('debería retornar error si falla al crear el partido', async () => {
      const mockUser = { id: 'user1' };
      const builderField = mockQueryBuilder({ data: null, error: null });
      const builderMatch = mockQueryBuilder({ data: null, error: new Error('insert error') });

      (createClient as any).mockResolvedValue({
        auth: { getUser: vi.fn().mockResolvedValue({ data: { user: mockUser } }) },
        from: (table: string) => table === 'fields' ? builderField : builderMatch,
      });

      const formData = new FormData();
      const result = await createMatch(formData);
      expect(result).toEqual({ error: 'insert error' });
    });
  });

  describe('updateMatch', () => {
    it('debería actualizar el partido con éxito', async () => {
      const builder = mockQueryBuilder({ data: null, error: null });
      (createClient as any).mockResolvedValue({
        from: vi.fn().mockReturnValue(builder),
      });

      const formData = new FormData();
      formData.append('id', '1');
      formData.append('status', 'played');
      formData.append('score_team_a', '2');
      formData.append('score_team_b', '1');
      formData.append('notes', 'notes');

      const result = await updateMatch(formData);
      expect(result).toEqual({ success: true });
      expect(revalidatePath).toHaveBeenCalledWith('/matches');
    });

    it('debería retornar error si falla la actualización', async () => {
      const builder = mockQueryBuilder({ data: null, error: new Error('update error') });
      (createClient as any).mockResolvedValue({
        from: vi.fn().mockReturnValue(builder),
      });

      const formData = new FormData();
      const result = await updateMatch(formData);
      expect(result).toEqual({ error: 'update error' });
    });
  });

  describe('deleteMatch', () => {
    it('debería eliminar el partido', async () => {
      const builder = mockQueryBuilder({ data: null, error: null });
      (createClient as any).mockResolvedValue({
        from: vi.fn().mockReturnValue(builder),
      });

      const result = await deleteMatch('1');
      expect(result).toEqual({ success: true });
      expect(revalidatePath).toHaveBeenCalledWith('/matches');
    });

    it('debería retornar error si falla la eliminación', async () => {
      const builder = mockQueryBuilder({ data: null, error: new Error('delete error') });
      (createClient as any).mockResolvedValue({
        from: vi.fn().mockReturnValue(builder),
      });

      const result = await deleteMatch('1');
      expect(result).toEqual({ error: 'delete error' });
    });
  });

  describe('addPlayerToMatch', () => {
    it('debería agregar un jugador al partido', async () => {
      const builderExisting = mockQueryBuilder({ data: [], error: null });
      const builderTeamPositions = mockQueryBuilder({ data: [], error: null });
      const builderProfiles = mockQueryBuilder({ data: [{ id: 'player1', position: 'Delantero', preferred_foot: 'Derecha' }], error: null });
      const builderInsert = mockQueryBuilder({ data: null, error: null });

      let fromCall = 0;
      (createClient as any).mockResolvedValue({
        from: vi.fn().mockImplementation((table: string) => {
          fromCall++;
          if (table === 'user_profiles') return builderProfiles;
          if (fromCall === 1) return builderExisting;
          if (fromCall === 2) return builderTeamPositions;
          return builderInsert;
        }),
      });

      const result = await addPlayerToMatch('1', 'player1', 'A');
      expect(result).toEqual({ success: true });
      expect(revalidatePath).toHaveBeenCalledWith('/matches/1');
    });

    it('debería retornar error si falla al agregar jugador', async () => {
      const builderExisting = mockQueryBuilder({ data: [{ player_id: 'player1' }], error: null });
      (createClient as any).mockResolvedValue({
        from: vi.fn().mockReturnValue(builderExisting),
      });

      const result = await addPlayerToMatch('1', 'player1', 'A');
      expect(result).toEqual({ error: 'Todos los jugadores seleccionados ya están en un equipo.' });
    });
  });

  describe('addPlayersToMatch', () => {
    it('debería agregar varios jugadores con asignación de posición', async () => {
      const builderExisting = mockQueryBuilder({ data: [{ player_id: 'player1' }], error: null });
      const builderTeamPositions = mockQueryBuilder({ data: [{ pitch_position: 'gk' }], error: null });
      const builderProfiles = mockQueryBuilder({
        data: [{ id: 'player2', position: 'Defensa', preferred_foot: 'Izquierda' }],
        error: null,
      });
      const builderInsert = mockQueryBuilder({ data: null, error: null });
      
      let fromCall = 0;
      (createClient as any).mockResolvedValue({
        from: vi.fn().mockImplementation((table: string) => {
          fromCall++;
          if (table === 'user_profiles') return builderProfiles;
          if (fromCall === 1) return builderExisting;
          if (fromCall === 2) return builderTeamPositions;
          return builderInsert;
        }),
      });

      const result = await addPlayersToMatch('1', ['player1', 'player2'], 'A');
      expect(result).toEqual({ success: true, addedCount: 1, duplicatesCount: 1 });
      expect(revalidatePath).toHaveBeenCalledWith('/matches/1');
      expect(builderInsert.insert).toHaveBeenCalledWith([
        expect.objectContaining({
          player_id: 'player2',
          team: 'A',
          pitch_position: 'def-l',
        }),
      ]);
    });

    it('debería retornar error si todos los jugadores ya están', async () => {
      const builderExisting = mockQueryBuilder({ data: [{ player_id: 'player1' }], error: null });
      (createClient as any).mockResolvedValue({
        from: vi.fn().mockReturnValue(builderExisting),
      });

      const result = await addPlayersToMatch('1', ['player1'], 'A');
      expect(result).toEqual({ error: 'Todos los jugadores seleccionados ya están en un equipo.' });
    });

    it('debería retornar error si falla la inserción', async () => {
      const builderExisting = mockQueryBuilder({ data: [], error: null });
      const builderTeamPositions = mockQueryBuilder({ data: [], error: null });
      const builderProfiles = mockQueryBuilder({ data: [], error: null });
      const builderInsert = mockQueryBuilder({ data: null, error: new Error('insert error') });
      
      let fromCall = 0;
      (createClient as any).mockResolvedValue({
        from: vi.fn().mockImplementation((table: string) => {
          fromCall++;
          if (table === 'user_profiles') return builderProfiles;
          if (fromCall === 1) return builderExisting;
          if (fromCall === 2) return builderTeamPositions;
          return builderInsert;
        }),
      });

      const result = await addPlayersToMatch('1', ['player1'], 'A');
      expect(result).toEqual({ error: 'insert error' });
    });
  });

  describe('updateMatchPlayer', () => {
    it('debería actualizar jugador del partido', async () => {
      const builder = mockQueryBuilder({ data: null, error: null });
      (createClient as any).mockResolvedValue({
        from: vi.fn().mockReturnValue(builder),
      });

      const formData = new FormData();
      formData.append('id', '1');
      formData.append('goals', '2');
      formData.append('attended', 'true');

      const result = await updateMatchPlayer(formData);
      expect(result).toEqual({ success: true });
      expect(revalidatePath).toHaveBeenCalledWith('/matches');
    });

    it('debería retornar error si falla actualizar jugador', async () => {
      const builder = mockQueryBuilder({ data: null, error: new Error('update error') });
      (createClient as any).mockResolvedValue({
        from: vi.fn().mockReturnValue(builder),
      });

      const formData = new FormData();
      const result = await updateMatchPlayer(formData);
      expect(result).toEqual({ error: 'update error' });
    });
  });

  describe('removePlayerFromMatch', () => {
    it('debería eliminar jugador del partido', async () => {
      const builder = mockQueryBuilder({ data: null, error: null });
      (createClient as any).mockResolvedValue({
        from: vi.fn().mockReturnValue(builder),
      });

      const result = await removePlayerFromMatch('1', 'player1');
      expect(result).toEqual({ success: true });
      expect(revalidatePath).toHaveBeenCalledWith('/matches/1');
    });

    it('debería retornar error si falla eliminar', async () => {
      const builder = mockQueryBuilder({ data: null, error: new Error('remove error') });
      (createClient as any).mockResolvedValue({
        from: vi.fn().mockReturnValue(builder),
      });

      const result = await removePlayerFromMatch('1', 'player1');
      expect(result).toEqual({ error: 'remove error' });
    });
  });

  describe('finishMatch', () => {
    it('debería finalizar el partido calculando el score', async () => {
      const mockPlayers = [
        { team: 'A', goals: 2 },
        { team: 'A', goals: null }, // To trigger fallback
        { team: 'B', goals: 1 },
      ];
      const builderFetch = mockQueryBuilder({ data: mockPlayers, error: null });
      const builderUpdate = mockQueryBuilder({ data: null, error: null });
      
      let fromCall = 0;
      (createClient as any).mockResolvedValue({
        from: vi.fn().mockImplementation(() => {
          fromCall++;
          return fromCall === 1 ? builderFetch : builderUpdate;
        }),
      });

      const result = await finishMatch('1');
      expect(result).toEqual({ success: true });
      expect(revalidatePath).toHaveBeenCalledWith('/matches');
      expect(revalidatePath).toHaveBeenCalledWith('/matches/1');
      expect(revalidatePath).toHaveBeenCalledWith('/dashboard');
      expect(revalidatePath).toHaveBeenCalledWith('/players');
    });

    it('debería retornar error si falla al obtener jugadores', async () => {
      const builderFetch = mockQueryBuilder({ data: null, error: new Error('fetch error') });
      (createClient as any).mockResolvedValue({
        from: vi.fn().mockReturnValue(builderFetch),
      });

      const result = await finishMatch('1');
      expect(result).toEqual({ error: 'fetch error' });
    });

    it('debería retornar error si falla al actualizar partido', async () => {
      const builderFetch = mockQueryBuilder({ data: [], error: null });
      const builderUpdate = mockQueryBuilder({ data: null, error: new Error('update error') });
      
      let fromCall = 0;
      (createClient as any).mockResolvedValue({
        from: vi.fn().mockImplementation(() => {
          fromCall++;
          return fromCall === 1 ? builderFetch : builderUpdate;
        }),
      });

      const result = await finishMatch('1');
      expect(result).toEqual({ error: 'update error' });
    });
  });

  describe('setTeamGoalkeeper', () => {
    it('debería asignar el arquero a un jugador y removerlo del anterior', async () => {
      const mockTeamPlayers = [
        { id: 'mp1', player_id: 'p1', pitch_position: 'gk' },
        { id: 'mp2', player_id: 'p2', pitch_position: 'def-c' },
      ];

      const builderFetch = mockQueryBuilder({ data: mockTeamPlayers, error: null });
      const builderUpdate = mockQueryBuilder({ data: null, error: null });

      let fromCall = 0;
      (createClient as any).mockResolvedValue({
        from: vi.fn().mockImplementation(() => {
          fromCall++;
          return fromCall === 1 ? builderFetch : builderUpdate;
        }),
      });

      const result = await setTeamGoalkeeper('match1', 'A', 'p2');
      expect(result).toEqual({ success: true });
      expect(revalidatePath).toHaveBeenCalledWith('/matches');
      expect(revalidatePath).toHaveBeenCalledWith('/matches/match1');
      expect(revalidatePath).toHaveBeenCalledWith('/valla-menos-vencida');
    });

    it('debería retornar error si falla al obtener jugadores del equipo', async () => {
      const builderFetch = mockQueryBuilder({ data: null, error: new Error('fetch error') });
      (createClient as any).mockResolvedValue({
        from: vi.fn().mockReturnValue(builderFetch),
      });

      const result = await setTeamGoalkeeper('match1', 'A', 'p1');
      expect(result).toEqual({ error: 'fetch error' });
    });
  });
});

