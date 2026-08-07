import type { PlayerStats } from '@/lib/types/database';

export const RATING_MIN_MATCHES = 3;

/**
 * Calculates a player's rating (media) for FIFA-style player cards based on their stats.
 *
 * @param stats Player statistics
 * @param maxMatchesInGroup The maximum number of matches played by any player in the group/league
 * @returns Rating between 1 and 99, or null if player hasn't played minimum matches or maxMatchesInGroup <= 0
 */
export function calculatePlayerRating(
  stats: PlayerStats,
  maxMatchesInGroup: number
): number | null {
  if (stats.matches_played < RATING_MIN_MATCHES || maxMatchesInGroup <= 0) {
    return null;
  }

  const winRate = stats.wins / stats.matches_played;
  const winComponent = winRate * 45;

  const golesPerMatch = stats.goals / stats.matches_played;
  const goalComponent = Math.min(golesPerMatch * 15, 30);

  const regularidad = stats.matches_played / maxMatchesInGroup;
  const regularityComponent = regularidad * 25;

  const rawRating = winComponent + goalComponent + regularityComponent;

  return Math.max(1, Math.min(99, Math.round(rawRating)));
}
