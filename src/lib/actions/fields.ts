'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import type { Field } from '@/lib/types/database';

export async function getFields(): Promise<Field[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('fields')
    .select('*')
    .eq('is_active', true)
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching fields:', error);
    return [];
  }

  return (data as Field[]) || [];
}

export async function createField(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: 'No autorizado' };

  const name = formData.get('name') as string;
  const location = formData.get('location') as string;
  const surfaceType = formData.get('surface_type') as string;
  const description = formData.get('description') as string;

  const { error } = await supabase
    .from('fields')
    .insert({
      name,
      location: location || '',
      surface_type: surfaceType || 'césped',
      description: description || '',
      is_active: true,
      created_by: user.id,
    } as Record<string, unknown>);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/fields');
  return { success: true };
}

export async function updateField(formData: FormData) {
  const supabase = await createClient();

  const id = formData.get('id') as string;
  const name = formData.get('name') as string;
  const location = formData.get('location') as string;
  const surfaceType = formData.get('surface_type') as string;
  const description = formData.get('description') as string;

  const { error } = await supabase
    .from('fields')
    .update({
      name,
      location: location || '',
      surface_type: surfaceType,
      description: description || '',
    } as Record<string, unknown>)
    .eq('id', id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/fields');
  return { success: true };
}

export async function deleteField(id: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('fields')
    .update({ is_active: false } as Record<string, unknown>)
    .eq('id', id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/fields');
  return { success: true };
}
