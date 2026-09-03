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
 * Points awarded to goalkeepers based on goals conceded in a match:
 * 0 goals -> 10 pts
 * 1 goal  -> 8 pts
 * 2 goals -> 6 pts
 * 3 goals -> 4 pts
 * 4 goals -> 2 pts
 * 5+ goals -> 0 pts
 */
export function getGoalkeeperMatchPoints(goalsConceded: number): number {
  if (goalsConceded <= 0) return 10;
  if (goalsConceded === 1) return 8;
  if (goalsConceded === 2) return 6;
  if (goalsConceded === 3) return 4;
  if (goalsConceded === 4) return 2;
  return 0;
}

/**
 * Check if a player profile indicates a goalkeeper position
 */
export function isGoalkeeper(position?: string | null): boolean {
  if (!position) return false;
  const norm = position.toLowerCase().trim();
  return norm === 'arquero' || norm === 'portero' || norm === 'goalkeeper';
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

  // Goalkeeper specific accumulators
  let matchesAsGk = 0;
  let cleanSheets = 0;
  let totalGkPoints = 0;

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

    // Calculate GK stats if the player played as goalkeeper in this match
    if (mp.pitch_position === 'gk') {
      matchesAsGk++;
      const conceded = opponentScore || 0;
      if (conceded === 0) {
        cleanSheets++;
      }
      totalGkPoints += getGoalkeeperMatchPoints(conceded);
    }
  });

  const cleanSheetPointsAvg =
    matchesAsGk > 0 ? Number((totalGkPoints / matchesAsGk).toFixed(1)) : 0;

  return {
    player,
    matches_played: matchesPlayed,
    goals,
    wins,
    draws,
    losses,
    points: wins * POINTS.WIN + draws * POINTS.DRAW + losses * POINTS.LOSS,
    matches_as_gk: matchesAsGk,
    clean_sheets: cleanSheets,
    clean_sheet_points_avg: cleanSheetPointsAvg,
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
