import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getPlayers, getPlayer, updatePlayer, addPlayer } from './players';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}));

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

const mockCreateClient = vi.mocked(createClient);

function mockQueryBuilder(resolvedValue: { data: unknown; error: unknown }) {
  const builder: Record<string, any> = {};
  const chainMethods = ['select', 'insert', 'update', 'delete', 'eq', 'order'];
  chainMethods.forEach(m => { builder[m] = vi.fn().mockReturnValue(builder); });
  builder.single = vi.fn().mockResolvedValue(resolvedValue);
  
  const p = Promise.resolve(resolvedValue);
  builder.then = p.then.bind(p);
  builder.catch = p.catch.bind(p);
  return builder;
}

describe('Players Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getPlayers', () => {
    it('debería retornar lista de jugadores', async () => {
      const builder = mockQueryBuilder({ data: [{ id: '1' }], error: null });
      mockCreateClient.mockResolvedValue({ from: vi.fn().mockReturnValue(builder) } as any);
      
      const result = await getPlayers();
      expect(result).toEqual([{ id: '1' }]);
    });

    it('debería retornar array vacío en error', async () => {
      const builder = mockQueryBuilder({ data: null, error: { message: 'error' } });
      mockCreateClient.mockResolvedValue({ from: vi.fn().mockReturnValue(builder) } as any);
      
      const result = await getPlayers();
      expect(result).toEqual([]);
    });
  });

  describe('getPlayer', () => {
    it('debería retornar un jugador por ID', async () => {
      const builder = mockQueryBuilder({ data: { id: '1' }, error: null });
      mockCreateClient.mockResolvedValue({ from: vi.fn().mockReturnValue(builder) } as any);
      
      const result = await getPlayer('1');
      expect(result).toEqual({ id: '1' });
    });

    it('debería retornar null en error', async () => {
      const builder = mockQueryBuilder({ data: null, error: { message: 'error' } });
      mockCreateClient.mockResolvedValue({ from: vi.fn().mockReturnValue(builder) } as any);
      
      const result = await getPlayer('1');
      expect(result).toBeNull();
    });
  });

  describe('updatePlayer', () => {
    it('debería actualizar jugador exitosamente', async () => {
      const builder = mockQueryBuilder({ data: {}, error: null });
      mockCreateClient.mockResolvedValue({ from: vi.fn().mockReturnValue(builder) } as any);

      const formData = new FormData();
      formData.append('id', '1');
      formData.append('first_name', 'Juan');
      formData.append('last_name', 'Perez');
      formData.append('nickname', 'El Juan');
      formData.append('preferred_foot', 'Derecha');
      formData.append('position', 'Delantero');

      const result = await updatePlayer(formData);
      expect(result).toEqual({ success: true });
      expect(revalidatePath).toHaveBeenCalledWith('/players');
      expect(revalidatePath).toHaveBeenCalledWith('/players/1');
    });

    it('debería retornar error en fallo de actualización', async () => {
      const builder = mockQueryBuilder({ data: null, error: { message: 'Update error' } });
      mockCreateClient.mockResolvedValue({ from: vi.fn().mockReturnValue(builder) } as any);

      const formData = new FormData();
      formData.append('id', '1');
      const result = await updatePlayer(formData);
      expect(result).toEqual({ error: 'Update error' });
    });
  });

  describe('addPlayer', () => {
    it('debería crear jugador exitosamente', async () => {
      const builder = mockQueryBuilder({ data: {}, error: null });
      mockCreateClient.mockResolvedValue({ from: vi.fn().mockReturnValue(builder) } as any);

      const formData = new FormData();
      formData.append('first_name', 'Juan');
      formData.append('last_name', 'Perez');
      
      const result = await addPlayer(formData);
      expect(result).toEqual({ success: true });
      expect(revalidatePath).toHaveBeenCalledWith('/players');
    });

    it('debería retornar error en fallo de creación', async () => {
      const builder = mockQueryBuilder({ data: null, error: { message: 'Insert error' } });
      mockCreateClient.mockResolvedValue({ from: vi.fn().mockReturnValue(builder) } as any);

      const formData = new FormData();
      const result = await addPlayer(formData);
      expect(result).toEqual({ error: 'Insert error' });
    });
  });
});
