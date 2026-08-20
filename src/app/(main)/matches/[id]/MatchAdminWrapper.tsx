'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '@/components/ui/Button';
import { Pencil, X, CheckCircle2 } from 'lucide-react';
import { FinishMatchButton } from './FinishMatchButton';
import { GraphicalLineupAdmin } from './GraphicalLineupAdmin';
import { MatchRosters } from './MatchRosters';
import { finishMatch } from '@/lib/actions/matches';
import { TEAM_LABELS, MATCH_STATUS_LABELS } from '@/lib/utils/constants';
import { Badge } from '@/components/ui/Badge';
import { MapPin, CalendarDays, Edit3 } from 'lucide-react';
import { formatDateTime } from '@/lib/utils/helpers';
import { EditMatchDateModal } from '@/components/matches/EditMatchDateModal';
import type { Match, MatchPlayer, UserProfile } from '@/lib/types/database';

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

interface MatchAdminWrapperProps {
  match: Match;
  teamA: MatchPlayer[];
  teamB: MatchPlayer[];
  allMatchPlayers: MatchPlayer[];
  allPlayers: UserProfile[];
  isAdmin: boolean;
  isPlayed: boolean;
}

export function MatchAdminWrapper({
  match,
  teamA,
  teamB,
  allMatchPlayers,
  allPlayers,
  isAdmin,
  isPlayed
}: MatchAdminWrapperProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [graphicalTeam, setGraphicalTeam] = useState<'A' | 'B'>('A');
  const [showToast, setShowToast] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);
  
  const graphicalContainerRef = useRef<HTMLDivElement>(null);
  const pitchSaveActionRef = useRef<(() => Promise<void>) | null>(null);
  const rostersSaveActionRef = useRef<(() => Promise<void>) | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const saveAllPending = async () => {
    if (pitchSaveActionRef.current) {
      await pitchSaveActionRef.current();
    }
    if (rostersSaveActionRef.current) {
      await rostersSaveActionRef.current();
    }
  };

  const handleSuccess = async () => {
    await saveAllPending();
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
    setIsEditing(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="relative">
      {/* Match Header */}
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
          <span>{formatDateTime(match.match_date)}</span>
          {isAdmin && (
            <button 
              onClick={() => setIsDateModalOpen(true)}
              className="p-1 hover:bg-muted hover:text-foreground rounded-full transition-colors ml-1"
              title="Editar Fecha y Hora"
            >
              <Edit3 size={14} />
            </button>
          )}
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

      <EditMatchDateModal 
        matchId={match.id}
        currentDate={match.match_date}
        isOpen={isDateModalOpen}
        onClose={() => setIsDateModalOpen(false)}
      />

      {/* Notes */}
      {match.notes && (
        <div className="mb-6 animate-slide-up">
          <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
            <p className="text-sm text-muted-foreground italic">{match.notes}</p>
          </div>
        </div>
      )}

      {/* Controls Header: Team Selector (Centered) and Edit Button */}
      <div className="relative flex items-center justify-center mb-4 w-full min-h-[36px]">
        {/* Team Selector */}
        <div className="flex gap-2 animate-fade-in" ref={graphicalContainerRef}>
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={async () => {
              if (graphicalTeam !== 'A' && hasUnsavedChanges && pitchSaveActionRef.current) {
                await pitchSaveActionRef.current();
              }
              setGraphicalTeam('A');
            }}
            className={graphicalTeam === 'A' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}
          >
            {TEAM_LABELS.A}
          </Button>
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={async () => {
              if (graphicalTeam !== 'B' && hasUnsavedChanges && pitchSaveActionRef.current) {
                await pitchSaveActionRef.current();
              }
              setGraphicalTeam('B');
            }}
            className={graphicalTeam === 'B' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}
          >
            {TEAM_LABELS.B}
          </Button>
        </div>

        {/* Edit Match Button */}
        {isAdmin && (
          <div className="absolute right-0 flex items-center animate-fade-in">
            <Button 
              variant="secondary" 
              size="sm" 
              onClick={async () => {
                if (isEditing) {
                  const msg = isPlayed 
                    ? '¿Actualizar el resultado con los goles actuales? Esto recalculará las estadísticas del partido.'
                    : '¿Seguro que deseas finalizar el partido? Esto actualizará las estadísticas y no se puede deshacer (a menos que se cambie el estado en DB).';
                  
                  if (!confirm(msg)) {
                    return;
                  }

                  // Finalizando edición, guardar cambios pendientes en lote
                  await saveAllPending();
                  await finishMatch(match.id);
                  handleSuccess();
                } else {
                  setIsEditing(true);
                }
              }}
              className="flex items-center gap-1.5"
            >
              {isEditing ? (
                <>
                  <CheckCircle2 size={16} />
                  <span className="hidden sm:inline">Terminar Edición</span>
                </>
              ) : (
                <>
                  <Pencil size={16} />
                  <span className="hidden sm:inline">Editar Partido</span>
                </>
              )}
            </Button>
          </div>
        )}
      </div>

      {/* Graphical Pitch Content */}
      <div className="mb-6 animate-fade-in">
        <GraphicalLineupAdmin
          matchId={match.id}
          team={graphicalTeam}
          matchPlayers={graphicalTeam === 'A' ? teamA : teamB}
          availablePlayers={allPlayers.filter(
            (p) => !allMatchPlayers.some((mp) => mp.player_id === p.id)
          )}
          isEditing={isAdmin && isEditing}
          onUnsavedChangesChange={(hasUnsaved, saveAction) => {
            setHasUnsavedChanges(hasUnsaved);
            pitchSaveActionRef.current = saveAction || null;
          }}
        />
      </div>

      {/* Admin Actions */}
      {isAdmin && isEditing && (
        <div className="flex justify-end animate-slide-up delay-2 mb-4">
          <FinishMatchButton 
            matchId={match.id} 
            isPlayed={isPlayed} 
            onSuccess={handleSuccess}
          />
        </div>
      )}

      {/* Match Rosters & Goals (Always at the bottom, editable when in edit mode) */}
      <MatchRosters
        matchId={match.id}
        teamA={teamA}
        teamB={teamB}
        allMatchPlayers={allMatchPlayers}
        allPlayers={allPlayers}
        isPlayed={isPlayed}
        isEditing={isAdmin && isEditing}
        onUnsavedChangesChange={(hasUnsaved, saveAction) => {
          rostersSaveActionRef.current = saveAction || null;
        }}
      />

      {/* Global Success Toast */}
      {showToast && mounted && createPortal(
        <div className="fixed bottom-6 right-6 w-72 p-4 bg-emerald-600 border border-emerald-700 rounded-xl shadow-2xl animate-in fade-in slide-in-from-bottom-5 z-[100] flex items-center gap-3">
          <CheckCircle2 className="text-white flex-shrink-0" size={20} />
          <p className="text-sm font-semibold text-white flex-1">
            Se guardaron los cambios correctamente.
          </p>
          <button 
            onClick={() => setShowToast(false)} 
            className="text-emerald-100 hover:text-white transition-colors p-1"
          >
            <X size={18} />
          </button>
        </div>,
        document.body
      )}
    </div>
  );
}
