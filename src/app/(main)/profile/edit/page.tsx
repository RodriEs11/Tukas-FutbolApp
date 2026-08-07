import { PageContainer } from '@/components/layout/PageContainer';
import { getCurrentUser } from '@/lib/actions/auth';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { EditProfileForm } from './EditProfileForm';
import { BackButton } from '@/components/ui/BackButton';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Editar Perfil',
};

export default async function EditProfilePage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch the email since it's not stored in the user_profiles table directly
  const supabase = await createClient();
  const { data: { user: authUser } } = await supabase.auth.getUser();

  const userWithEmail = {
    ...user,
    email: authUser?.email,
  };

  return (
    <PageContainer>
      <div className="animate-fade-in max-w-lg mx-auto pb-10">
        <BackButton fallbackHref="/profile" />
        
        <div className="flex items-center mb-6">
          <h2 className="text-2xl font-bold text-foreground tracking-tight">
            Editar Perfil
          </h2>
        </div>
        
        <EditProfileForm user={userWithEmail} />
      </div>
    </PageContainer>
  );
}
