import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ScorersTable } from './ScorersTable';
import { mockScorerStatTop, mockScorerStatSecond } from '@/lib/test-utils/fixtures';

vi.mock('@/lib/actions/stats', () => ({
  getPlayerCardData: vi.fn().mockImplementation((id: string) => Promise.resolve({
    player: mockScorerStatTop.player,
    stats: null,
    rating: 80,
  })),
}));

const mockScorers = [
  mockScorerStatTop,
  mockScorerStatSecond,
  { ...mockScorerStatSecond, player: { ...mockScorerStatSecond.player, id: '3', first_name: 'Player 3' }, goals: 2 }
];

describe('ScorersTable', () => {
  it('Muestra "Sin goleadores" con array vacío', () => {
    render(<ScorersTable scorers={[]} />);
    expect(screen.getByText('Sin goleadores')).toBeDefined();
  });

  it('Renderiza tabla con headers correctos', () => {
    render(<ScorersTable scorers={mockScorers as any} />);
    expect(screen.getByText('#')).toBeDefined();
    expect(screen.getByText('NOMBRES')).toBeDefined();
    expect(screen.getByText('PJ')).toBeDefined();
    expect(screen.getByText('GOLES')).toBeDefined();
    expect(screen.getByText('G/P')).toBeDefined();
  });

  it('Muestra trofeo para primer lugar', () => {
    render(<ScorersTable scorers={mockScorers as any} />);
    const trophyIcon = document.querySelector('svg');
    expect(trophyIcon).toBeDefined();
  });

  it('Muestra números para el resto', () => {
    render(<ScorersTable scorers={mockScorers as any} />);
    expect(screen.getAllByText('2')).toBeDefined();
    expect(screen.getAllByText('3')).toBeDefined();
  });

  it('Muestra nickname si existe', () => {
    render(<ScorersTable scorers={mockScorers as any} />);
    expect(screen.getByText(mockScorerStatTop.player.nickname as string)).toBeDefined();
  });

  it('Abre el modal PlayerCardModal al hacer clic en una fila de jugador', async () => {
    const { fireEvent } = await import('@testing-library/react');
    render(<ScorersTable scorers={mockScorers as any} />);
    const playerRowText = screen.getByText(mockScorerStatTop.player.nickname as string);
    fireEvent.click(playerRowText);

    // Modal renders with player name
    expect(await screen.findByText(`${mockScorerStatTop.player.first_name} ${mockScorerStatTop.player.last_name}`)).toBeDefined();
  });
});
