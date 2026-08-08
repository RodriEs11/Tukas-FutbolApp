import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AddPlayerModal } from './AddPlayerModal';
import { addPlayer } from '@/lib/actions/players';

vi.mock('@/lib/actions/players', () => ({
  addPlayer: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  useRouter: vi.fn().mockReturnValue({ push: vi.fn(), back: vi.fn(), refresh: vi.fn() }),
}));

describe('AddPlayerModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('Muestra botón "Añadir Jugador"', () => {
    render(<AddPlayerModal />);
    expect(screen.getByText('Añadir Jugador')).toBeDefined();
  });

  it('Abre modal al hacer click', () => {
    render(<AddPlayerModal />);
    fireEvent.click(screen.getByText('Añadir Jugador'));
    expect(screen.getByText('Añadir Nuevo Jugador')).toBeDefined();
  });

  it('Muestra campos del formulario', () => {
    render(<AddPlayerModal />);
    fireEvent.click(screen.getByText('Añadir Jugador'));
    expect(screen.getByLabelText(/nombre/i)).toBeDefined();
    expect(screen.getByLabelText(/apodo/i)).toBeDefined();
  });

  it('Cierra modal con botón Cancelar', () => {
    render(<AddPlayerModal />);
    fireEvent.click(screen.getByText('Añadir Jugador'));
    fireEvent.click(screen.getByText('Cancelar'));
    expect(screen.queryByText('Añadir Nuevo Jugador')).toBeNull();
  });

  it('Cierra modal con botón X', () => {
    render(<AddPlayerModal />);
    fireEvent.click(screen.getByText('Añadir Jugador'));
    const closeBtn = document.querySelector('button.p-1.rounded-full');
    if (closeBtn) fireEvent.click(closeBtn);
    expect(screen.queryByText('Añadir Nuevo Jugador')).toBeNull();
  });

  it('Envía formulario correctamente', async () => {
    vi.mocked(addPlayer).mockResolvedValue({ success: true } as any);
    render(<AddPlayerModal />);
    fireEvent.click(screen.getByText('Añadir Jugador'));
    
    fireEvent.change(screen.getByLabelText(/nombre/i), { target: { value: 'Test' } });
    fireEvent.change(screen.getByLabelText(/apellido/i), { target: { value: 'Player' } });
    fireEvent.click(screen.getByText('Guardar Jugador'));

    await waitFor(() => {
      expect(addPlayer).toHaveBeenCalled();
    });
  });

  it('Muestra error del servidor', async () => {
    vi.mocked(addPlayer).mockResolvedValue({ success: false, error: 'Error al añadir' } as any);
    render(<AddPlayerModal />);
    fireEvent.click(screen.getByText('Añadir Jugador'));
    
    fireEvent.change(screen.getByLabelText(/nombre/i), { target: { value: 'Test' } });
    fireEvent.change(screen.getByLabelText(/apellido/i), { target: { value: 'Player' } });
    fireEvent.click(screen.getByText('Guardar Jugador'));

    await waitFor(() => {
      expect(screen.getByText('Error al añadir')).toBeDefined();
    });
  });
});
