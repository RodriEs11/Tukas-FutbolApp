import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PaternidadesTable } from './PaternidadesTable';
import { mockRegularPlayer, mockPlayerNoAvatar } from '@/lib/test-utils/fixtures';

const mockData = [
  {
    father: { ...mockRegularPlayer, id: '1', first_name: 'Padre' },
    sons: [
      { son: { ...mockPlayerNoAvatar, id: '2', first_name: 'Hijo 1' }, net_wins: 3 },
      { son: { ...mockPlayerNoAvatar, id: '3', first_name: 'Hijo 2' }, net_wins: 1 }
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
    expect(screen.getByText('El Mago')).toBeDefined(); // Since mockRegularPlayer nickname is El Mago
  });

  it('Expande detalle de hijos al hacer click', () => {
    render(<PaternidadesTable paternities={mockData as any} />);
    fireEvent.click(screen.getByText('El Mago'));
    expect(screen.getAllByText('Lucho')).toHaveLength(2); // Since mockPlayerNoAvatar nickname is Lucho
  });

  it('Colapsa al hacer click de nuevo', () => {
    render(<PaternidadesTable paternities={mockData as any} />);
    const row = screen.getByText('El Mago');
    
    // Expand
    fireEvent.click(row);
    expect(screen.getAllByText('Lucho')).toHaveLength(2);
    
    // Collapse
    fireEvent.click(row);
    expect(screen.queryByText('Lucho')).toBeNull();
  });

  it('Muestra net_wins', () => {
    render(<PaternidadesTable paternities={mockData as any} />);
    fireEvent.click(screen.getByText('El Mago'));
    expect(screen.getByText('+3 victorias')).toBeDefined();
    expect(screen.getByText('+1 victorias')).toBeDefined();
  });
});
