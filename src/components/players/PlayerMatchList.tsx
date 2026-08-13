'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatDateTime, getMatchStatusVariant } from '@/lib/utils/helpers';
import { MATCH_STATUS_LABELS } from '@/lib/utils/constants';
import { MapPin, Users, ChevronLeft, ChevronRight, Trophy } from 'lucide-react';
import type { Match } from '@/lib/types/database';

interface PlayerMatchListProps {
  matches: Match[];
}



export function PlayerMatchList({ matches }: PlayerMatchListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const matchesPerPage = 5;

  if (!matches || matches.length === 0) {
    return null; // The parent can show "No matches" if needed, but we prefer not to if it's not strictly necessary. Or maybe a simple card.
  }

  const totalPages = Math.ceil(matches.length / matchesPerPage);
  const startIndex = (currentPage - 1) * matchesPerPage;
  const currentMatches = matches.slice(startIndex, startIndex + matchesPerPage);

  return (
    <div className="space-y-4 animate-slide-up mt-8">
      <h3 className="text-xl font-bold text-foreground tracking-tight mb-4 flex items-center gap-2">
        <Trophy size={20} className="text-emerald-500" />
        Partidos (Historial y Próximos)
      </h3>

      <div className="space-y-3 min-h-[600px]">
        {currentMatches.map((match) => (
          <Link key={match.id} href={`/matches/${match.id}`}>
            <Card variant="interactive" className="mb-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant={getMatchStatusVariant(match.status)}>
                      {MATCH_STATUS_LABELS[match.status as keyof typeof MATCH_STATUS_LABELS] || match.status}
                    </Badge>
                  </div>

                  <p className="text-sm font-semibold text-foreground">
                    {formatDateTime(match.match_date)}
                  </p>

                  {match.field && (
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <MapPin size={13} className="text-muted-foreground shrink-0" />
                      <span className="text-xs text-muted-foreground truncate">
                        {match.field.name}
                        {match.field.location ? ` — ${match.field.location}` : ''}
                      </span>
                    </div>
                  )}

                  {match.match_players && match.match_players.length > 0 && (
                    <div className="flex items-center gap-1.5 mt-1">
                      <Users size={13} className="text-muted-foreground shrink-0" />
                      <span className="text-xs text-muted-foreground">
                        {match.match_players.length} jugadores
                      </span>
                    </div>
                  )}
                </div>

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

      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="flex items-center gap-1"
          >
            <ChevronLeft size={16} />
            Anterior
          </Button>
          <span className="text-sm text-muted-foreground">
            Página {currentPage} de {totalPages}
          </span>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="flex items-center gap-1"
          >
            Siguiente
            <ChevronRight size={16} />
          </Button>
        </div>
      )}
    </div>
  );
}
