import { PageContainer } from '@/components/layout/PageContainer';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { getMatch } from '@/lib/actions/matches';
import { formatDateTime } from '@/lib/utils/helpers';
import { MATCH_STATUS_LABELS, TEAM_LABELS } from '@/lib/utils/constants';
import { notFound } from 'next/navigation';
import {
  ArrowLeft,
  MapPin,
  CalendarDays,
} from 'lucide-react';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/actions/auth';
import { getPlayers } from '@/lib/actions/players';
import { MatchTeamAdmin } from './MatchTeamAdmin';
import { FinishMatchButton } from './FinishMatchButton';
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

  const currentUser = await getCurrentUser();
  const isAdmin = currentUser?.role === 'admin';
  const allPlayers = await getPlayers();

  const teamA = match.match_players?.filter((mp) => mp.team === 'A') || [];
  const teamB = match.match_players?.filter((mp) => mp.team === 'B') || [];
  const isPlayed = match.status === 'played';

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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-slide-up delay-1 mb-6">
        <MatchTeamAdmin 
          matchId={match.id}
          team="A"
          teamName={TEAM_LABELS.A}
          matchPlayers={teamA}
          allPlayers={allPlayers}
          isAdmin={isAdmin}
          isPlayed={isPlayed}
        />
        <MatchTeamAdmin 
          matchId={match.id}
          team="B"
          teamName={TEAM_LABELS.B}
          matchPlayers={teamB}
          allPlayers={allPlayers}
          isAdmin={isAdmin}
          isPlayed={isPlayed}
        />
      </div>

      {/* Admin Actions */}
      {isAdmin && (
        <div className="flex justify-end animate-slide-up delay-2">
          <FinishMatchButton matchId={match.id} isPlayed={isPlayed} />
        </div>
      )}
    </PageContainer>
  );
}
