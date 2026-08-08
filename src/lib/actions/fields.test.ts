import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getFields, createField, updateField, deleteField } from './fields';
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

  describe('createField', () => {
    it('debería crear cancha exitosamente', async () => {
      const builder = mockQueryBuilder({ data: {}, error: null });
      mockCreateClient.mockResolvedValue({
        auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'u1' } } }) },
        from: vi.fn().mockReturnValue(builder)
      } as any);

      const formData = new FormData();
      formData.append('name', 'Cancha 1');

      const result = await createField(formData);
      expect(result).toEqual({ success: true });
      expect(revalidatePath).toHaveBeenCalledWith('/fields');
    });

    it('debería retornar error sin autenticación', async () => {
      mockCreateClient.mockResolvedValue({
        auth: { getUser: vi.fn().mockResolvedValue({ data: { user: null } }) },
      } as any);

      const formData = new FormData();
      const result = await createField(formData);
      expect(result).toEqual({ error: 'No autorizado' });
    });

    it('debería retornar error en fallo de inserción', async () => {
      const builder = mockQueryBuilder({ data: null, error: { message: 'Insert error' } });
      mockCreateClient.mockResolvedValue({
        auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'u1' } } }) },
        from: vi.fn().mockReturnValue(builder)
      } as any);

      const formData = new FormData();
      const result = await createField(formData);
      expect(result).toEqual({ error: 'Insert error' });
    });
  });

  describe('updateField', () => {
    it('debería actualizar cancha', async () => {
      const builder = mockQueryBuilder({ data: {}, error: null });
      mockCreateClient.mockResolvedValue({ from: vi.fn().mockReturnValue(builder) } as any);

      const formData = new FormData();
      formData.append('id', '1');
      const result = await updateField(formData);
      expect(result).toEqual({ success: true });
    });

    it('debería retornar error en fallo de actualización', async () => {
      const builder = mockQueryBuilder({ data: null, error: { message: 'Update error' } });
      mockCreateClient.mockResolvedValue({ from: vi.fn().mockReturnValue(builder) } as any);

      const formData = new FormData();
      const result = await updateField(formData);
      expect(result).toEqual({ error: 'Update error' });
    });
  });

  describe('deleteField', () => {
    it('debería eliminar (soft delete) cancha', async () => {
      const builder = mockQueryBuilder({ data: {}, error: null });
      mockCreateClient.mockResolvedValue({ from: vi.fn().mockReturnValue(builder) } as any);

      const result = await deleteField('1');
      expect(result).toEqual({ success: true });
    });

    it('debería retornar error en fallo de eliminación', async () => {
      const builder = mockQueryBuilder({ data: null, error: { message: 'Delete error' } });
      mockCreateClient.mockResolvedValue({ from: vi.fn().mockReturnValue(builder) } as any);

      const result = await deleteField('1');
      expect(result).toEqual({ error: 'Delete error' });
    });
  });
});
