import { vi } from 'vitest';

export const mockPush = vi.fn();
export const mockBack = vi.fn();
export const mockRefresh = vi.fn();
export const mockReplace = vi.fn();
export const mockPrefetch = vi.fn();

export const useRouter = vi.fn().mockReturnValue({
  push: mockPush,
  back: mockBack,
  refresh: mockRefresh,
  replace: mockReplace,
  prefetch: mockPrefetch,
});

export const usePathname = vi.fn().mockReturnValue('/dashboard');
export const useSearchParams = vi.fn().mockReturnValue(new URLSearchParams());
export const useParams = vi.fn().mockReturnValue({});

export const redirect = vi.fn().mockImplementation((url: string) => {
  throw new Error(`NEXT_REDIRECT:${url}`);
});

export const notFound = vi.fn().mockImplementation(() => {
  throw new Error('NEXT_NOT_FOUND');
});
