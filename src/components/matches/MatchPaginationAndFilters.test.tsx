import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MatchFilters } from './MatchFilters';
import { MatchPagination } from './MatchPagination';

const pushMock = vi.fn();
const searchParamsMock = new URLSearchParams();

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: pushMock,
  }),
  usePathname: () => '/matches',
  useSearchParams: () => searchParamsMock,
}));

describe('MatchFilters & MatchPagination', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('MatchFilters', () => {
    it('debería renderizar los campos de filtro Desde y Hasta', () => {
      render(<MatchFilters initialFrom="2026-08-01" initialTo="2026-08-31" />);

      const fromInput = screen.getByLabelText(/Desde/i) as HTMLInputElement;
      const toInput = screen.getByLabelText(/Hasta/i) as HTMLInputElement;

      expect(fromInput.value).toBe('2026-08-01');
      expect(toInput.value).toBe('2026-08-31');
      expect(screen.getByText('Limpiar')).toBeInTheDocument();
    });

    it('debería actualizar los searchParams al cambiar la fecha Desde', () => {
      render(<MatchFilters />);

      const fromInput = screen.getByLabelText(/Desde/i);
      fireEvent.change(fromInput, { target: { value: '2026-08-10' } });

      expect(pushMock).toHaveBeenCalledWith(expect.stringContaining('from=2026-08-10'));
    });

    it('debería limpiar filtros al presionar Limpiar', () => {
      render(<MatchFilters initialFrom="2026-08-01" />);

      const clearButton = screen.getByText('Limpiar');
      fireEvent.click(clearButton);

      expect(pushMock).toHaveBeenCalledWith('/matches');
    });
  });

  describe('MatchPagination', () => {
    it('no debería renderizarse si sólo hay 1 página', () => {
      const { container } = render(
        <MatchPagination currentPage={1} totalPages={1} totalMatches={4} pageSize={5} />
      );

      expect(container.firstChild).toBeNull();
    });

    it('debería renderizar la paginación correctamente con múltiples páginas', () => {
      render(
        <MatchPagination currentPage={1} totalPages={3} totalMatches={14} pageSize={5} />
      );

      expect(screen.getByText(/Mostrando/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '2' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '3' })).toBeInTheDocument();
    });

    it('debería navegar a la página siguiente al hacer click', () => {
      render(
        <MatchPagination currentPage={1} totalPages={3} totalMatches={14} pageSize={5} />
      );

      const nextButton = screen.getByLabelText('Página siguiente');
      fireEvent.click(nextButton);

      expect(pushMock).toHaveBeenCalledWith(expect.stringContaining('page=2'));
    });
  });
});
