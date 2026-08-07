'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import type { Match } from '@/lib/types/database';

export async function getMatches(): Promise<Match[]> {
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
    .order('match_date', { ascending: false });

  if (error) {
    console.error('Error fetching matches:', error);
    return [];
  }

  return (data as unknown as Match[]) || [];
}

export async function getMatch(id: string): Promise<Match | null> {
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
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching match:', error);
    return null;
  }

  return (data as unknown as Match) ?? null;
}

export async function createMatch(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: 'No autorizado' };

  const fieldId = formData.get('field_id') as string;
  const matchDate = formData.get('match_date') as string;
  const notes = formData.get('notes') as string;

  const { data, error } = await supabase
    .from('matches')
    .insert({
      field_id: fieldId || null,
      match_date: matchDate,
      status: 'scheduled',
      score_team_a: 0,
      score_team_b: 0,
      notes: notes || '',
      created_by: user.id,
    } as Record<string, unknown>)
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/matches');
  return { success: true, data };
}

export async function updateMatch(formData: FormData) {
  const supabase = await createClient();

  const id = formData.get('id') as string;
  const status = formData.get('status') as string;
  const scoreTeamA = parseInt(formData.get('score_team_a') as string) || 0;
  const scoreTeamB = parseInt(formData.get('score_team_b') as string) || 0;
  const notes = formData.get('notes') as string;

  const { error } = await supabase
    .from('matches')
    .update({
      status,
      score_team_a: scoreTeamA,
      score_team_b: scoreTeamB,
      notes: notes || '',
    } as Record<string, unknown>)
    .eq('id', id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/matches');
  return { success: true };
}

export async function deleteMatch(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from('matches').delete().eq('id', id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/matches');
  return { success: true };
}

export async function addPlayerToMatch(matchId: string, playerId: string, team: 'A' | 'B') {
  const supabase = await createClient();

  const { error } = await supabase
    .from('match_players')
    .insert({
      match_id: matchId,
      player_id: playerId,
      team,
      goals: 0,
      attended: true,
    } as Record<string, unknown>);

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/matches/${matchId}`);
  return { success: true };
}

export async function updateMatchPlayer(formData: FormData) {
  const supabase = await createClient();

  const id = formData.get('id') as string;
  const goals = parseInt(formData.get('goals') as string) || 0;
  const attended = formData.get('attended') === 'true';

  const { error } = await supabase
    .from('match_players')
    .update({ goals, attended } as Record<string, unknown>)
    .eq('id', id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/matches');
  return { success: true };
}

export async function removePlayerFromMatch(matchId: string, playerId: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('match_players')
    .delete()
    .eq('match_id', matchId)
    .eq('player_id', playerId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/matches/${matchId}`);
  return { success: true };
}

export async function finishMatch(matchId: string) {
  const supabase = await createClient();

  // Get all match players to calculate score
  const { data: matchPlayers, error: fetchError } = await supabase
    .from('match_players')
    .select('team, goals')
    .eq('match_id', matchId);

  if (fetchError) {
    return { error: fetchError.message };
  }

  const scoreTeamA = matchPlayers
    .filter((mp) => mp.team === 'A')
    .reduce((sum, mp) => sum + (mp.goals || 0), 0);
    
  const scoreTeamB = matchPlayers
    .filter((mp) => mp.team === 'B')
    .reduce((sum, mp) => sum + (mp.goals || 0), 0);

  const { error } = await supabase
    .from('matches')
    .update({
      status: 'played',
      score_team_a: scoreTeamA,
      score_team_b: scoreTeamB,
    } as Record<string, unknown>)
    .eq('id', matchId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/matches');
  revalidatePath(`/matches/${matchId}`);
  revalidatePath('/dashboard');
  revalidatePath('/players');
  return { success: true };
}
