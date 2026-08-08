import { describe, it, expect, vi, beforeEach } from 'vitest';
import { updateProfileBasicInfo, updateEmail, updatePassword, uploadAvatar } from './profile';
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

describe('Profile Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('updateProfileBasicInfo', () => {
    it('debería actualizar perfil exitosamente', async () => {
      const builder = mockQueryBuilder({ data: {}, error: null });
      const mockUpdateUser = vi.fn().mockResolvedValue({});
      mockCreateClient.mockResolvedValue({
        auth: { 
          getUser: vi.fn().mockResolvedValue({ data: { user: { id: '1' } } }),
          updateUser: mockUpdateUser
        },
        from: vi.fn().mockReturnValue(builder)
      } as any);

      const formData = new FormData();
      formData.append('first_name', 'Juan');
      
      const result = await updateProfileBasicInfo(formData);
      expect(result).toEqual({ success: true });
      expect(revalidatePath).toHaveBeenCalledWith('/', 'layout');
    });

    it('debería fallar sin autorización', async () => {
      mockCreateClient.mockResolvedValue({
        auth: { getUser: vi.fn().mockResolvedValue({ data: { user: null } }) },
      } as any);

      const formData = new FormData();
      const result = await updateProfileBasicInfo(formData);
      expect(result).toEqual({ error: 'No autorizado' });
    });

    it('debería fallar si falla update db', async () => {
      const builder = mockQueryBuilder({ data: null, error: { message: 'db error' } });
      mockCreateClient.mockResolvedValue({
        auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: '1' } } }) },
        from: vi.fn().mockReturnValue(builder)
      } as any);

      const formData = new FormData();
      const result = await updateProfileBasicInfo(formData);
      expect(result).toEqual({ error: 'db error' });
    });
  });

  describe('updateEmail', () => {
    it('debería actualizar email', async () => {
      mockCreateClient.mockResolvedValue({
        auth: { updateUser: vi.fn().mockResolvedValue({ error: null }) },
      } as any);
      const formData = new FormData();
      formData.append('email', 'test@test.com');
      const result = await updateEmail(formData);
      expect(result).toEqual({ success: true, message: 'Revisa tu correo para confirmar el cambio.' });
    });

    it('debería fallar sin email', async () => {
      const result = await updateEmail(new FormData());
      expect(result).toEqual({ error: 'El email es requerido' });
    });

    it('debería fallar si updateUser falla', async () => {
      mockCreateClient.mockResolvedValue({
        auth: { updateUser: vi.fn().mockResolvedValue({ error: { message: 'email error' } }) },
      } as any);
      const formData = new FormData();
      formData.append('email', 'test@test.com');
      const result = await updateEmail(formData);
      expect(result).toEqual({ error: 'email error' });
    });
  });

  describe('updatePassword', () => {
    it('debería actualizar password', async () => {
      mockCreateClient.mockResolvedValue({
        auth: { 
          getUser: vi.fn().mockResolvedValue({ data: { user: { email: 'a@a.com' } } }),
          signInWithPassword: vi.fn().mockResolvedValue({ error: null }),
          updateUser: vi.fn().mockResolvedValue({ error: null })
        },
      } as any);
      const formData = new FormData();
      formData.append('current_password', '123');
      formData.append('new_password', '456');
      const result = await updatePassword(formData);
      expect(result).toEqual({ success: true });
    });

    it('debería fallar si faltan datos', async () => {
      const result = await updatePassword(new FormData());
      expect(result).toEqual({ error: 'Faltan datos' });
    });

    it('debería fallar si sign in falla', async () => {
      mockCreateClient.mockResolvedValue({
        auth: { 
          getUser: vi.fn().mockResolvedValue({ data: { user: { email: 'a@a.com' } } }),
          signInWithPassword: vi.fn().mockResolvedValue({ error: { message: 'bad' } }),
        },
      } as any);
      const formData = new FormData();
      formData.append('current_password', '123');
      formData.append('new_password', '456');
      const result = await updatePassword(formData);
      expect(result).toEqual({ error: 'La contraseña actual es incorrecta' });
    });

    it('debería fallar si falla updateUser', async () => {
      mockCreateClient.mockResolvedValue({
        auth: { 
          getUser: vi.fn().mockResolvedValue({ data: { user: { email: 'a@a.com' } } }),
          signInWithPassword: vi.fn().mockResolvedValue({ error: null }),
          updateUser: vi.fn().mockResolvedValue({ error: { message: 'update err' } })
        },
      } as any);
      const formData = new FormData();
      formData.append('current_password', '123');
      formData.append('new_password', '456');
      const result = await updatePassword(formData);
      expect(result).toEqual({ error: 'update err' });
    });

    it('debería fallar sin email autorizado', async () => {
      mockCreateClient.mockResolvedValue({
        auth: { getUser: vi.fn().mockResolvedValue({ data: { user: null } }) }
      } as any);
      const formData = new FormData();
      formData.append('current_password', '123');
      formData.append('new_password', '456');
      const result = await updatePassword(formData);
      expect(result).toEqual({ error: 'No autorizado' });
    });
  });

  describe('uploadAvatar', () => {
    it('debería fallar sin autenticación', async () => {
      mockCreateClient.mockResolvedValue({
        auth: { getUser: vi.fn().mockResolvedValue({ data: { user: null } }) }
      } as any);
      const result = await uploadAvatar(new FormData());
      expect(result).toEqual({ error: 'No autorizado' });
    });

    it('debería fallar con archivo inválido', async () => {
      mockCreateClient.mockResolvedValue({
        auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: '1' } } }) }
      } as any);
      const result = await uploadAvatar(new FormData());
      expect(result).toEqual({ error: 'Archivo no válido' });
    });

    it('debería subir archivo exitosamente', async () => {
      const mockUpload = vi.fn().mockResolvedValue({ error: null });
      const mockGetPublicUrl = vi.fn().mockReturnValue({ data: { publicUrl: 'url' } });
      const builder = mockQueryBuilder({ data: {}, error: null });
      
      mockCreateClient.mockResolvedValue({
        auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: '1' } } }) },
        storage: { from: vi.fn().mockReturnValue({ upload: mockUpload, getPublicUrl: mockGetPublicUrl }) },
        from: vi.fn().mockReturnValue(builder)
      } as any);

      const formData = new FormData();
      formData.append('avatar', new File(['file content'], 'test.png', { type: 'image/png' }));
      const result = await uploadAvatar(formData);
      expect(result).toEqual({ success: true, avatar_url: 'url' });
      expect(revalidatePath).toHaveBeenCalledWith('/', 'layout');
    });

    it('debería fallar si la carga falla', async () => {
      const mockUpload = vi.fn().mockResolvedValue({ error: { message: 'upload err' } });
      
      mockCreateClient.mockResolvedValue({
        auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: '1' } } }) },
        storage: { from: vi.fn().mockReturnValue({ upload: mockUpload }) },
      } as any);

      const formData = new FormData();
      formData.append('avatar', new File(['file content'], 'test.png'));
      const result = await uploadAvatar(formData);
      expect(result).toEqual({ error: 'upload err' });
    });

    it('debería fallar si db update falla', async () => {
      const mockUpload = vi.fn().mockResolvedValue({ error: null });
      const mockGetPublicUrl = vi.fn().mockReturnValue({ data: { publicUrl: 'url' } });
      const builder = mockQueryBuilder({ data: null, error: { message: 'db err' } });
      
      mockCreateClient.mockResolvedValue({
        auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: '1' } } }) },
        storage: { from: vi.fn().mockReturnValue({ upload: mockUpload, getPublicUrl: mockGetPublicUrl }) },
        from: vi.fn().mockReturnValue(builder)
      } as any);

      const formData = new FormData();
      formData.append('avatar', new File(['file content'], 'test.png'));
      const result = await uploadAvatar(formData);
      expect(result).toEqual({ error: 'db err' });
    });
  });
});
