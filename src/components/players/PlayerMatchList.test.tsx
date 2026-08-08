import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PlayerMatchList } from './PlayerMatchList';

const mockMatches = [
  { id: '1', match_date: '2023-01-01T12:00:00Z', status: 'played', score_team_a: 2, score_team_b: 1, team: 'white' },
  { id: '2', match_date: '2023-01-08T12:00:00Z', status: 'scheduled' },
  { id: '3', match_date: '2023-01-15T12:00:00Z', status: 'cancelled' },
  { id: '4', match_date: '2023-01-22T12:00:00Z', status: 'played', score_team_a: 0, score_team_b: 0, team: 'black' },
  { id: '5', match_date: '2023-01-29T12:00:00Z', status: 'played', score_team_a: 3, score_team_b: 0, team: 'white' },
  { id: '6', match_date: '2023-02-05T12:00:00Z', status: 'played', score_team_a: 1, score_team_b: 1, team: 'black' }
];

describe('PlayerMatchList', () => {
  it('No renderiza nada con array vacío', () => {
    const { container } = render(<PlayerMatchList matches={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('Muestra lista de partidos', () => {
    render(<PlayerMatchList matches={mockMatches as any} />);
    expect(screen.getAllByRole('link').length).toBeGreaterThan(0);
  });

  it('Muestra badge de estado correcto', () => {
    render(<PlayerMatchList matches={mockMatches as any} />);
    // Implementation specifics may vary depending on the text rendered in badges
    expect(screen.getAllByText('Jugado')[0] || screen.getAllByText('played')[0]).toBeDefined();
    expect(screen.getByText('Programado') || screen.getByText('scheduled')).toBeDefined();
    expect(screen.getByText('Cancelado') || screen.getByText('cancelled')).toBeDefined();
  });

  it('Muestra score para partidos jugados', () => {
    render(<PlayerMatchList matches={mockMatches as any} />);
    expect(screen.getAllByText('2')[0]).toBeDefined();
  });

  it('Implementa paginación (5 per page)', () => {
    render(<PlayerMatchList matches={mockMatches as any} />);
    const items = screen.getAllByRole('link');
    expect(items.length).toBe(5);
  });

  it('Botones de paginación se deshabilitan correctamente', () => {
    render(<PlayerMatchList matches={mockMatches as any} />);
    const prevBtn = screen.getByRole('button', { name: /anterior/i });
    const nextBtn = screen.getByRole('button', { name: /siguiente/i });
    
    expect(prevBtn).toBeDisabled();
    expect(nextBtn).not.toBeDisabled();
    
    fireEvent.click(nextBtn);
    
    expect(prevBtn).not.toBeDisabled();
    expect(nextBtn).toBeDisabled();
  });
});
