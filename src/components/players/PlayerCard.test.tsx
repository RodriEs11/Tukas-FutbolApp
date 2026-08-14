import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PlayerCard } from './PlayerCard';

vi.mock('next/image', () => ({
  default: (props: any) => <img {...props} />,
}));

const mockPlayer = {
  id: '1',
  first_name: 'Lionel',
  last_name: 'Messi',
  nickname: 'La Pulga',
  avatar_url: '/messi.jpg',
};

const mockStats = {
  matches_played: 10,
  wins: 8,
  draws: 1,
  losses: 1,
  goals: 12,
  points: 25,
};

describe('PlayerCard', () => {
  it('Muestra nombre del jugador', () => {
    render(<PlayerCard player={mockPlayer as any} stats={mockStats as any} rating={99} />);
    expect(screen.getByText('Lionel Messi')).toBeDefined();
  });

  it('Muestra nombre completo del jugador', () => {
    render(<PlayerCard player={mockPlayer as any} stats={mockStats as any} rating={99} />);
    expect(screen.getByText('Lionel Messi')).toBeDefined();
  });

  it('Muestra iniciales cuando no hay avatar_url', () => {
    const playerNoAvatar = { ...mockPlayer, avatar_url: null };
    render(<PlayerCard player={playerNoAvatar as any} stats={mockStats as any} rating={99} />);
    expect(screen.getByText('LM')).toBeDefined();
  });

  it('Muestra imagen cuando hay avatar_url', () => {
    render(<PlayerCard player={mockPlayer as any} stats={mockStats as any} rating={99} />);
    const img = screen.getByRole('img');
    expect(img.getAttribute('src')).toBe('/messi.jpg');
  });

  it('Calcula win rate correctamente', () => {
    render(<PlayerCard player={mockPlayer as any} stats={mockStats as any} rating={99} />);
    // 8 wins out of 10 matches = 80%
    expect(screen.getByText('80%')).toBeDefined();
  });

  it('Muestra goles por partido', () => {
    render(<PlayerCard player={mockPlayer as any} stats={mockStats as any} rating={99} />);
    // 12 goals in 10 matches = 1.2
    expect(screen.getByText('1.2')).toBeDefined();
  });

  it('Muestra rating numérico', () => {
    render(<PlayerCard player={mockPlayer as any} stats={mockStats as any} rating={99} />);
    expect(screen.getByText('99')).toBeDefined();
  });

  it('Muestra "--" sin rating', () => {
    render(<PlayerCard player={mockPlayer as any} stats={mockStats as any} rating={null} />);
    expect(screen.getByText('--')).toBeDefined();
  });

  it('Muestra marca "⚽ TUKAS"', () => {
    render(<PlayerCard player={mockPlayer as any} stats={mockStats as any} rating={99} />);
    expect(screen.getByText('⚽ TUKAS')).toBeDefined();
  });
});
