import { vi } from 'vitest';

const mockCookieStore = {
  get: vi.fn(),
  getAll: vi.fn().mockReturnValue([]),
  set: vi.fn(),
  delete: vi.fn(),
  has: vi.fn(),
};

export const cookies = vi.fn().mockResolvedValue(mockCookieStore);
export const headers = vi.fn().mockResolvedValue(new Map());
