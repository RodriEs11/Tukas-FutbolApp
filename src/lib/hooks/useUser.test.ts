import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useUser } from './useUser';
import { createClient } from '@/lib/supabase/client';

vi.mock('@/lib/supabase/client', () => ({
  createClient: vi.fn(),
}));

describe('useUser Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debería inicializar con valores por defecto', async () => {
    const mockSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: null } }),
        onAuthStateChange: vi.fn().mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } }),
      },
    };
    vi.mocked(createClient).mockReturnValue(mockSupabase as any);

    const { result } = renderHook(() => useUser());

    expect(result.current.loading).toBe(true);
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.user).toBeNull();
      expect(result.current.profile).toBeNull();
    });
  });
});
