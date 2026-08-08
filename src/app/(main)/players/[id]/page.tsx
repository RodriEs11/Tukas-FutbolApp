import { PageContainer } from '@/components/layout/PageContainer';
import { Card } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { getPlayer } from '@/lib/actions/players';
import { getPlayerStats } from '@/lib/actions/stats';
import { getPlayerMatches } from '@/lib/actions/matches';
import { getCurrentUser } from '@/lib/actions/auth';
import { getPlayerDisplayName } from '@/lib/utils/helpers';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  Trophy,
  Target,
  TrendingUp,
  Medal,
  Percent,
  Swords,
  Star,
} from 'lucide-react';
import { BackButton } from '@/components/ui/BackButton';
import { PlayerMatchList } from '@/components/players/PlayerMatchList';
import { EditPlayerModal } from '@/components/players/EditPlayerModal';
import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const player = await getPlayer(id);
  if (!player) return { title: 'Jugador no encontrado' };
  return { title: getPlayerDisplayName(player) };
}

export default async function PlayerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [player, stats, matches, currentUser] = await Promise.all([
    getPlayer(id),
    getPlayerStats(id),
    getPlayerMatches(id),
    getCurrentUser(),
  ]);

  if (!player) notFound();

  const isAdmin = currentUser?.role === 'admin';

  const winRate =
    stats && stats.matches_played > 0
      ? Math.round((stats.wins / stats.matches_played) * 100)
      : 0;

  return (
    <PageContainer>
      {/* Top bar: Back + Actions */}
      <div className="flex items-center justify-between mb-6">
        <BackButton fallbackHref="/players" className="" />
        <div className="flex items-center gap-2">
          {isAdmin && <EditPlayerModal player={player} />}
          <Link
            href={`/players/${id}/card`}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg border transition-all duration-200 hover:shadow-[0_0_16px_-4px_rgba(212,168,83,0.4)]"
            style={{
              color: '#d4a853',
              backgroundColor: 'rgba(212, 168, 83, 0.1)',
              borderColor: 'rgba(212, 168, 83, 0.3)',
            }}
          >
            <Star size={14} />
            Ver Carta
          </Link>
        </div>
      </div>

      {/* Player Header */}
      <div className="flex flex-col items-center mb-8 animate-fade-in">
        <Avatar player={player} size="lg" className="mb-3" />
        <h2 className="text-2xl font-bold text-foreground tracking-tight">
          {player.first_name} {player.last_name}
        </h2>
        {player.nickname && (
          <p className="text-muted-foreground text-sm mt-0.5">
            &quot;{player.nickname}&quot;
          </p>
        )}
        <div className="flex items-center gap-2 mt-3">
          <Badge variant={player.role === 'admin' ? 'warning' : 'success'}>
            {player.role === 'admin' ? 'Administrador' : 'Jugador'}
          </Badge>
          {player.position && (
            <Badge variant="info">
              {player.position}
            </Badge>
          )}
          {player.preferred_foot && (
            <Badge variant="default">
              Pierna {player.preferred_foot}
            </Badge>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      {stats ? (
        <div className="space-y-4 animate-slide-up">
          {/* Main Stats */}
          <div className="grid grid-cols-3 gap-3">
            <Card className="text-center">
              <div className="flex flex-col items-center gap-1 py-1">
                <Swords size={18} className="text-sky-400" />
                <span className="text-2xl font-bold text-foreground">
                  {stats.matches_played}
                </span>
                <span className="text-xs text-muted-foreground">PJ</span>
              </div>
            </Card>
            <Card className="text-center stat-glow">
              <div className="flex flex-col items-center gap-1 py-1">
                <Target size={18} className="text-emerald-400" />
                <span className="text-2xl font-bold text-foreground">
                  {stats.goals}
                </span>
                <span className="text-xs text-muted-foreground">Goles</span>
              </div>
            </Card>
            <Card className="text-center">
              <div className="flex flex-col items-center gap-1 py-1">
                <Medal size={18} className="text-amber-400" />
                <span className="text-2xl font-bold text-foreground">
                  {stats.points}
                </span>
                <span className="text-xs text-muted-foreground">Pts</span>
              </div>
            </Card>
          </div>

          {/* Detailed Stats */}
          <Card>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Trophy size={16} className="text-emerald-400" />
                  <span className="text-sm text-muted-foreground">
                    Partidos Ganados
                  </span>
                </div>
                <span className="text-sm font-bold text-emerald-400">
                  {stats.wins}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp size={16} className="text-amber-400" />
                  <span className="text-sm text-muted-foreground">
                    Partidos Empatados
                  </span>
                </div>
                <span className="text-sm font-bold text-amber-400">
                  {stats.draws}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp size={16} className="text-red-400" />
                  <span className="text-sm text-muted-foreground">
                    Partidos Perdidos
                  </span>
                </div>
                <span className="text-sm font-bold text-red-400">
                  {stats.losses}
                </span>
              </div>
              <hr className="border-border" />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Percent size={16} className="text-sky-400" />
                  <span className="text-sm text-muted-foreground">
                    % de Victorias
                  </span>
                </div>
                <span className="text-sm font-bold text-sky-400">
                  {winRate}%
                </span>
              </div>
            </div>
          </Card>
        </div>
      ) : (
        <Card className="animate-fade-in">
          <p className="text-muted-foreground text-sm text-center py-8">
            Este jugador aún no tiene estadísticas. ¡Empezá a cargar partidos!
          </p>
        </Card>
      )}

      {/* Match List */}
      <PlayerMatchList matches={matches} />
    </PageContainer>
  );
}
