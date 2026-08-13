import { getCurrentUser } from '@/lib/actions/auth';
// ... rest of imports are handled by replacing the whole top block
import { PageContainer } from '@/components/layout/PageContainer';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { getMatches } from '@/lib/actions/matches';
import { formatDateTime } from '@/lib/utils/helpers';
import { MATCH_STATUS_LABELS } from '@/lib/utils/constants';
import { CalendarPlus, MapPin, Users, Trophy } from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { CancelMatchButton } from './CancelMatchButton';

export const metadata: Metadata = {
  title: 'Partidos',
};

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

export default async function MatchesPage() {
  const [matches, user] = await Promise.all([
    getMatches(),
    getCurrentUser(),
  ]);

  const isAdmin = user?.role === 'admin';

  return (
    <PageContainer>
      {/* Header */}
      <div className="flex items-center justify-between mb-6 animate-fade-in">
        <div>
          <h2 className="text-2xl font-bold text-foreground tracking-tight">
            Partidos
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            {matches.length} {matches.length === 1 ? 'partido' : 'partidos'} registrados
          </p>
        </div>
        {isAdmin && (
          <Link
            href="/matches/new"
            className="
              inline-flex items-center gap-1.5 px-4 py-2.5
              text-sm font-medium text-white
              bg-emerald-600 hover:bg-emerald-700
              rounded-xl shadow-lg shadow-emerald-500/20
              transition-all duration-200 active:scale-95
            "
          >
            <CalendarPlus size={16} />
            <span className="hidden sm:inline">Nuevo</span>
          </Link>
        )}
      </div>

      {/* Match List */}
      {matches.length === 0 ? (
        <Card className="animate-fade-in">
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-4">
              <Trophy size={28} className="text-accent" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-1">
              Sin partidos aún
            </h3>
            <p className="text-muted-foreground text-sm text-center max-w-xs">
              Creá tu primer partido para empezar a registrar resultados y estadísticas.
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-3 animate-slide-up">
          {matches.map((match, index) => (
            <Link key={match.id} href={`/matches/${match.id}`}>
              <Card variant="interactive" className="mb-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    {/* Status + Date */}
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant={getStatusVariant(match.status)}>
                        {MATCH_STATUS_LABELS[match.status as keyof typeof MATCH_STATUS_LABELS]}
                      </Badge>
                      {isAdmin && match.status === 'scheduled' && (
                        <div className="ml-auto z-10 relative">
                          <CancelMatchButton matchId={match.id} />
                        </div>
                      )}
                    </div>

                    {/* Date & Time */}
                    <p className="text-sm font-semibold text-foreground">
                      {formatDateTime(match.match_date)}
                    </p>

                    {/* Location */}
                    {match.field && (
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <MapPin size={13} className="text-muted-foreground shrink-0" />
                        <span className="text-xs text-muted-foreground truncate">
                          {match.field.name}
                          {match.field.location ? ` — ${match.field.location}` : ''}
                        </span>
                      </div>
                    )}

                    {/* Players count */}
                    {match.match_players && match.match_players.length > 0 && (
                      <div className="flex items-center gap-1.5 mt-1">
                        <Users size={13} className="text-muted-foreground shrink-0" />
                        <span className="text-xs text-muted-foreground">
                          {match.match_players.length} jugadores
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Score */}
                  {match.status === 'played' && (
                    <div className="flex items-center gap-1.5 bg-muted rounded-xl px-3 py-2 shrink-0">
                      <span className="text-lg font-bold text-foreground">
                        {match.score_team_a}
                      </span>
                      <span className="text-xs text-muted-foreground">-</span>
                      <span className="text-lg font-bold text-foreground">
                        {match.score_team_b}
                      </span>
                    </div>
                  )}
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </PageContainer>
  );
}

