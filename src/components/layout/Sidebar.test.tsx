import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Sidebar } from './Sidebar';

vi.mock('next/navigation', () => ({
  usePathname: vi.fn().mockReturnValue('/dashboard'),
  useRouter: vi.fn().mockReturnValue({ push: vi.fn(), back: vi.fn(), refresh: vi.fn(), replace: vi.fn() }),
  useSearchParams: vi.fn().mockReturnValue(new URLSearchParams()),
  useParams: vi.fn().mockReturnValue({}),
}));

vi.mock('next/link', () => ({
  default: ({ children, href, className, ...props }: any) => (
    <a href={href} className={className} {...props}>
      {children}
    </a>
  ),
}));

describe('Sidebar', () => {
  it('Se oculta en mobile (tiene clase hidden)', () => {
    const { container } = render(<Sidebar />);
    const aside = container.querySelector('aside');
    expect(aside).toBeTruthy();
    expect(aside?.className).toContain('hidden');
    expect(aside?.className).toContain('md:flex');
  });

  it('Muestra logo y texto "Tukas"', () => {
    render(<Sidebar />);
    expect(screen.getByText('Tukas')).toBeDefined();
  });

  it('Muestra items de navegación: Inicio, Jugadores, Goleadores, Valla Menos Vencida, Paternidades, Partidos, Perfil', () => {
    render(<Sidebar />);
    expect(screen.getByText('Inicio')).toBeDefined();
    expect(screen.getByText('Jugadores')).toBeDefined();
    expect(screen.getByText('Goleadores')).toBeDefined();
    expect(screen.getByText('Valla Menos Vencida')).toBeDefined();
    expect(screen.getByText('Paternidades')).toBeDefined();
    expect(screen.getByText('Partidos')).toBeDefined();
    expect(screen.getByText('Perfil')).toBeDefined();
  });

  it('Marca item activo con estilos correctos', async () => {
    const { usePathname } = await import('next/navigation');
    vi.mocked(usePathname).mockReturnValue('/players');
    render(<Sidebar />);
    const activeLink = screen.getByText('Jugadores').closest('a');
    expect(activeLink?.className).toContain('bg-accent/10');
    expect(activeLink?.className).toContain('text-accent');
  });

  it('Muestra footer "Tukas v2.0"', () => {
    render(<Sidebar />);
    expect(screen.getByText('Tukas v2.0')).toBeDefined();
  });

  it('Funciona con isAdmin=true y false', () => {
    const { rerender } = render(<Sidebar isAdmin={true} />);
    expect(screen.getByText('Tukas v2.0')).toBeDefined();
    rerender(<Sidebar isAdmin={false} />);
    expect(screen.getByText('Tukas v2.0')).toBeDefined();
  });
});
