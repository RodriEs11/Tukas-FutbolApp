import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DeleteMatchModal } from './DeleteMatchModal';
import { DeleteMatchButton } from './DeleteMatchButton';
import * as matchActions from '@/lib/actions/matches';

const pushMock = vi.fn();
const refreshMock = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: pushMock,
    refresh: refreshMock,
  }),
}));

vi.mock('@/lib/actions/matches', () => ({
  deleteMatch: vi.fn(),
}));

describe('DeleteMatchModal & DeleteMatchButton', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('DeleteMatchModal', () => {
    it('no debería renderizarse si isOpen es false', () => {
      const { container } = render(
        <DeleteMatchModal
          isOpen={false}
          onClose={vi.fn()}
          onConfirm={vi.fn()}
          isLoading={false}
        />
      );

      expect(container.firstChild).toBeNull();
    });

    it('debería renderizar título, mensaje y botones cuando isOpen es true', () => {
      render(
        <DeleteMatchModal
          isOpen={true}
          onClose={vi.fn()}
          onConfirm={vi.fn()}
          isLoading={false}
        />
      );

      expect(screen.getByText('¿Eliminar partido?')).toBeInTheDocument();
      expect(
        screen.getByText(/Esta acción es permanente e irreversible/i)
      ).toBeInTheDocument();
      expect(screen.getByText('Cancelar')).toBeInTheDocument();
      expect(screen.getByText('Eliminar')).toBeInTheDocument();
    });

    it('debería llamar a onClose al hacer click en Cancelar', () => {
      const onClose = vi.fn();
      render(
        <DeleteMatchModal
          isOpen={true}
          onClose={onClose}
          onConfirm={vi.fn()}
          isLoading={false}
        />
      );

      fireEvent.click(screen.getByText('Cancelar'));
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('debería llamar a onConfirm al presionar Eliminar', () => {
      const onConfirm = vi.fn();
      render(
        <DeleteMatchModal
          isOpen={true}
          onClose={vi.fn()}
          onConfirm={onConfirm}
          isLoading={false}
        />
      );

      fireEvent.click(screen.getByText('Eliminar'));
      expect(onConfirm).toHaveBeenCalledTimes(1);
    });

    it('debería mostrar mensaje de error si se proporciona error', () => {
      render(
        <DeleteMatchModal
          isOpen={true}
          onClose={vi.fn()}
          onConfirm={vi.fn()}
          isLoading={false}
          error="No se puede eliminar este partido"
        />
      );

      expect(screen.getByText('No se puede eliminar este partido')).toBeInTheDocument();
    });
  });

  describe('DeleteMatchButton', () => {
    it('debería renderizar ícono de eliminar por defecto', () => {
      render(<DeleteMatchButton matchId="match-1" />);

      const button = screen.getByTitle('Eliminar Partido');
      expect(button).toBeInTheDocument();
    });

    it('debería renderizar botón con texto cuando variant="button"', () => {
      render(<DeleteMatchButton matchId="match-1" variant="button" />);

      expect(screen.getByText('Eliminar Partido')).toBeInTheDocument();
    });

    it('debería abrir el modal al presionar el botón y llamar a deleteMatch al confirmar', async () => {
      vi.mocked(matchActions.deleteMatch).mockResolvedValue({ success: true } as any);

      render(<DeleteMatchButton matchId="match-1" />);

      fireEvent.click(screen.getByTitle('Eliminar Partido'));

      expect(screen.getByText('¿Eliminar partido?')).toBeInTheDocument();

      fireEvent.click(screen.getByText('Eliminar'));

      await waitFor(() => {
        expect(matchActions.deleteMatch).toHaveBeenCalledWith('match-1');
        expect(refreshMock).toHaveBeenCalled();
      });
    });

    it('debería redirigir con router.push si se proporciona redirectTo', async () => {
      vi.mocked(matchActions.deleteMatch).mockResolvedValue({ success: true } as any);

      render(<DeleteMatchButton matchId="match-1" redirectTo="/matches" variant="button" />);

      fireEvent.click(screen.getByText('Eliminar Partido'));
      fireEvent.click(screen.getByText('Eliminar'));

      await waitFor(() => {
        expect(matchActions.deleteMatch).toHaveBeenCalledWith('match-1');
        expect(pushMock).toHaveBeenCalledWith('/matches');
      });
    });

    it('debería mostrar error si deleteMatch falla', async () => {
      vi.mocked(matchActions.deleteMatch).mockResolvedValue({
        error: 'No se pueden eliminar partidos que ya fueron jugados',
      });

      render(<DeleteMatchButton matchId="match-1" />);

      fireEvent.click(screen.getByTitle('Eliminar Partido'));
      fireEvent.click(screen.getByText('Eliminar'));

      await waitFor(() => {
        expect(
          screen.getByText('No se pueden eliminar partidos que ya fueron jugados')
        ).toBeInTheDocument();
      });
    });
  });
});
