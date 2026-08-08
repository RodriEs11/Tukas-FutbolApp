'use server';

import { createClient } from '@/lib/supabase/server';
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

