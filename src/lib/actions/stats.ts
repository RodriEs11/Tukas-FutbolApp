'use server';

import { createClient } from '@/lib/supabase/server';
import { calculatePlayerStats } from '@/lib/utils/helpers';
import type { PlayerStats, UserProfile, Match, MatchPlayer } from '@/lib/types/database';

export async function getLeaderboard(): Promise<PlayerStats[]> {
  const supabase = await createClient();

  // Fetch all players
  const { data: players } = await supabase
    .from('user_profiles')
    .select('*');

  // Fetch all played matches
  const { data: matches } = await supabase
    .from('matches')
    .select('*')
    .eq('status', 'played');

  // Fetch all match_players
  const { data: matchPlayers } = await supabase
    .from('match_players')
    .select('*');

  if (!players || !matches || !matchPlayers) return [];

  // Calculate stats for each player
  const stats = (players as UserProfile[]).map((player) =>
    calculatePlayerStats(
      player,
      matches as unknown as Match[],
      matchPlayers as unknown as MatchPlayer[]
    )
  );

  // Sort by points (desc), then by goals (desc)
  return stats
    .filter((s) => s.matches_played > 0)
    .sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      return b.goals - a.goals;
    });
}

export async function getPlayerStats(playerId: string): Promise<PlayerStats | null> {
  const supabase = await createClient();

  const { data: player } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', playerId)
    .single();

  if (!player) return null;

  const { data: matches } = await supabase
    .from('matches')
    .select('*')
    .eq('status', 'played');

  const { data: matchPlayers } = await supabase
    .from('match_players')
    .select('*');

  if (!matches || !matchPlayers) return null;

  return calculatePlayerStats(
    player as UserProfile,
    matches as unknown as Match[],
    matchPlayers as unknown as MatchPlayer[]
  );
}

export async function getTopScorers(limit = 5): Promise<PlayerStats[]> {
  const leaderboard = await getLeaderboard();
  return leaderboard.sort((a, b) => b.goals - a.goals).slice(0, limit);
}

export async function getUpcomingMatches(limit = 5): Promise<Match[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('matches')
    .select(`
      *,
      field:fields(*),
      match_players(
        *,
        player:user_profiles(*)
      )
    `)
    .eq('status', 'scheduled')
    .gte('match_date', new Date().toISOString())
    .order('match_date', { ascending: true })
    .limit(limit);

  if (error) {
    console.error('Error fetching upcoming matches:', error);
    return [];
  }

  return (data as unknown as Match[]) || [];
}
