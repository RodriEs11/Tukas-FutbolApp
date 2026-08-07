import { PageContainer } from '@/components/layout/PageContainer';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { getCurrentUser } from '@/lib/actions/auth';
import { getPlayerStats } from '@/lib/actions/stats';
import { logout } from '@/lib/actions/auth';
import { redirect } from 'next/navigation';
import {
  LogOut,
  Trophy,
  Target,
  Medal,
  Swords,
} from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mi Perfil',
};

export default async function ProfilePage() {
  const user = await getCurrentUser();

  if (!user) redirect('/login');

  const stats = await getPlayerStats(user.id);

  return (
    <PageContainer>
      <div className="animate-fade-in">
        {/* Profile Header */}
        <div className="flex flex-col items-center mb-8">
          <Avatar player={user} size="lg" className="mb-3" />
          <h2 className="text-2xl font-bold text-foreground tracking-tight">
            {user.first_name} {user.last_name}
          </h2>
          {user.nickname && (
            <p className="text-muted-foreground text-sm mt-0.5">
              &quot;{user.nickname}&quot;
            </p>
          )}
          <Badge
            variant={user.role === 'admin' ? 'warning' : 'success'}
            className="mt-2"
          >
            {user.role === 'admin' ? 'Administrador' : 'Jugador'}
          </Badge>
        </div>

        {/* Stats */}
        {stats && stats.matches_played > 0 && (
          <div className="grid grid-cols-2 gap-3 mb-6 animate-slide-up">
            <Card className="text-center">
              <div className="flex flex-col items-center gap-1 py-1">
                <Swords size={18} className="text-info" />
                <span className="text-2xl font-bold text-foreground">{stats.matches_played}</span>
                <span className="text-xs text-muted-foreground">Partidos</span>
              </div>
            </Card>
            <Card className="text-center stat-glow">
              <div className="flex flex-col items-center gap-1 py-1">
                <Target size={18} className="text-accent" />
                <span className="text-2xl font-bold text-foreground">{stats.goals}</span>
                <span className="text-xs text-muted-foreground">Goles</span>
              </div>
            </Card>
            <Card className="text-center">
              <div className="flex flex-col items-center gap-1 py-1">
                <Trophy size={18} className="text-warning" />
                <span className="text-2xl font-bold text-foreground">{stats.wins}</span>
                <span className="text-xs text-muted-foreground">Victorias</span>
              </div>
            </Card>
            <Card className="text-center">
              <div className="flex flex-col items-center gap-1 py-1">
                <Medal size={18} className="text-purple-400" />
                <span className="text-2xl font-bold text-foreground">{stats.points}</span>
                <span className="text-xs text-muted-foreground">Puntos</span>
              </div>
            </Card>
          </div>
        )}

        {/* Logout */}
        <form action={logout}>
          <Button type="submit" variant="danger" fullWidth>
            <LogOut size={16} />
            Cerrar sesión
          </Button>
        </form>
      </div>
    </PageContainer>
  );
}

