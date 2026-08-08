'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import type { UserProfile } from '@/lib/types/database';

export async function getPlayers(): Promise<UserProfile[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .order('first_name', { ascending: true });

  if (error) {
    console.error('Error fetching players:', error);
    return [];
  }

  return (data as UserProfile[]) || [];
}

export async function getPlayer(id: string): Promise<UserProfile | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching player:', error);
    return null;
  }

  return (data as UserProfile) ?? null;
}

export async function updatePlayer(formData: FormData) {
  const supabase = await createClient();

  const id = formData.get('id') as string;
  const firstName = formData.get('first_name') as string;
  const lastName = formData.get('last_name') as string;
  const nickname = formData.get('nickname') as string;
  const preferredFoot = formData.get('preferred_foot') as string;
  const position = formData.get('position') as string;

  const { error } = await supabase
    .from('user_profiles')
    .update({
      first_name: firstName,
      last_name: lastName,
      nickname: nickname || '',
      preferred_foot: preferredFoot || null,
      position: position || null,
    } as Record<string, unknown>)
    .eq('id', id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/players');
  revalidatePath(`/players/${id}`);
  return { success: true };
}

export async function addPlayer(formData: FormData) {
  const supabase = await createClient();

  const firstName = formData.get('first_name') as string;
  const lastName = formData.get('last_name') as string;
  const nickname = formData.get('nickname') as string;
  const preferredFoot = formData.get('preferred_foot') as string;
  const position = formData.get('position') as string;

  const { error } = await supabase
    .from('user_profiles')
    .insert({
      first_name: firstName,
      last_name: lastName,
      nickname: nickname || '',
      role: 'player',
      preferred_foot: preferredFoot || null,
      position: position || null,
    } as Record<string, unknown>);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/players');
  return { success: true };
}
