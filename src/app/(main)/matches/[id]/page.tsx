import { PageContainer } from '@/components/layout/PageContainer';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { getMatch } from '@/lib/actions/matches';
import { formatDateTime, getPlayerDisplayName } from '@/lib/utils/helpers';
import { MATCH_STATUS_LABELS, TEAM_LABELS } from '@/lib/utils/constants';
import { notFound } from 'next/navigation';
import {
  MapPin,
  CalendarDays,
} from 'lucide-react';
import { BackButton } from '@/components/ui/BackButton';
import { getCurrentUser } from '@/lib/actions/auth';
import { getPlayers } from '@/lib/actions/players';
import { MatchTeamAdmin } from './MatchTeamAdmin';
import { FinishMatchButton } from './FinishMatchButton';
import { MatchAdminWrapper } from './MatchAdminWrapper';
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

  const teamA = match.match_players
    ?.filter((mp) => mp.team === 'A')
    .sort((a, b) => {
      const nameA = a.player ? getPlayerDisplayName(a.player) : '';
      const nameB = b.player ? getPlayerDisplayName(b.player) : '';
      return nameA.localeCompare(nameB);
    }) || [];
    
  const teamB = match.match_players
    ?.filter((mp) => mp.team === 'B')
    .sort((a, b) => {
      const nameA = a.player ? getPlayerDisplayName(a.player) : '';
      const nameB = b.player ? getPlayerDisplayName(b.player) : '';
      return nameA.localeCompare(nameB);
    }) || [];
  const isPlayed = match.status === 'played';
  const allMatchPlayers = match.match_players || [];

  return (
    <PageContainer>
      {/* Back button */}
      <BackButton fallbackHref="/matches" />

      {/* Match Header wrapped in Admin Wrapper */}
      <MatchAdminWrapper
        match={match}
        teamA={teamA}
        teamB={teamB}
        allMatchPlayers={allMatchPlayers}
        allPlayers={allPlayers}
        isAdmin={isAdmin}
        isPlayed={isPlayed}
      >
        <div className="text-center mb-6 animate-fade-in relative">
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
      </MatchAdminWrapper>
    </PageContainer>
  );
}
