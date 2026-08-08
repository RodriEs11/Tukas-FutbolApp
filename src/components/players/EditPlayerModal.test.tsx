import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { EditPlayerModal } from './EditPlayerModal';
import { updatePlayer } from '@/lib/actions/players';

vi.mock('@/lib/actions/players', () => ({
  updatePlayer: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  useRouter: vi.fn().mockReturnValue({ push: vi.fn(), back: vi.fn(), refresh: vi.fn() }),
}));

const mockPlayer = {
  id: '1',
  first_name: 'John',
  last_name: 'Doe',
  nickname: 'JD'
};

describe('EditPlayerModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('Muestra botón "Editar"', () => {
    render(<EditPlayerModal player={mockPlayer as any} />);
    expect(screen.getByText('Editar')).toBeDefined();
  });

  it('Abre modal con datos pre-llenados', () => {
    render(<EditPlayerModal player={mockPlayer as any} />);
    fireEvent.click(screen.getByText('Editar'));
    expect(screen.getByDisplayValue('John')).toBeDefined();
    expect(screen.getByDisplayValue('Doe')).toBeDefined();
    expect(screen.getByDisplayValue('JD')).toBeDefined();
  });

  it('Envía formulario con datos actualizados', async () => {
    vi.mocked(updatePlayer).mockResolvedValue({ success: true } as any);
    render(<EditPlayerModal player={mockPlayer as any} />);
    fireEvent.click(screen.getByText('Editar'));
    
    fireEvent.change(screen.getByLabelText(/nombre/i), { target: { value: 'Jane' } });
    fireEvent.click(screen.getByText('Guardar Cambios'));

    await waitFor(() => {
      expect(updatePlayer).toHaveBeenCalled();
    });
  });

  it('Muestra errores de validación', async () => {
    vi.mocked(updatePlayer).mockResolvedValue({ success: false, error: 'Nombre inválido' } as any);
    render(<EditPlayerModal player={mockPlayer as any} />);
    fireEvent.click(screen.getByText('Editar'));
    fireEvent.click(screen.getByText('Guardar Cambios'));

    await waitFor(() => {
      expect(screen.getByText('Nombre inválido')).toBeDefined();
    });
  });
});
