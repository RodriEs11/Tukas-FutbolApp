import { getCurrentUser } from '@/lib/actions/auth';
import { PageContainer } from '@/components/layout/PageContainer';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { getMatches } from '@/lib/actions/matches';
import { formatDateTime } from '@/lib/utils/helpers';
import { MATCH_STATUS_LABELS } from '@/lib/utils/constants';
import { CalendarPlus, MapPin, Users, Trophy, CalendarX } from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { CancelMatchButton } from './CancelMatchButton';
import { MatchFilters } from '@/components/matches/MatchFilters';
import { MatchPagination } from '@/components/matches/MatchPagination';

export const metadata: Metadata = {
  title: 'Partidos',
};

const PAGE_SIZE = 5;

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

interface MatchesPageProps {
  searchParams: Promise<{
    page?: string;
    from?: string;
    to?: string;
  }>;
}

export default async function MatchesPage({ searchParams }: MatchesPageProps) {
  const resolvedSearchParams = await searchParams;
  const fromFilter = resolvedSearchParams?.from || '';
  const toFilter = resolvedSearchParams?.to || '';
  const requestedPage = parseInt(resolvedSearchParams?.page || '1', 10);
  const currentPage = isNaN(requestedPage) || requestedPage < 1 ? 1 : requestedPage;

  const [allMatches, user] = await Promise.all([
    getMatches(),
    getCurrentUser(),
  ]);

  const isAdmin = user?.role === 'admin';

  // Apply date filters
  const filteredMatches = allMatches.filter((match) => {
    if (!match.match_date) return true;

    // match_date format might be ISO string: 'YYYY-MM-DDTHH:mm:ss' or 'YYYY-MM-DD...'
    const matchDateStr = match.match_date.slice(0, 10);

    if (fromFilter && matchDateStr < fromFilter) {
      return false;
    }
    if (toFilter && matchDateStr > toFilter) {
      return false;
    }
    return true;
  });

  // Calculate pagination
  const totalMatches = filteredMatches.length;
  const totalPages = Math.ceil(totalMatches / PAGE_SIZE);
  const validCurrentPage = totalPages > 0 ? Math.min(currentPage, totalPages) : 1;
  const startIndex = (validCurrentPage - 1) * PAGE_SIZE;
  const paginatedMatches = filteredMatches.slice(startIndex, startIndex + PAGE_SIZE);

  const hasActiveFilters = Boolean(fromFilter || toFilter);

  return (
    <PageContainer>
      {/* Header */}
      <div className="flex items-center justify-between mb-6 animate-fade-in">
        <div>
          <h2 className="text-2xl font-bold text-foreground tracking-tight">
            Partidos
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            {hasActiveFilters ? (
              <>
                {totalMatches} {totalMatches === 1 ? 'partido filtrado' : 'partidos filtrados'}{' '}
                <span className="text-xs text-muted-foreground">({allMatches.length} en total)</span>
              </>
            ) : (
              `${allMatches.length} ${allMatches.length === 1 ? 'partido' : 'partidos'} registrados`
            )}
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

      {/* Date Filters */}
      {allMatches.length > 0 && (
        <MatchFilters initialFrom={fromFilter} initialTo={toFilter} />
      )}

      {/* Match List */}
      {allMatches.length === 0 ? (
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
      ) : filteredMatches.length === 0 ? (
        <Card className="animate-fade-in">
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
              <CalendarX size={28} className="text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-1">
              No hay partidos en este rango de fechas
            </h3>
            <p className="text-muted-foreground text-sm text-center max-w-xs">
              Probá seleccionando otro rango de fechas o limpiando los filtros.
            </p>
          </div>
        </Card>
      ) : (
        <>
          <div className="space-y-3 animate-slide-up">
            {paginatedMatches.map((match) => (
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

          {/* Pagination Component */}
          <MatchPagination
            currentPage={validCurrentPage}
            totalPages={totalPages}
            totalMatches={totalMatches}
            pageSize={PAGE_SIZE}
          />
        </>
      )}
    </PageContainer>
  );
}

