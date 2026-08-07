import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/actions/auth';

export default async function NewMatchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  
  if (user?.role !== 'admin') {
    redirect('/matches');
  }

  return <>{children}</>;
}
