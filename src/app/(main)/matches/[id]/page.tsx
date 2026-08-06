import { PageContainer } from '@/components/layout/PageContainer';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { getMatch } from '@/lib/actions/matches';
import { formatDateTime, getPlayerDisplayName } from '@/lib/utils/helpers';
import { MATCH_STATUS_LABELS, TEAM_LABELS } from '@/lib/utils/constants';
import { notFound } from 'next/navigation';
import {
  ArrowLeft,
  MapPin,
  CalendarDays,
  Users,
  Goal,
} from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const match = await getMatch(id);
  if (!match) return { title: 'Partido no encontrado' };
  return { title: `Partido — ${formatDateTime(match.match_date)}` };
}

function getStatusVariant(status: string) {
  switch (status) {
    case 'scheduled':
      return 'info' as const;
    case 'played':
      return 'success' as const;
    case 'cancelled':
      return 'danger' as const;
    default:
      return 'default' as const;
  }
}

export default async function MatchDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const match = await getMatch(id);

  if (!match) notFound();

  const teamA = match.match_players?.filter((mp) => mp.team === 'A') || [];
  const teamB = match.match_players?.filter((mp) => mp.team === 'B') || [];

  return (
    <PageContainer>
      {/* Back button */}
      <Link
        href="/matches"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft size={16} />
        Volver a partidos
      </Link>

      {/* Match Header */}
      <div className="text-center mb-6 animate-fade-in">
        <Badge variant={getStatusVariant(match.status)} className="mb-3">
          {MATCH_STATUS_LABELS[match.status as keyof typeof MATCH_STATUS_LABELS]}
        </Badge>

        {/* Score */}
        {match.status === 'played' && (
          <div className="flex items-center justify-center gap-4 my-4">
            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-1">Equipo A</p>
              <p className="text-5xl font-black text-foreground">
                {match.score_team_a}
              </p>
            </div>
            <span className="text-2xl text-muted-foreground font-light">—</span>
            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-1">Equipo B</p>
              <p className="text-5xl font-black text-foreground">
                {match.score_team_b}
              </p>
            </div>
          </div>
        )}

        {/* Date */}
        <div className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground">
          <CalendarDays size={14} />
          {formatDateTime(match.match_date)}
        </div>

        {/* Location */}
        {match.field && (
          <div className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground mt-1">
            <MapPin size={14} />
            {match.field.name}
            {match.field.location ? ` — ${match.field.location}` : ''}
          </div>
        )}
      </div>

      {/* Notes */}
      {match.notes && (
        <Card className="mb-6 animate-slide-up">
          <p className="text-sm text-muted-foreground italic">{match.notes}</p>
        </Card>
      )}

      {/* Teams */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-slide-up delay-1">
        {/* Team A */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-3 h-3 rounded-full bg-emerald-500" />
            <h3 className="text-sm font-semibold text-foreground">
              {TEAM_LABELS.A}
            </h3>
            <span className="text-xs text-muted-foreground">
              ({teamA.length})
            </span>
          </div>
          {teamA.length === 0 ? (
            <Card>
              <p className="text-xs text-muted-foreground text-center py-4">
                Sin jugadores asignados
              </p>
            </Card>
          ) : (
            <Card padding="none">
              <div className="divide-y divide-border">
                {teamA.map((mp) => (
                  <div
                    key={mp.id}
                    className="flex items-center gap-3 px-4 py-2.5"
                  >
                    {mp.player && (
                      <>
                        <Avatar player={mp.player} size="sm" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-foreground truncate">
                            {getPlayerDisplayName(mp.player)}
                          </p>
                        </div>
                      </>
                    )}
                    {mp.goals > 0 && (
                      <div className="flex items-center gap-1 text-emerald-400">
                        <Goal size={12} />
                        <span className="text-xs font-bold">{mp.goals}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>

        {/* Team B */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-3 h-3 rounded-full bg-sky-500" />
            <h3 className="text-sm font-semibold text-foreground">
              {TEAM_LABELS.B}
            </h3>
            <span className="text-xs text-muted-foreground">
              ({teamB.length})
            </span>
          </div>
          {teamB.length === 0 ? (
            <Card>
              <p className="text-xs text-muted-foreground text-center py-4">
                Sin jugadores asignados
              </p>
            </Card>
          ) : (
            <Card padding="none">
              <div className="divide-y divide-border">
                {teamB.map((mp) => (
                  <div
                    key={mp.id}
                    className="flex items-center gap-3 px-4 py-2.5"
                  >
                    {mp.player && (
                      <>
                        <Avatar player={mp.player} size="sm" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-foreground truncate">
                            {getPlayerDisplayName(mp.player)}
                          </p>
                        </div>
                      </>
                    )}
                    {mp.goals > 0 && (
                      <div className="flex items-center gap-1 text-sky-400">
                        <Goal size={12} />
                        <span className="text-xs font-bold">{mp.goals}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </PageContainer>
  );
}
