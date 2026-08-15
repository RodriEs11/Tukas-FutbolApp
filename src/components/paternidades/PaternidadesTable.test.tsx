import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PaternidadesTable } from './PaternidadesTable';
import { mockRegularPlayer, mockPlayerNoAvatar } from '@/lib/test-utils/fixtures';

const mockData = [
  {
    father: { ...mockRegularPlayer, id: '1', first_name: 'Padre', nickname: 'El Mago' },
    sons: [
      { son: { ...mockPlayerNoAvatar, id: '2', first_name: 'Hijo 1', nickname: 'Lucho 1' }, net_wins: 3 },
      { son: { ...mockPlayerNoAvatar, id: '3', first_name: 'Hijo 2', nickname: 'Lucho 2' }, net_wins: 1 }
    ]
  }
];

describe('PaternidadesTable', () => {
  it('Muestra "Sin Paternidades" con array vacío', () => {
    render(<PaternidadesTable paternities={[]} />);
    expect(screen.getByText('Sin Paternidades')).toBeDefined();
  });

  it('Renderiza tabla con padres', () => {
    render(<PaternidadesTable paternities={mockData as any} />);
    expect(screen.getByText('El Mago')).toBeDefined();
  });

  it('Abre el modal de detalle de hijos al hacer click en la fila', () => {
    render(<PaternidadesTable paternities={mockData as any} />);
    
    // Antes del click no deben estar en el documento
    expect(screen.queryByText('Lucho 1')).toBeNull();
    expect(screen.queryByText('Lucho 2')).toBeNull();

    // Click en la fila del padre
    fireEvent.click(screen.getByText('El Mago'));

    // Debe abrirse el modal con los hijos
    expect(screen.getByRole('dialog')).toBeDefined();
    expect(screen.getByText('Lucho 1')).toBeDefined();
    expect(screen.getByText('Lucho 2')).toBeDefined();
    expect(screen.getByText('+3 victorias')).toBeDefined();
    expect(screen.getByText('+1 victoria')).toBeDefined();
  });

  it('Cierra el modal al hacer click en el botón de cerrar', () => {
    render(<PaternidadesTable paternities={mockData as any} />);
    
    // Abrir modal
    fireEvent.click(screen.getByText('El Mago'));
    expect(screen.getByRole('dialog')).toBeDefined();

    // Cerrar modal usando el botón Cerrar
    fireEvent.click(screen.getByRole('button', { name: /cerrar$/i }));
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('Cierra el modal al presionar Escape', () => {
    render(<PaternidadesTable paternities={mockData as any} />);
    
    // Abrir modal
    fireEvent.click(screen.getByText('El Mago'));
    expect(screen.getByRole('dialog')).toBeDefined();

    // Presionar tecla Escape
    fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });
    expect(screen.queryByRole('dialog')).toBeNull();
  });
});

