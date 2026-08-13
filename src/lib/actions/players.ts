'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import type { UserProfile } from '@/lib/types/database';

export async function getPlayers(): Promise<UserProfile[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('is_active', true)
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
  const avatar = formData.get('avatar') as File | null;
  const removeAvatar = formData.get('remove_avatar') === 'true';
  const oldAvatarUrl = formData.get('old_avatar_url') as string;

  let newAvatarUrl: string | null | undefined = undefined;

  if (removeAvatar) {
    newAvatarUrl = null;
    if (oldAvatarUrl) {
      try {
        const urlParts = oldAvatarUrl.split('/');
        const fileName = urlParts[urlParts.length - 1];
        if (fileName) {
          await supabase.storage.from('avatars').remove([fileName]);
        }
      } catch (err) {
        console.error('Error removing old avatar:', err);
      }
    }
  } else if (avatar && avatar.size > 0) {
    const fileExt = avatar.name.split('.').pop();
    const fileName = `${id}-${Date.now()}.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(fileName, avatar, { upsert: true });
      
    if (!uploadError) {
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);
      newAvatarUrl = publicUrl;
    }
  }

  const updateData: Record<string, unknown> = {
    first_name: firstName,
    last_name: lastName,
    nickname: nickname || '',
    preferred_foot: preferredFoot || null,
    position: position || null,
  };

  if (newAvatarUrl !== undefined) {
    updateData.avatar_url = newAvatarUrl;
  }

  const { error } = await supabase
    .from('user_profiles')
    .update(updateData)
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
  const avatar = formData.get('avatar') as File | null;

  const { data: newPlayer, error } = await supabase
    .from('user_profiles')
    .insert({
      first_name: firstName,
      last_name: lastName,
      nickname: nickname || '',
      role: 'player',
      preferred_foot: preferredFoot || null,
      position: position || null,
    } as Record<string, unknown>)
    .select('id')
    .single();

  if (error) {
    return { error: error.message };
  }

  if (newPlayer && avatar && avatar.size > 0) {
    const fileExt = avatar.name.split('.').pop();
    const fileName = `${newPlayer.id}-${Date.now()}.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(fileName, avatar, { upsert: true });
      
    if (!uploadError) {
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);
        
      await supabase
        .from('user_profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', newPlayer.id);
    }
  }

  revalidatePath('/players');
  return { success: true };
}

export async function deletePlayer(id: string) {
  const supabase = await createClient();

  // Validate that the player exists and is not an admin
  const { data: playerToVerify, error: fetchError } = await supabase
    .from('user_profiles')
    .select('role')
    .eq('id', id)
    .single();

  if (fetchError || !playerToVerify) {
    return { error: 'No se pudo encontrar el jugador.' };
  }

  if (playerToVerify.role === 'admin') {
    return { error: 'No se puede eliminar a un administrador.' };
  }

  const { error } = await supabase
    .from('user_profiles')
    .update({ is_active: false })
    .eq('id', id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/players');
  return { success: true };
}
