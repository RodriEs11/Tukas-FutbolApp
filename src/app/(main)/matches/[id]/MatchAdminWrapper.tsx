'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '@/components/ui/Button';
import { Pencil, X, CheckCircle2 } from 'lucide-react';
import { MatchTeamAdmin } from './MatchTeamAdmin';
import { FinishMatchButton } from './FinishMatchButton';
import { TEAM_LABELS } from '@/lib/utils/constants';
import type { Match, MatchPlayer, UserProfile } from '@/lib/types/database';

interface MatchAdminWrapperProps {
  match: Match;
  teamA: MatchPlayer[];
  teamB: MatchPlayer[];
  allMatchPlayers: MatchPlayer[];
  allPlayers: UserProfile[];
  isAdmin: boolean;
  isPlayed: boolean;
  children: React.ReactNode; // The header/score component to wrap
}

export function MatchAdminWrapper({
  match,
  teamA,
  teamB,
  allMatchPlayers,
  allPlayers,
  isAdmin,
  isPlayed,
  children
}: MatchAdminWrapperProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSuccess = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
    setIsEditing(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="relative">
      {isAdmin && (
        <div className="absolute top-0 right-0 z-10 animate-fade-in">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-2"
          >
            {isEditing ? (
              <>
                <X size={16} />
                <span className="hidden sm:inline">Cancelar Edición</span>
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

      {/* Render the Score Header passed as children */}
      {children}

      {/* Notes */}
      {match.notes && (
        <div className="mb-6 animate-slide-up">
          <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
            <p className="text-sm text-muted-foreground italic">{match.notes}</p>
          </div>
        </div>
      )}

      {/* Teams */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-slide-up delay-1 mb-6 mt-4">
        <MatchTeamAdmin 
          matchId={match.id}
          team="A"
          teamName={TEAM_LABELS.A}
          matchPlayers={teamA}
          allMatchPlayers={allMatchPlayers}
          allPlayers={allPlayers}
          isAdmin={isAdmin}
          isEditing={isAdmin && isEditing}
          isPlayed={isPlayed}
        />
        <MatchTeamAdmin 
          matchId={match.id}
          team="B"
          teamName={TEAM_LABELS.B}
          matchPlayers={teamB}
          allMatchPlayers={allMatchPlayers}
          allPlayers={allPlayers}
          isAdmin={isAdmin}
          isEditing={isAdmin && isEditing}
          isPlayed={isPlayed}
        />
      </div>

      {/* Admin Actions */}
      {isAdmin && isEditing && (
        <div className="flex justify-end animate-slide-up delay-2">
          <FinishMatchButton 
            matchId={match.id} 
            isPlayed={isPlayed} 
            onSuccess={handleSuccess}
          />
        </div>
      )}

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
