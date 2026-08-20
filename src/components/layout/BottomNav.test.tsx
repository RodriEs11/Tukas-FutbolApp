import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BottomNav } from './BottomNav';

vi.mock('next/navigation', () => ({
  usePathname: vi.fn().mockReturnValue('/'),
  useRouter: vi.fn().mockReturnValue({ push: vi.fn(), back: vi.fn(), refresh: vi.fn(), replace: vi.fn() }),
  useSearchParams: vi.fn().mockReturnValue(new URLSearchParams()),
  useParams: vi.fn().mockReturnValue({}),
}));

vi.mock('next/link', () => ({
  default: ({ children, href, className }: any) => (
    <a href={href} className={className} data-testid="nav-link">
      {children}
    </a>
  ),
}));

describe('BottomNav', () => {
  it('Renderiza todos los items de navegación base (6 items)', () => {
    render(<BottomNav />);
    const links = screen.getAllByTestId('nav-link');
    expect(links).toHaveLength(6);
    expect(screen.getByText('Inicio')).toBeDefined();
    expect(screen.getByText('Jugadores')).toBeDefined();
    expect(screen.getByText('Goleadores')).toBeDefined();
    expect(screen.getByText('Arqueros')).toBeDefined();
    expect(screen.getByText('Paternidades')).toBeDefined();
    expect(screen.getByText('Partidos')).toBeDefined();
  });

  it('Marca el item activo correctamente según pathname', async () => {
    const { usePathname } = await import('next/navigation');
    vi.mocked(usePathname).mockReturnValue('/players');
    
    const { container } = render(<BottomNav />);
    const activeIconContainer = container.querySelector('.text-primary.bg-primary\\/10');
    expect(activeIconContainer).toBeDefined();
  });

  it('Marca como activo rutas hijas (e.g. /players/123)', async () => {
    const { usePathname } = await import('next/navigation');
    vi.mocked(usePathname).mockReturnValue('/players/123');
    
    render(<BottomNav />);
    const activeText = screen.getByText('Jugadores');
    expect(activeText.className).toContain('font-medium');
  });

  it('Tiene clase md:hidden para ocultarse en desktop', () => {
    const { container } = render(<BottomNav />);
    expect(container.firstChild?.parentElement?.innerHTML).toContain('md:hidden');
  });

  it('Cada link tiene href correcto', () => {
    render(<BottomNav />);
    const links = screen.getAllByTestId('nav-link');
    expect(links.find(l => l.getAttribute('href') === '/dashboard')).toBeDefined();
    expect(links.find(l => l.getAttribute('href') === '/players')).toBeDefined();
    expect(links.find(l => l.getAttribute('href') === '/matches')).toBeDefined();
    expect(links.find(l => l.getAttribute('href') === '/scorers')).toBeDefined();
    expect(links.find(l => l.getAttribute('href') === '/valla-menos-vencida')).toBeDefined();
    expect(links.find(l => l.getAttribute('href') === '/paternidades')).toBeDefined();
  });

  it('Muestra indicador de punto activo en item seleccionado', async () => {
    const { usePathname } = await import('next/navigation');
    vi.mocked(usePathname).mockReturnValue('/matches');
    const { container } = render(<BottomNav />);
    expect(container.querySelector('.bg-primary.rounded-full')).toBeDefined();
  });

  it('Funciona con isAdmin=true y isAdmin=false', () => {
    const { rerender } = render(<BottomNav isAdmin={true} />);
    expect(screen.getAllByTestId('nav-link')).toHaveLength(6);
    
    rerender(<BottomNav isAdmin={false} />);
    expect(screen.getAllByTestId('nav-link')).toHaveLength(6);
  });

  it('Renderiza con isAdmin undefined', () => {
    render(<BottomNav />);
    expect(screen.getAllByTestId('nav-link')).toHaveLength(6);
  });
});
