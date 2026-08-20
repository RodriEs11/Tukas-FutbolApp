'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import type { Match } from '@/lib/types/database';
import { assignPitchPositionsBatch } from '@/lib/utils/pitchPositioning';

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

export async function getPlayerMatches(playerId: string): Promise<Match[]> {
  const supabase = await createClient();

  const { data: playerMatchesData, error: pmError } = await supabase
    .from('match_players')
    .select('match_id')
    .eq('player_id', playerId);

  if (pmError || !playerMatchesData) {
    console.error('Error fetching player matches IDs:', pmError);
    return [];
  }

  const matchIds = playerMatchesData.map(pm => pm.match_id);

  if (matchIds.length === 0) return [];

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
    .in('id', matchIds)
    .order('match_date', { ascending: false });

  if (error) {
    console.error('Error fetching player matches:', error);
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

  const matchDate = formData.get('match_date') as string;
  const notes = formData.get('notes') as string;

  // Fetch the single field to auto-assign
  const { data: fieldData } = await supabase
    .from('fields')
    .select('id')
    .limit(1)
    .single();

  const fieldId = fieldData?.id || null;

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
  revalidatePath(`/matches/${id}`);
  revalidatePath('/valla-menos-vencida');
  return { success: true };
}

export async function updateMatchDate(id: string, matchDate: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('matches')
    .update({ match_date: matchDate })
    .eq('id', id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/matches');
  revalidatePath(`/matches/${id}`);
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
  const result = await addPlayersToMatch(matchId, [playerId], team);
  if (result.error) {
    return { error: result.error };
  }
  return { success: true };
}

export async function addPlayersToMatch(matchId: string, playerIds: string[], team: 'A' | 'B') {
  const supabase = await createClient();

  const { data: existingPlayers } = await supabase
    .from('match_players')
    .select('player_id')
    .eq('match_id', matchId)
    .in('player_id', playerIds);

  const existingIds = existingPlayers?.map((p) => p.player_id) || [];
  const newPlayerIds = playerIds.filter((id) => !existingIds.includes(id));

  if (newPlayerIds.length === 0) {
    return { error: 'Todos los jugadores seleccionados ya están en un equipo.' };
  }

  // Get occupied pitch positions in this team
  const { data: teamPlayers } = await supabase
    .from('match_players')
    .select('pitch_position')
    .eq('match_id', matchId)
    .eq('team', team);

  const occupiedPositions = teamPlayers?.map((tp) => tp.pitch_position) || [];

  // Fetch player profile data to assign positions based on their preferences
  const { data: profiles } = await supabase
    .from('user_profiles')
    .select('id, position, preferred_foot')
    .in('id', newPlayerIds);

  const orderedProfiles = newPlayerIds.map((id) => {
    const prof = profiles?.find((p) => p.id === id);
    return {
      id,
      position: prof?.position,
      preferred_foot: prof?.preferred_foot,
    };
  });

  const positionAssignments = assignPitchPositionsBatch(orderedProfiles, occupiedPositions);

  const payload = newPlayerIds.map((playerId) => ({
    match_id: matchId,
    player_id: playerId,
    team,
    goals: 0,
    attended: true,
    pitch_position: positionAssignments.get(playerId) || null,
  }));

  const { error } = await supabase
    .from('match_players')
    .insert(payload as Record<string, unknown>[]);

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/matches/${matchId}`);
  
  return { 
    success: true, 
    addedCount: newPlayerIds.length,
    duplicatesCount: existingIds.length 
  };
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
  revalidatePath('/scorers');
  revalidatePath('/valla-menos-vencida');
  return { success: true };
}

export async function setTeamGoalkeeper(matchId: string, team: 'A' | 'B', playerId: string) {
  const supabase = await createClient();

  // Find existing goalkeeper in this team
  const { data: teamPlayers, error: fetchError } = await supabase
    .from('match_players')
    .select('id, player_id, pitch_position')
    .eq('match_id', matchId)
    .eq('team', team);

  if (fetchError || !teamPlayers) {
    return { error: fetchError?.message || 'Error al obtener jugadores del equipo' };
  }

  const updates: { id: string; pitch_position: string | null }[] = [];

  teamPlayers.forEach((mp) => {
    if (mp.player_id === playerId) {
      // Set to 'gk'
      if (mp.pitch_position !== 'gk') {
        updates.push({ id: mp.id, pitch_position: 'gk' });
      }
    } else if (mp.pitch_position === 'gk') {
      // Remove 'gk' from previous goalkeeper in this team
      updates.push({ id: mp.id, pitch_position: null });
    }
  });

  if (updates.length > 0) {
    const promises = updates.map((u) =>
      supabase
        .from('match_players')
        .update({ pitch_position: u.pitch_position } as Record<string, unknown>)
        .eq('id', u.id)
    );
    const results = await Promise.all(promises);
    const hasError = results.some((res) => res.error);
    if (hasError) {
      const err = results.find((res) => res.error)?.error;
      return { error: err?.message || 'Error al asignar arquero' };
    }
  }

  revalidatePath('/matches');
  revalidatePath(`/matches/${matchId}`);
  revalidatePath('/valla-menos-vencida');
  return { success: true };
}

export async function updateMatchPlayerPosition(id: string, pitchPosition: string | null) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('match_players')
    .update({ pitch_position: pitchPosition } as Record<string, unknown>)
    .eq('id', id);

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}

export async function updateMatchPlayersBulk(updates: { id: string; pitch_position: string | null }[], matchId?: string) {
  const supabase = await createClient();

  // Supabase update many is tricky without a custom RPC, but we can loop since it's only up to 8 players.
  // We can do Promise.all
  const promises = updates.map(update => 
    supabase
      .from('match_players')
      .update({ pitch_position: update.pitch_position } as Record<string, unknown>)
      .eq('id', update.id)
  );

  const results = await Promise.all(promises);
  
  const hasError = results.some(res => res.error);
  if (hasError) {
    const error = results.find(res => res.error)?.error;
    return { error: error?.message || 'Error updating positions' };
  }

  revalidatePath('/matches');
  if (matchId) {
    revalidatePath(`/matches/${matchId}`);
  }
  return { success: true };
}

export async function cancelMatch(matchId: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('matches')
    .update({
      status: 'cancelled',
    } as Record<string, unknown>)
    .eq('id', matchId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/matches');
  revalidatePath(`/matches/${matchId}`);
  revalidatePath('/dashboard');
  revalidatePath('/valla-menos-vencida');
  return { success: true };
}
