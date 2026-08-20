'use server';

import { createClient } from '@/lib/supabase/server';
import { calculatePlayerStats } from '@/lib/utils/helpers';
import type { PlayerStats, ScorerStat, UserProfile, Match, MatchPlayer, PaternityStat, GoalkeeperStat } from '@/lib/types/database';

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

export async function getLastMatch(): Promise<Match | null> {
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
    .or(`status.eq.played,match_date.lt.${new Date().toISOString()}`)
    .order('match_date', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error('Error fetching last match:', error.message || error);
    return null;
  }

  return (data as unknown as Match) ?? null;
}

export async function getMaxMatchesPlayed(): Promise<number> {
  const leaderboard = await getLeaderboard();
  if (leaderboard.length === 0) return 0;
  return Math.max(...leaderboard.map((s) => s.matches_played));
}

export async function getScorersStats(): Promise<ScorerStat[]> {
  const supabase = await createClient();

  // Fetch all players
  const { data: players } = await supabase
    .from('user_profiles')
    .select('*');

  // Fetch all played matches
  const { data: matches } = await supabase
    .from('matches')
    .select('id, status')
    .eq('status', 'played');

  // Fetch all match_players
  const { data: matchPlayers } = await supabase
    .from('match_players')
    .select('player_id, match_id, goals, attended');

  if (!players || !matches || !matchPlayers) return [];

  const playedMatchIds = new Set(matches.map((m) => m.id));

  // Calculate stats for each player
  const scorersMap = new Map<string, ScorerStat>();

  (players as UserProfile[]).forEach((player) => {
    scorersMap.set(player.id, {
      player,
      matches_played: 0,
      goals: 0,
      goals_per_match: 0,
    });
  });

  matchPlayers.forEach((mp) => {
    if (mp.attended && playedMatchIds.has(mp.match_id)) {
      const stats = scorersMap.get(mp.player_id);
      if (stats) {
        stats.matches_played += 1;
        stats.goals += mp.goals || 0;
      }
    }
  });

  const scorers = Array.from(scorersMap.values()).filter(s => s.matches_played > 0);

  scorers.forEach(s => {
    s.goals_per_match = s.matches_played > 0 ? Number((s.goals / s.matches_played).toFixed(2)) : 0;
  });

  // Sort by goals (desc), then matches_played (desc), then goals_per_match (desc)
  return scorers.sort((a, b) => {
    if (b.goals !== a.goals) return b.goals - a.goals;
    if (b.matches_played !== a.matches_played) return b.matches_played - a.matches_played;
    return b.goals_per_match - a.goals_per_match;
  });
}

export async function getPaternities(): Promise<PaternityStat[]> {
  const supabase = await createClient();

  const { data: players } = await supabase
    .from('user_profiles')
    .select('*');

  const { data: paternities } = await supabase
    .from('paternities')
    .select('*');

  if (!players || !paternities) return [];

  const playersMap = new Map<string, UserProfile>();
  players.forEach((p) => playersMap.set(p.id, p as UserProfile));

  const paternitiesMap = new Map<string, PaternityStat>();

  paternities.forEach((p) => {
    const father = playersMap.get(p.father_id);
    const son = playersMap.get(p.son_id);
    
    if (father && son) {
      if (!paternitiesMap.has(father.id)) {
        paternitiesMap.set(father.id, {
          father,
          sons: []
        });
      }
      
      const fatherStat = paternitiesMap.get(father.id)!;
      fatherStat.sons.push({
        son,
        net_wins: p.net_wins
      });
    }
  });

  const result = Array.from(paternitiesMap.values());
  
  // Sort by number of sons (desc), then by total net wins (desc)
  result.sort((a, b) => {
    if (b.sons.length !== a.sons.length) {
      return b.sons.length - a.sons.length;
    }
    const totalWinsA = a.sons.reduce((acc, son) => acc + son.net_wins, 0);
    const totalWinsB = b.sons.reduce((acc, son) => acc + son.net_wins, 0);
    return totalWinsB - totalWinsA;
  });

  // Sort sons within each father by net wins (desc)
  result.forEach(stat => {
    stat.sons.sort((a, b) => b.net_wins - a.net_wins);
  });

  return result;
}

export async function getGoalkeeperStats(): Promise<GoalkeeperStat[]> {
  const supabase = await createClient();

  // Fetch all players
  const { data: players } = await supabase
    .from('user_profiles')
    .select('*');

  // Fetch all played matches
  const { data: matches } = await supabase
    .from('matches')
    .select('id, status, score_team_a, score_team_b')
    .eq('status', 'played');

  // Fetch all match_players
  const { data: matchPlayers } = await supabase
    .from('match_players')
    .select('player_id, match_id, team, attended, pitch_position');

  if (!players || !matches || !matchPlayers) return [];

  const totalPlayedMatches = matches.length;
  // Threshold: 30% of total played matches (minimum 3)
  const minMatchesRequired = Math.max(3, Math.ceil(totalPlayedMatches * 0.3));

  const playedMatchesMap = new Map<string, { id: string; score_team_a: number; score_team_b: number }>();
  matches.forEach((m) => {
    playedMatchesMap.set(m.id, m);
  });

  const goalkeepersMap = new Map<string, GoalkeeperStat>();

  (players as UserProfile[]).forEach((player) => {
    goalkeepersMap.set(player.id, {
      player,
      matches_as_gk: 0,
      goals_conceded: 0,
      clean_sheets: 0,
      average_goals_conceded: 0,
      is_eligible: false,
      min_matches_required: minMatchesRequired,
    });
  });

  matchPlayers.forEach((mp) => {
    // Only count if attended, positioned as goalkeeper ('gk'), and match is played
    if (mp.attended && mp.pitch_position === 'gk' && playedMatchesMap.has(mp.match_id)) {
      const match = playedMatchesMap.get(mp.match_id)!;
      const stats = goalkeepersMap.get(mp.player_id);
      
      if (stats) {
        stats.matches_as_gk += 1;
        // The goals received by the goalkeeper are the goals scored by the opponent team
        const conceded = mp.team === 'A' ? (match.score_team_b || 0) : (match.score_team_a || 0);
        stats.goals_conceded += conceded;
        if (conceded === 0) {
          stats.clean_sheets += 1;
        }
      }
    }
  });

  const activeGoalkeepers = Array.from(goalkeepersMap.values()).filter((gk) => gk.matches_as_gk > 0);

  activeGoalkeepers.forEach((gk) => {
    gk.average_goals_conceded = gk.matches_as_gk > 0
      ? Number((gk.goals_conceded / gk.matches_as_gk).toFixed(2))
      : 0;
    gk.is_eligible = gk.matches_as_gk >= minMatchesRequired;
    gk.min_matches_required = minMatchesRequired;
  });

  // Sort criteria:
  // 1° Lowest average goals conceded per match (ascending)
  // 2° Most clean sheets (descending)
  // 3° Most matches as goalkeeper (descending)
  const compareGk = (a: GoalkeeperStat, b: GoalkeeperStat) => {
    if (a.average_goals_conceded !== b.average_goals_conceded) {
      return a.average_goals_conceded - b.average_goals_conceded;
    }
    if (b.clean_sheets !== a.clean_sheets) {
      return b.clean_sheets - a.clean_sheets;
    }
    return b.matches_as_gk - a.matches_as_gk;
  };

  const eligible = activeGoalkeepers.filter((gk) => gk.is_eligible).sort(compareGk);
  const ineligible = activeGoalkeepers.filter((gk) => !gk.is_eligible).sort(compareGk);

  return [...eligible, ...ineligible];
}
