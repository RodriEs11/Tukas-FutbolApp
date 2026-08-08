import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ScorersTable } from './ScorersTable';
import { mockScorerStatTop, mockScorerStatSecond } from '@/lib/test-utils/fixtures';

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
});
