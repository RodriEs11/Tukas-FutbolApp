export const APP_NAME = 'Tukas';
export const APP_DESCRIPTION = 'Gestión de fútbol amateur y profesional';

// Points system
export const POINTS = {
  WIN: 3,
  DRAW: 1,
  LOSS: 0,
} as const;

// Match status labels
export const MATCH_STATUS_LABELS = {
  scheduled: 'Programado',
  played: 'Jugado',
  cancelled: 'Cancelado',
} as const;

// Surface type labels
export const SURFACE_TYPE_LABELS = {
  'césped': 'Césped Natural',
  'sintético': 'Césped Sintético',
  'tierra': 'Tierra',
  'cemento': 'Cemento',
  'otro': 'Otro',
} as const;

// Team labels
export const TEAM_LABELS = {
  A: 'Equipo A',
  B: 'Equipo B',
} as const;

// Navigation items
export const NAV_ITEMS = [
  { href: '/dashboard', label: 'Inicio', icon: 'Home' },
  { href: '/players', label: 'Jugadores', icon: 'Users' },
  { href: '/matches', label: 'Partidos', icon: 'Trophy' },
] as const;
