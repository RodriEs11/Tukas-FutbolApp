import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getFields } from './fields';
import { createClient } from '@/lib/supabase/server';

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}));

const mockCreateClient = vi.mocked(createClient);

function mockQueryBuilder(resolvedValue: { data: unknown; error: unknown }) {
  const builder: Record<string, any> = {};
  const chainMethods = ['select', 'insert', 'update', 'delete', 'eq', 'order'];
  chainMethods.forEach(m => { builder[m] = vi.fn().mockReturnValue(builder); });
  // Make builder thenable
  const p = Promise.resolve(resolvedValue);
  builder.then = p.then.bind(p);
  builder.catch = p.catch.bind(p);
  return builder;
}

describe('Fields Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getFields', () => {
    it('debería retornar lista de canchas', async () => {
      const builder = mockQueryBuilder({ data: [{ id: '1' }], error: null });
      mockCreateClient.mockResolvedValue({ from: vi.fn().mockReturnValue(builder) } as any);
      
      const result = await getFields();
      expect(result).toEqual([{ id: '1' }]);
    });

    it('debería retornar array vacío en error', async () => {
      const builder = mockQueryBuilder({ data: null, error: { message: 'error' } });
      mockCreateClient.mockResolvedValue({ from: vi.fn().mockReturnValue(builder) } as any);
      
      const result = await getFields();
      expect(result).toEqual([]);
    });
  });
});

