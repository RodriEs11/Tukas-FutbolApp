import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { GoalkeepersTable } from './GoalkeepersTable';
import { mockRegularPlayer, mockPlayerNoNickname, mockPlayerNoAvatar } from '@/lib/test-utils/fixtures';
import type { GoalkeeperStat } from '@/lib/types/database';

const mockGoalkeepers: GoalkeeperStat[] = [
  {
    player: { ...mockRegularPlayer, id: '1', first_name: 'Dibu', last_name: 'Martínez', nickname: 'Dibu' },
    matches_as_gk: 5,
    goals_conceded: 3,
    clean_sheets: 3,
    average_goals_conceded: 0.6,
    is_eligible: true,
    min_matches_required: 3,
  },
  {
    player: { ...mockPlayerNoNickname, id: '2', first_name: 'Franco', last_name: 'Armani', nickname: 'Pulpo' },
    matches_as_gk: 4,
    goals_conceded: 4,
    clean_sheets: 1,
    average_goals_conceded: 1.0,
    is_eligible: true,
    min_matches_required: 3,
  },
  {
    player: { ...mockPlayerNoAvatar, id: '3', first_name: 'Esteban', last_name: 'Andrada', nickname: 'Sabandija' },
    matches_as_gk: 1,
    goals_conceded: 0,
    clean_sheets: 1,
    average_goals_conceded: 0.0,
    is_eligible: false,
    min_matches_required: 3,
  },
];

describe('GoalkeepersTable', () => {
  it('Muestra "Sin arqueros registrados" con array vacío', () => {
    render(<GoalkeepersTable goalkeepers={[]} />);
    expect(screen.getByText('Sin arqueros registrados')).toBeDefined();
  });

  it('Renderiza tabla con headers correctos incluyendo VI', () => {
    render(<GoalkeepersTable goalkeepers={mockGoalkeepers} />);
    expect(screen.getByText('#')).toBeDefined();
    expect(screen.getByText('ARQUERO')).toBeDefined();
    expect(screen.getByText('PJ')).toBeDefined();
    expect(screen.getByText('VI')).toBeDefined();
    expect(screen.getByText('GR')).toBeDefined();
    expect(screen.getByText('PROM')).toBeDefined();
  });

  it('Muestra trofeo y badge para primer lugar elegible', () => {
    render(<GoalkeepersTable goalkeepers={mockGoalkeepers} />);
    const trophyIcon = document.querySelector('svg');
    expect(trophyIcon).toBeDefined();
    expect(screen.getByText('Valla menos vencida 🧤')).toBeDefined();
  });

  it('Muestra números para elegibles y badge de mínimo insuficiente para no elegibles', () => {
    render(<GoalkeepersTable goalkeepers={mockGoalkeepers} />);
    expect(screen.getAllByText('2')).toBeDefined();
    expect(screen.getAllByText('< 3 PJ').length).toBeGreaterThan(0);
    expect(screen.getByText('-')).toBeDefined();
  });

  it('Muestra nickname del arquero, VI y promedio con dos decimales', () => {
    render(<GoalkeepersTable goalkeepers={mockGoalkeepers} />);
    expect(screen.getByText('Dibu')).toBeDefined();
    expect(screen.getAllByText('3').length).toBeGreaterThan(0);
    expect(screen.getByText('0.60')).toBeDefined();
    expect(screen.getByText('1.00')).toBeDefined();
    expect(screen.getByText('0.00')).toBeDefined();
  });
});
