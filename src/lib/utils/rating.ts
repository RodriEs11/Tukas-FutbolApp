import type { PlayerStats } from '@/lib/types/database';

export const RATING_MIN_MATCHES = 3;

export type CardTier = 'unrated' | 'bronze' | 'silver' | 'gold' | 'elite';

export interface CardTierInfo {
  tier: CardTier;
  label: string;
  /** Primary accent color */
  color: string;
  /** Darker shade for secondary text */
  colorDark: string;
  /** Lighter shade for highlights */
  colorLight: string;
  /** Glow/shadow color with alpha */
  colorGlow: string;
  /** Background gradient start (dark) */
  bgStart: string;
  /** Background gradient end */
  bgEnd: string;
  /** Background gradient third stop */
  bgThird: string;
  /** Shine overlay RGB for radial gradients */
  shineRgb: string;
}

const TIER_THEMES: Record<CardTier, CardTierInfo> = {
  unrated: {
    tier: 'unrated',
    label: 'SIN CLASIFICAR',
    color: '#6b6b6b',
    colorDark: '#4a4a4a',
    colorLight: '#9a9a9a',
    colorGlow: 'rgba(107, 107, 107, 0.3)',
    bgStart: '#111111',
    bgEnd: '#1a1a1a',
    bgThird: '#141414',
    shineRgb: '150, 150, 150',
  },
  bronze: {
    tier: 'bronze',
    label: 'BRONCE',
    color: '#cd7f32',
    colorDark: '#a0622a',
    colorLight: '#e8a862',
    colorGlow: 'rgba(205, 127, 50, 0.4)',
    bgStart: '#1a1208',
    bgEnd: '#261c0e',
    bgThird: '#1e150a',
    shineRgb: '232, 168, 98',
  },
  silver: {
    tier: 'silver',
    label: 'PLATA',
    color: '#a8b4c0',
    colorDark: '#7d8d9e',
    colorLight: '#d0dae4',
    colorGlow: 'rgba(168, 180, 192, 0.4)',
    bgStart: '#121518',
    bgEnd: '#1c2028',
    bgThird: '#161a20',
    shineRgb: '208, 218, 228',
  },
  gold: {
    tier: 'gold',
    label: 'ORO',
    color: '#d4a853',
    colorDark: '#b8922e',
    colorLight: '#f0d68a',
    colorGlow: 'rgba(212, 168, 83, 0.4)',
    bgStart: '#1a1408',
    bgEnd: '#2a2010',
    bgThird: '#1e180d',
    shineRgb: '240, 214, 138',
  },
  elite: {
    tier: 'elite',
    label: 'ÉLITE',
    color: '#00d4ff',
    colorDark: '#0099bf',
    colorLight: '#80eaff',
    colorGlow: 'rgba(0, 212, 255, 0.4)',
    bgStart: '#080e14',
    bgEnd: '#0c1a28',
    bgThird: '#0a141e',
    shineRgb: '128, 234, 255',
  },
};

/**
 * Get the card tier info based on the rating value
 */
export function getCardTier(rating: number | null): CardTierInfo {
  if (rating === null) return TIER_THEMES.unrated;
  if (rating >= 85) return TIER_THEMES.elite;
  if (rating >= 75) return TIER_THEMES.gold;
  if (rating >= 60) return TIER_THEMES.silver;
  return TIER_THEMES.bronze;
}

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
