import { describe, it, expect, vi, beforeEach } from 'vitest';
import { login, logout, getCurrentUser } from './auth';
import { createClient } from '@/lib/supabase/server';

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}));

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  redirect: vi.fn().mockImplementation((url: string) => {
    throw new Error(`NEXT_REDIRECT:${url}`);
  }),
}));

const mockCreateClient = vi.mocked(createClient);

describe('Auth Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('login', () => {
    it('debería redirigir tras un login exitoso', async () => {
      const mockSignIn = vi.fn().mockResolvedValue({ error: null });
      mockCreateClient.mockResolvedValue({ auth: { signInWithPassword: mockSignIn } } as any);
      
      const formData = new FormData();
      formData.append('email', 'test@test.com');
      formData.append('password', '123');

      await expect(login(formData)).rejects.toThrow('NEXT_REDIRECT:/dashboard');
      expect(mockSignIn).toHaveBeenCalled();
    });

    it('debería retornar error en login fallido', async () => {
      const mockSignIn = vi.fn().mockResolvedValue({ error: { message: 'Bad' } });
      mockCreateClient.mockResolvedValue({ auth: { signInWithPassword: mockSignIn } } as any);
      
      const formData = new FormData();
      formData.append('email', 'test@test.com');
      
      const result = await login(formData);
      expect(result).toEqual({ error: 'Bad' });
    });
  });

  describe('logout', () => {
    it('debería redirigir al desloguearse', async () => {
      const mockSignOut = vi.fn().mockResolvedValue({});
      mockCreateClient.mockResolvedValue({ auth: { signOut: mockSignOut } } as any);
      
      await expect(logout()).rejects.toThrow('NEXT_REDIRECT:/');
      expect(mockSignOut).toHaveBeenCalled();
    });
  });

  describe('getCurrentUser', () => {
    it('debería retornar null si no hay sesión', async () => {
      mockCreateClient.mockResolvedValue({ auth: { getUser: vi.fn().mockResolvedValue({ data: { user: null } }) } } as any);
      expect(await getCurrentUser()).toBeNull();
    });

    it('debería retornar perfil de usuario', async () => {
      const profile = { id: 'u1', nickname: 'Test' };
      const fromMock = vi.fn().mockReturnValue({ select: vi.fn().mockReturnValue({ eq: vi.fn().mockReturnValue({ single: vi.fn().mockResolvedValue({ data: profile }) }) }) });
      mockCreateClient.mockResolvedValue({ auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'u1' } } }) }, from: fromMock } as any);
      expect(await getCurrentUser()).toEqual(profile);
    });
  });
});
