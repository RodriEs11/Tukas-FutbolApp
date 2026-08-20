import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MatchRosters } from './MatchRosters';
import type { MatchPlayer, UserProfile } from '@/lib/types/database';

const mockPlayer1: UserProfile = {
  id: 'p1',
  first_name: 'Lionel',
  last_name: 'Messi',
  nickname: 'La Pulga',
  role: 'player',
  avatar_url: '',
  is_active: true,
  created_at: '',
  updated_at: '',
};

const mockPlayer2: UserProfile = {
  id: 'p2',
  first_name: 'Angel',
  last_name: 'Di Maria',
  nickname: 'Fideo',
  role: 'player',
  avatar_url: '',
  is_active: true,
  created_at: '',
  updated_at: '',
};

const mockPlayer3: UserProfile = {
  id: 'p3',
  first_name: 'Emiliano',
  last_name: 'Martinez',
  nickname: 'Dibu',
  role: 'player',
  avatar_url: '',
  is_active: true,
  created_at: '',
  updated_at: '',
};

const mockTeamA: MatchPlayer[] = [
  {
    id: 'mp1',
    match_id: 'm1',
    player_id: 'p1',
    team: 'A',
    goals: 2,
    attended: true,
    created_at: '',
    player: mockPlayer1,
  },
  {
    id: 'mp2',
    match_id: 'm1',
    player_id: 'p2',
    team: 'A',
    goals: 3,
    attended: true,
    created_at: '',
    player: mockPlayer2,
  },
  {
    id: 'mp3',
    match_id: 'm1',
    player_id: 'p3',
    team: 'A',
    goals: 0,
    attended: true,
    pitch_position: 'gk',
    created_at: '',
    player: mockPlayer3,
  },
];

describe('MatchRosters Component', () => {
  it('Muestra estado vacío cuando no hay jugadores', () => {
    render(<MatchRosters matchId="m1" teamA={[]} teamB={[]} isPlayed={false} />);
    expect(screen.getAllByText('Sin jugadores asignados')).toHaveLength(2);
    expect(screen.getByText('Planteles Convocados')).toBeDefined();
  });

  it('Muestra el título correcto para partidos jugados', () => {
    render(<MatchRosters matchId="m1" teamA={mockTeamA} teamB={[]} isPlayed={true} />);
    expect(screen.getByText('Planteles y Goleadores')).toBeDefined();
  });

  it('Ordena los goleadores primero de mayor a menor y muestra los goles', () => {
    render(<MatchRosters matchId="m1" teamA={mockTeamA} teamB={[]} isPlayed={true} />);
    
    // Fideo (3 goals), then La Pulga (2 goals), then Dibu (0 goals)
    const playerNames = screen.getAllByText(/Fideo|La Pulga|Dibu/).map((el) => el.textContent);
    expect(playerNames).toEqual(['Fideo', 'La Pulga', 'Dibu']);

    // Check goal counts
    expect(screen.getByText('3')).toBeDefined();
    expect(screen.getByText('2')).toBeDefined();
    
    // Check goalkeeper badge
    expect(screen.getByText(/ARQ/)).toBeDefined();
  });

  it('Abre el modal PlayerCardModal al hacer clic en un jugador cuando no se está editando', () => {
    render(<MatchRosters matchId="m1" teamA={mockTeamA} teamB={[]} isPlayed={true} isEditing={false} />);
    const fideoElement = screen.getByText('Fideo');
    
    fireEvent.click(fideoElement);
    
    // Player card modal should be triggered
    expect(screen.getByText('Angel Di Maria')).toBeDefined();
  });

  it('Muestra controles de sumar/restar goles y botones de añadir/eliminar en modo edición', () => {
    render(<MatchRosters matchId="m1" teamA={mockTeamA} teamB={[]} isPlayed={true} isEditing={true} />);
    
    // Add / Subtract goal buttons
    const addButtons = screen.getAllByLabelText('Sumar gol');
    const subtractButtons = screen.getAllByLabelText('Restar gol');
    expect(addButtons.length).toBe(3);
    expect(subtractButtons.length).toBe(3);

    // Add player button in header
    expect(screen.getAllByText('Añadir').length).toBe(2);

    // Delete player buttons
    const deleteButtons = screen.getAllByTitle('Eliminar jugador del partido');
    expect(deleteButtons.length).toBe(3);
  });

  it('Mantiene el orden congelado durante la edición cuando se suman goles a un jugador', () => {
    render(<MatchRosters matchId="m1" teamA={mockTeamA} teamB={[]} isPlayed={true} isEditing={true} />);
    
    // Initial order: Fideo (3), La Pulga (2), Dibu (0)
    let playerNames = screen.getAllByText(/Fideo|La Pulga|Dibu/).map((el) => el.textContent);
    expect(playerNames).toEqual(['Fideo', 'La Pulga', 'Dibu']);

    // Click "+" on Dibu (last button) 5 times to make Dibu have 5 goals
    const addButtons = screen.getAllByLabelText('Sumar gol');
    fireEvent.click(addButtons[2]);
    fireEvent.click(addButtons[2]);
    fireEvent.click(addButtons[2]);
    fireEvent.click(addButtons[2]);
    fireEvent.click(addButtons[2]);

    // Order must remain stable / frozen during editing!
    playerNames = screen.getAllByText(/Fideo|La Pulga|Dibu/).map((el) => el.textContent);
    expect(playerNames).toEqual(['Fideo', 'La Pulga', 'Dibu']);
  });
});
