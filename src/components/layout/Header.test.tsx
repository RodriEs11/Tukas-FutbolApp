import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Header } from './Header';
import { useUser } from '@/lib/hooks/useUser';
import { logout } from '@/lib/actions/auth';

vi.mock('next/navigation', () => ({
  usePathname: vi.fn().mockReturnValue('/'),
  useRouter: vi.fn().mockReturnValue({ push: vi.fn(), back: vi.fn(), refresh: vi.fn(), replace: vi.fn() }),
  useSearchParams: vi.fn().mockReturnValue(new URLSearchParams()),
  useParams: vi.fn().mockReturnValue({}),
}));

vi.mock('next/link', () => ({
  default: ({ children, href }: any) => <a href={href}>{children}</a>,
}));

vi.mock('@/lib/hooks/useUser', () => ({
  useUser: vi.fn(),
}));

vi.mock('@/lib/actions/auth', () => ({
  logout: vi.fn(),
}));

vi.mock('@/components/ui/ThemeToggle', () => ({
  ThemeToggle: () => <div data-testid="theme-toggle" />,
}));

describe('Header', () => {
  beforeEach(() => {
    vi.mocked(useUser).mockReturnValue({ user: null, loading: false } as any);
  });

  it('Muestra título correcto según pathname', async () => {
    const { usePathname } = await import('next/navigation');
    vi.mocked(usePathname).mockReturnValue('/players');
    render(<Header />);
    expect(screen.getByText('Las Tukas')).toBeDefined();
  });

  it('Muestra "Iniciar Sesión" cuando no hay usuario', () => {
    render(<Header />);
    expect(screen.getByText('Iniciar Sesión')).toBeDefined();
  });

  it('Muestra botón "Admin" cuando hay usuario', () => {
    vi.mocked(useUser).mockReturnValue({ user: { user_metadata: { name: 'Admin User', role: 'admin' } }, loading: false } as any);
    render(<Header />);
    expect(screen.getByText('Admin')).toBeDefined();
  });

  it('Abre menú al hacer click en botón de usuario', () => {
    vi.mocked(useUser).mockReturnValue({ user: { user_metadata: { name: 'Admin User', role: 'admin' } }, loading: false } as any);
    render(<Header />);
    const adminBtn = screen.getByText('Admin');
    fireEvent.click(adminBtn);
    expect(screen.getByText('Cerrar sesión')).toBeDefined();
  });

  it('Cierra menú al hacer click fuera', async () => {
    vi.mocked(useUser).mockReturnValue({ user: { user_metadata: { name: 'Admin User' } }, loading: false } as any);
    render(<Header />);
    fireEvent.click(screen.getByText('Admin'));
    expect(screen.getByText('Cerrar sesión')).toBeDefined();
    
    fireEvent.mouseDown(document.body);
    await waitFor(() => {
      expect(screen.queryByText('Cerrar sesión')).toBeNull();
    });
  });

  it('Muestra ThemeToggle', () => {
    render(<Header />);
    expect(screen.getByTestId('theme-toggle')).toBeDefined();
  });

  it('Muestra nombre y rol en el menú desplegable', () => {
    vi.mocked(useUser).mockReturnValue({ user: {}, profile: { first_name: 'Test', last_name: 'User', role: 'admin' }, loading: false } as any);
    render(<Header />);
    fireEvent.click(screen.getByText('Admin'));
    expect(screen.getByText('Test User')).toBeDefined();
    expect(screen.getByText('Administrador')).toBeDefined();
  });
});
