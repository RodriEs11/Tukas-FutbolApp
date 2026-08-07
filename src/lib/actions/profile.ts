'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function updateProfileBasicInfo(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'No autorizado' };

  const firstName = formData.get('first_name') as string;
  const lastName = formData.get('last_name') as string;
  const nickname = formData.get('nickname') as string;

  const { error } = await supabase
    .from('user_profiles')
    .update({ first_name: firstName, last_name: lastName, nickname })
    .eq('id', user.id);

  if (error) return { error: error.message };

  await supabase.auth.updateUser({
    data: { first_name: firstName, last_name: lastName, nickname },
  });

  revalidatePath('/', 'layout');
  return { success: true };
}

export async function updateEmail(formData: FormData) {
  const supabase = await createClient();
  const email = formData.get('email') as string;
  
  if (!email) return { error: 'El email es requerido' };

  const { error } = await supabase.auth.updateUser({ email });
  if (error) return { error: error.message };
  
  return { success: true, message: 'Revisa tu correo para confirmar el cambio.' };
}

export async function updatePassword(formData: FormData) {
  const supabase = await createClient();
  const currentPassword = formData.get('current_password') as string;
  const newPassword = formData.get('new_password') as string;

  if (!currentPassword || !newPassword) return { error: 'Faltan datos' };

  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.email) return { error: 'No autorizado' };

  // Verificamos la contraseña actual
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: currentPassword,
  });

  if (signInError) {
    return { error: 'La contraseña actual es incorrecta' };
  }

  // Si es correcta, actualizamos
  const { error: updateError } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (updateError) return { error: updateError.message };

  return { success: true };
}

export async function uploadAvatar(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'No autorizado' };

  const file = formData.get('avatar') as File;
  if (!file || file.size === 0) return { error: 'Archivo no válido' };

  const fileExt = file.name.split('.').pop();
  const fileName = `${user.id}-${Date.now()}.${fileExt}`;
  const filePath = `${fileName}`; 

  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(filePath, file, { upsert: true });

  if (uploadError) return { error: uploadError.message };

  const { data: { publicUrl } } = supabase.storage
    .from('avatars')
    .getPublicUrl(filePath);

  const { error: updateError } = await supabase
    .from('user_profiles')
    .update({ avatar_url: publicUrl })
    .eq('id', user.id);

  if (updateError) return { error: updateError.message };

  revalidatePath('/', 'layout');
  return { success: true, avatar_url: publicUrl };
}
