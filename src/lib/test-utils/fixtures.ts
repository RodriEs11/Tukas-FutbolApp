import type {
  UserProfile,
  Match,
  MatchPlayer,
  Field,
  PlayerStats,
  ScorerStat,
  PaternityStat,
} from '@/lib/types/database';

// ---- Players ----
export const mockAdminPlayer: UserProfile = {
  id: 'admin-001',
  first_name: 'Carlos',
  last_name: 'Admin',
  nickname: 'El Jefe',
  role: 'admin',
  avatar_url: '',
  preferred_foot: 'Derecha',
  position: 'Mediocampista',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
};

export const mockRegularPlayer: UserProfile = {
  id: 'player-001',
  first_name: 'Juan',
  last_name: 'Pérez',
  nickname: 'El Mago',
  role: 'player',
  avatar_url: 'https://example.com/avatar.jpg',
  preferred_foot: 'Izquierda',
  position: 'Delantero',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
};

export const mockPlayerNoNickname: UserProfile = {
  id: 'player-002',
  first_name: 'Pedro',
  last_name: 'González',
  nickname: '',
  role: 'player',
  avatar_url: '',
  preferred_foot: 'Derecha',
  position: 'Defensa',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
};

export const mockPlayerNoAvatar: UserProfile = {
  id: 'player-003',
  first_name: 'Luis',
  last_name: 'Martínez',
  nickname: 'Lucho',
  role: 'player',
  avatar_url: '',
  preferred_foot: '',
  position: '',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
};

// ---- Fields ----
export const mockField: Field = {
  id: 'field-001',
  name: 'Cancha Central',
  location: 'Buenos Aires',
  surface_type: 'césped',
  description: 'Cancha principal de césped natural',
  is_active: true,
  created_by: 'admin-001',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
};

// ---- Matches ----
export const mockMatchPlayed: Match = {
  id: 'match-001',
  field_id: 'field-001',
  match_date: '2024-06-15T18:00:00Z',
  status: 'played',
  score_team_a: 3,
  score_team_b: 1,
  notes: 'Gran partido',
  created_by: 'admin-001',
  created_at: '2024-06-15T00:00:00Z',
  updated_at: '2024-06-15T20:00:00Z',
  field: mockField,
  match_players: [],
};

export const mockMatchScheduled: Match = {
  id: 'match-002',
  field_id: 'field-001',
  match_date: '2025-12-20T20:00:00Z',
  status: 'scheduled',
  score_team_a: 0,
  score_team_b: 0,
  notes: '',
  created_by: 'admin-001',
  created_at: '2024-06-20T00:00:00Z',
  updated_at: '2024-06-20T00:00:00Z',
  field: mockField,
  match_players: [],
};

export const mockMatchCancelled: Match = {
  id: 'match-003',
  field_id: 'field-001',
  match_date: '2024-06-25T18:00:00Z',
  status: 'cancelled',
  score_team_a: 0,
  score_team_b: 0,
  notes: 'Lluvia',
  created_by: 'admin-001',
  created_at: '2024-06-25T00:00:00Z',
  updated_at: '2024-06-25T00:00:00Z',
  field: mockField,
  match_players: [],
};

// ---- Match Players ----
export const mockMatchPlayerTeamA: MatchPlayer = {
  id: 'mp-001',
  match_id: 'match-001',
  player_id: 'player-001',
  team: 'A',
  goals: 2,
  attended: true,
  created_at: '2024-06-15T00:00:00Z',
  player: mockRegularPlayer,
};

export const mockMatchPlayerTeamB: MatchPlayer = {
  id: 'mp-002',
  match_id: 'match-001',
  player_id: 'player-002',
  team: 'B',
  goals: 1,
  attended: true,
  created_at: '2024-06-15T00:00:00Z',
  player: mockPlayerNoNickname,
};

export const mockMatchPlayerNotAttended: MatchPlayer = {
  id: 'mp-003',
  match_id: 'match-001',
  player_id: 'player-003',
  team: 'A',
  goals: 0,
  attended: false,
  created_at: '2024-06-15T00:00:00Z',
  player: mockPlayerNoAvatar,
};

// ---- Player Stats ----
export const mockPlayerStatsGood: PlayerStats = {
  player: mockRegularPlayer,
  matches_played: 10,
  goals: 8,
  wins: 6,
  draws: 2,
  losses: 2,
  points: 20,
};

export const mockPlayerStatsPoor: PlayerStats = {
  player: mockPlayerNoNickname,
  matches_played: 5,
  goals: 1,
  wins: 1,
  draws: 1,
  losses: 3,
  points: 4,
};

export const mockPlayerStatsNoMatches: PlayerStats = {
  player: mockPlayerNoAvatar,
  matches_played: 0,
  goals: 0,
  wins: 0,
  draws: 0,
  losses: 0,
  points: 0,
};

// ---- Scorer Stats ----
export const mockScorerStatTop: ScorerStat = {
  player: mockRegularPlayer,
  matches_played: 10,
  goals: 15,
  goals_per_match: 1.5,
};

export const mockScorerStatSecond: ScorerStat = {
  player: mockPlayerNoNickname,
  matches_played: 8,
  goals: 6,
  goals_per_match: 0.75,
};

// ---- Paternity Stats ----
export const mockPaternityStat: PaternityStat = {
  father: mockRegularPlayer,
  sons: [
    { son: mockPlayerNoNickname, net_wins: 5 },
    { son: mockPlayerNoAvatar, net_wins: 3 },
  ],
};

// ---- Factories (for creating custom data) ----
export function createMockPlayer(overrides: Partial<UserProfile> = {}): UserProfile {
  return {
    id: `player-${Math.random().toString(36).slice(2, 9)}`,
    first_name: 'Test',
    last_name: 'Player',
    nickname: '',
    role: 'player',
    avatar_url: '',
    preferred_foot: '',
    position: '',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    ...overrides,
  };
}

export function createMockMatch(overrides: Partial<Match> = {}): Match {
  return {
    id: `match-${Math.random().toString(36).slice(2, 9)}`,
    field_id: 'field-001',
    match_date: '2024-06-15T18:00:00Z',
    status: 'scheduled',
    score_team_a: 0,
    score_team_b: 0,
    notes: '',
    created_by: 'admin-001',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    ...overrides,
  };
}

export function createMockMatchPlayer(overrides: Partial<MatchPlayer> = {}): MatchPlayer {
  return {
    id: `mp-${Math.random().toString(36).slice(2, 9)}`,
    match_id: 'match-001',
    player_id: 'player-001',
    team: 'A',
    goals: 0,
    attended: true,
    created_at: '2024-01-01T00:00:00Z',
    ...overrides,
  };
}
