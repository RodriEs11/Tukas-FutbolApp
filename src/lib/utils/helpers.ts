import { POINTS } from './constants';
import type { Match, MatchPlayer, PlayerStats, UserProfile } from '@/lib/types/database';

/**
 * Format a date string to a human-readable format
 */
export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'America/Argentina/Buenos_Aires',
  }).format(new Date(dateString));
}

/**
 * Format a date string to include time
 */
export function formatDateTime(dateString: string): string {
  return new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'America/Argentina/Buenos_Aires',
  }).format(new Date(dateString));
}

/**
 * Get player's full display name
 */
export function getPlayerDisplayName(player: UserProfile): string {
  if (player.nickname) return player.nickname;
  return `${player.first_name} ${player.last_name}`.trim() || 'Sin nombre';
}

/**
 * Get initials for avatar
 */
export function getInitials(player: UserProfile): string {
  const first = player.first_name?.[0] || '';
  const last = player.last_name?.[0] || '';
  return (first + last).toUpperCase() || '?';
}

/**
 * Calculate stats for a single player from match data
 */
export function calculatePlayerStats(
  player: UserProfile,
  matches: Match[],
  matchPlayers: MatchPlayer[]
): PlayerStats {
  const playerMatches = matchPlayers.filter(
    (mp) => mp.player_id === player.id && mp.attended
  );

  let matchesPlayed = 0;
  let wins = 0;
  let draws = 0;
  let losses = 0;
  let goals = 0;

  playerMatches.forEach((mp) => {
    const match = matches.find((m) => m.id === mp.match_id);
    if (!match || match.status !== 'played') return;

    matchesPlayed++;
    goals += mp.goals;

    const playerTeamScore = mp.team === 'A' ? match.score_team_a : match.score_team_b;
    const opponentScore = mp.team === 'A' ? match.score_team_b : match.score_team_a;

    if (playerTeamScore > opponentScore) wins++;
    else if (playerTeamScore === opponentScore) draws++;
    else losses++;
  });

  return {
    player,
    matches_played: matchesPlayed,
    goals,
    wins,
    draws,
    losses,
    points: wins * POINTS.WIN + draws * POINTS.DRAW + losses * POINTS.LOSS,
  };
}

/**
 * Generate a color based on string (for avatar backgrounds)
 */
export function stringToColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = hash % 360;
  return `hsl(${hue}, 65%, 45%)`;
}

/**
 * Classify number with Spanish pluralization
 */
export function pluralize(count: number, singular: string, plural: string): string {
  return count === 1 ? `${count} ${singular}` : `${count} ${plural}`;
}
