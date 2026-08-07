import { PageContainer } from '@/components/layout/PageContainer';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { getUpcomingMatches, getTopScorers, getLeaderboard, getLastMatch } from '@/lib/actions/stats';
import { getCurrentUser } from '@/lib/actions/auth';
import { formatDateTime, getPlayerDisplayName, pluralize } from '@/lib/utils/helpers';
import { MATCH_STATUS_LABELS } from '@/lib/utils/constants';
import {
  CalendarDays,
  Trophy,
  TrendingUp,
  Users,
  Goal,
  MapPin,
  Flame,
  Clock,
} from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard',
};

export default async function DashboardPage() {
  const [user, upcomingMatches, topScorers, leaderboard, lastMatch] = await Promise.all([
    getCurrentUser(),
    getUpcomingMatches(3),
    getTopScorers(5),
    getLeaderboard(),
    getLastMatch(),
  ]);

  const greeting = user?.first_name
    ? `¡Hola, ${user.nickname || user.first_name}!`
    : '¡Bienvenido!';

  const userStats = leaderboard.find(s => s.player.id === user?.id);
  const userMatches = userStats?.matches_played || 0;
  const userGoals = userStats?.goals || 0;
  const userPoints = userStats?.points || 0;

  return (
    <PageContainer>
      {/* Greeting */}
      <div className="mb-6 animate-fade-in">
        <h2 className="text-2xl font-bold text-foreground tracking-tight">
          {greeting}
        </h2>
        <p className="text-muted-foreground text-sm mt-1">
          Resumen de tu liga de fútbol
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6 animate-slide-up">
        <Card className="text-center stat-glow">
          <div className="flex flex-col items-center gap-1.5 py-1">
            <Trophy size={18} className="text-accent" />
            <span className="text-2xl font-bold text-foreground">
              {userMatches}
            </span>
            <span className="text-xs text-muted-foreground">Partidos</span>
          </div>
        </Card>
        <Card className="text-center">
          <div className="flex flex-col items-center gap-1.5 py-1">
            <Goal size={18} className="text-info" />
            <span className="text-2xl font-bold text-foreground">
              {userGoals}
            </span>
            <span className="text-xs text-muted-foreground">Goles</span>
          </div>
        </Card>
        <Card className="text-center">
          <div className="flex flex-col items-center gap-1.5 py-1">
            <TrendingUp size={18} className="text-warning" />
            <span className="text-2xl font-bold text-foreground">
              {userPoints}
            </span>
            <span className="text-xs text-muted-foreground">Puntos</span>
          </div>
        </Card>
      </div>

      {/* Last Match */}
      {lastMatch && (
        <div className="mb-6 animate-slide-up delay-1">
          <CardHeader>
            <CardTitle>
              <div className="flex items-center gap-2">
                <Clock size={18} className="text-warning" />
                Último Partido
              </div>
            </CardTitle>
          </CardHeader>
          <Link href={`/matches/${lastMatch.id}`} className="block">
            <Card variant="interactive">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="success">
                      {MATCH_STATUS_LABELS[lastMatch.status as keyof typeof MATCH_STATUS_LABELS]}
                    </Badge>
                    <span className="text-sm font-bold text-foreground ml-2">
                      {lastMatch.score_team_a} - {lastMatch.score_team_b}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-foreground">
                    {formatDateTime(lastMatch.match_date)}
                  </p>
                  {lastMatch.field && (
                    <div className="flex items-center gap-1 mt-1">
                      <MapPin size={12} className="text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        {lastMatch.field.name}
                      </span>
                    </div>
                  )}
                </div>
                <CalendarDays size={20} className="text-muted-foreground" />
              </div>
            </Card>
          </Link>
        </div>
      )}

      {/* Upcoming Matches */}
      <div className="mb-6 animate-slide-up delay-1">
        <CardHeader>
          <CardTitle>
            <div className="flex items-center gap-2">
              <CalendarDays size={18} className="text-accent" />
              Próximos Partidos
            </div>
          </CardTitle>
        </CardHeader>

        {upcomingMatches.length === 0 ? (
          <Card>
            <p className="text-muted-foreground text-sm text-center py-4">
              No hay partidos programados
            </p>
          </Card>
        ) : (
          <div className="space-y-3">
            {upcomingMatches.map((match) => (
              <Link key={match.id} href={`/matches/${match.id}`} className="block">
                <Card variant="interactive">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="info">
                          {MATCH_STATUS_LABELS[match.status as keyof typeof MATCH_STATUS_LABELS]}
                        </Badge>
                        {match.match_players && (
                          <span className="text-xs text-muted-foreground">
                            {pluralize(match.match_players.length, 'jugador', 'jugadores')}
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-medium text-foreground">
                        {formatDateTime(match.match_date)}
                      </p>
                      {match.field && (
                        <div className="flex items-center gap-1 mt-1">
                          <MapPin size={12} className="text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            {match.field.name}
                          </span>
                        </div>
                      )}
                    </div>
                    <CalendarDays size={20} className="text-muted-foreground" />
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Top Scorers */}
      <div className="mb-6 animate-slide-up delay-2">
        <CardHeader>
          <CardTitle>
            <div className="flex items-center gap-2">
              <Flame size={18} className="text-orange-400" />
              Top Goleadores
            </div>
          </CardTitle>
        </CardHeader>

        {topScorers.length === 0 ? (
          <Card>
            <p className="text-muted-foreground text-sm text-center py-4">
              Aún no hay goleadores registrados
            </p>
          </Card>
        ) : (
          <Card padding="none">
            <div className="divide-y divide-border">
              {topScorers.map((stat, index) => (
                <Link key={stat.player.id} href={`/players/${stat.player.id}`} className="block hover:bg-muted/30 transition-colors">
                  <div
                    className="flex items-center gap-3 px-4 py-3"
                  >
                    <span
                      className={`text-sm font-bold w-6 text-center ${
                        index === 0
                          ? 'text-warning'
                          : index === 1
                          ? 'text-muted-foreground'
                          : index === 2
                          ? 'text-warning/70'
                          : 'text-muted-foreground'
                      }`}
                    >
                      {index + 1}
                    </span>
                    <Avatar player={stat.player} size="sm" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {getPlayerDisplayName(stat.player)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {pluralize(stat.matches_played, 'partido', 'partidos')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-foreground">
                        {stat.goals}
                      </p>
                      <p className="text-xs text-muted-foreground">goles</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </Card>
        )}
      </div>

      {/* Leaderboard Preview */}
      <div className="animate-slide-up delay-3">
        <CardHeader>
          <CardTitle>
            <div className="flex items-center gap-2">
              <TrendingUp size={18} className="text-accent" />
              Tabla de Posiciones
            </div>
          </CardTitle>
        </CardHeader>

        {leaderboard.length === 0 ? (
          <Card>
            <p className="text-muted-foreground text-sm text-center py-4">
              Jugá partidos para ver la tabla
            </p>
          </Card>
        ) : (
          <Card padding="none">
            {/* Table Header */}
            <div className="grid grid-cols-[1fr_repeat(5,_2.5rem)] gap-1 px-4 py-2.5 text-xs font-medium text-muted-foreground border-b border-border">
              <span>Jugador</span>
              <span className="text-center">PJ</span>
              <span className="text-center">PG</span>
              <span className="text-center">PE</span>
              <span className="text-center">PP</span>
              <span className="text-center font-bold text-foreground">Pts</span>
            </div>
            {/* Table Rows */}
            <div className="divide-y divide-border">
              {leaderboard.slice(0, 10).map((stat, index) => (
                <Link key={stat.player.id} href={`/players/${stat.player.id}`} className="block">
                  <div
                    className="grid grid-cols-[1fr_repeat(5,_2.5rem)] gap-1 px-4 py-2.5 items-center hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-xs font-bold text-muted-foreground w-4">
                        {index + 1}
                      </span>
                      <Avatar player={stat.player} size="sm" />
                      <span className="text-sm font-medium text-foreground truncate">
                        {getPlayerDisplayName(stat.player)}
                      </span>
                    </div>
                    <span className="text-sm text-center text-muted-foreground">
                      {stat.matches_played}
                    </span>
                    <span className="text-sm text-center text-accent">
                      {stat.wins}
                    </span>
                    <span className="text-sm text-center text-warning">
                      {stat.draws}
                    </span>
                    <span className="text-sm text-center text-destructive">
                      {stat.losses}
                    </span>
                    <span className="text-sm text-center font-bold text-foreground">
                      {stat.points}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </Card>
        )}
      </div>
    </PageContainer>
  );
}

