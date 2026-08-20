'use client';

import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { PlayerCardModal } from '@/components/players/PlayerCardModal';
import { AddPlayersToMatchModal } from '@/components/matches/AddPlayersToMatchModal';
import { getPlayerDisplayName } from '@/lib/utils/helpers';
import { updateMatchPlayersGoalsBulk, removePlayerFromMatch } from '@/lib/actions/matches';
import { TEAM_LABELS } from '@/lib/utils/constants';
import { Users, Plus, Minus, UserMinus, UserPlus } from 'lucide-react';
import type { MatchPlayer, UserProfile } from '@/lib/types/database';

interface MatchRostersProps {
  matchId: string;
  teamA: MatchPlayer[];
  teamB: MatchPlayer[];
  allMatchPlayers?: MatchPlayer[];
  allPlayers?: UserProfile[];
  isPlayed: boolean;
  isEditing?: boolean;
  onUnsavedChangesChange?: (hasUnsaved: boolean, getSaveAction?: () => Promise<void>) => void;
}

export function MatchRosters({
  matchId,
  teamA,
  teamB,
  allMatchPlayers = [],
  allPlayers = [],
  isPlayed,
  isEditing = false,
  onUnsavedChangesChange,
}: MatchRostersProps) {
  const [selectedPlayerForCard, setSelectedPlayerForCard] = useState<MatchPlayer | null>(null);
  const [deletingPlayerId, setDeletingPlayerId] = useState<string | null>(null);
  const [addModalTeam, setAddModalTeam] = useState<'A' | 'B' | null>(null);

  // Draft goals state: Map of player ID -> draft goals
  const [draftGoals, setDraftGoals] = useState<Record<string, number>>({});
  
  // Frozen display order when editing
  const [frozenOrderTeamA, setFrozenOrderTeamA] = useState<MatchPlayer[]>([]);
  const [frozenOrderTeamB, setFrozenOrderTeamB] = useState<MatchPlayer[]>([]);
  const isEditingRef = useRef(isEditing);
  isEditingRef.current = isEditing;

  const draftGoalsRef = useRef(draftGoals);
  draftGoalsRef.current = draftGoals;

  // Sorting function when NOT editing
  const getSortedPlayers = (players: MatchPlayer[]) => {
    return [...players].sort((a, b) => {
      const goalsA = a.goals || 0;
      const goalsB = b.goals || 0;
      if (goalsB !== goalsA) {
        return goalsB - goalsA;
      }
      const nameA = a.player ? getPlayerDisplayName(a.player) : '';
      const nameB = b.player ? getPlayerDisplayName(b.player) : '';
      return nameA.localeCompare(nameB);
    });
  };

  // Sync draft goals with server props
  useEffect(() => {
    const initialMap: Record<string, number> = {};
    [...teamA, ...teamB].forEach((p) => {
      initialMap[p.id] = p.goals || 0;
    });
    setDraftGoals(initialMap);
  }, [teamA, teamB]);

  // Freeze order when entering edit mode, or update when not editing
  useEffect(() => {
    if (isEditing) {
      // Freeze current sorted order
      setFrozenOrderTeamA(getSortedPlayers(teamA));
      setFrozenOrderTeamB(getSortedPlayers(teamB));
    } else {
      setFrozenOrderTeamA([]);
      setFrozenOrderTeamB([]);
    }
  }, [isEditing, teamA, teamB]);

  // Check unsaved changes
  const getChangedGoals = () => {
    const changes: { id: string; goals: number }[] = [];
    const allCurrent = [...teamA, ...teamB];
    allCurrent.forEach((p) => {
      const currentDraft = draftGoalsRef.current[p.id] ?? (p.goals || 0);
      if (currentDraft !== (p.goals || 0)) {
        changes.push({ id: p.id, goals: currentDraft });
      }
    });
    return changes;
  };

  const savePendingGoals = async () => {
    const changes = getChangedGoals();
    if (changes.length > 0) {
      await updateMatchPlayersGoalsBulk(changes, matchId);
    }
  };

  useEffect(() => {
    if (onUnsavedChangesChange) {
      const changes = getChangedGoals();
      const hasUnsaved = changes.length > 0;
      onUnsavedChangesChange(hasUnsaved, savePendingGoals);
    }
  }, [draftGoals, teamA, teamB, onUnsavedChangesChange]);

  const handleGoalChange = (player: MatchPlayer, delta: number) => {
    const current = draftGoals[player.id] ?? (player.goals || 0);
    const updated = Math.max(0, current + delta);
    if (updated === current) return;

    setDraftGoals((prev) => ({
      ...prev,
      [player.id]: updated,
    }));
  };

  const handleRemovePlayer = async (playerId: string) => {
    if (!confirm('¿Seguro que deseas eliminar a este jugador del partido?')) return;
    setDeletingPlayerId(playerId);
    try {
      await removePlayerFromMatch(matchId, playerId);
    } finally {
      setDeletingPlayerId(null);
    }
  };

  // Players to display
  const displayTeamA = isEditing && frozenOrderTeamA.length > 0
    ? frozenOrderTeamA
    : getSortedPlayers(teamA);

  const displayTeamB = isEditing && frozenOrderTeamB.length > 0
    ? frozenOrderTeamB
    : getSortedPlayers(teamB);

  // Available players not in the match
  const availablePlayers = allPlayers.filter(
    (p) => !allMatchPlayers.some((mp) => mp.player_id === p.id)
  );

  const renderTeamCard = (
    teamLetter: 'A' | 'B',
    teamName: string,
    players: MatchPlayer[],
    colorClass: 'emerald' | 'sky'
  ) => {
    const totalGoals = players.reduce(
      (sum, p) => sum + (draftGoals[p.id] ?? p.goals ?? 0),
      0
    );

    return (
      <div className="flex flex-col">
        {/* Team Header */}
        <div className="flex items-center justify-between gap-2 mb-3 min-h-[32px]">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${teamLetter === 'A' ? 'bg-emerald-500' : 'bg-sky-500'}`} />
            <h3 className="text-sm font-semibold text-foreground">
              {teamName}
            </h3>
            <span className="text-xs text-muted-foreground font-medium">
              ({players.length}/8)
            </span>
          </div>

          <div className="flex items-center gap-2">
            {(isPlayed || isEditing) && totalGoals > 0 && (
              <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1 bg-muted/60 px-2 py-0.5 rounded-full">
                <span>⚽</span> {totalGoals} {totalGoals === 1 ? 'gol' : 'goles'}
              </span>
            )}

            {isEditing && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setAddModalTeam(teamLetter)}
                disabled={players.length >= 8}
                className="text-xs h-7 px-2.5 flex items-center gap-1 border-dashed"
                title={players.length >= 8 ? 'Límite de 8 jugadores alcanzado' : 'Añadir jugadores al equipo'}
              >
                <UserPlus size={13} />
                <span>Añadir</span>
              </Button>
            )}
          </div>
        </div>

        {/* Player List */}
        {players.length === 0 ? (
          <Card>
            <p className="text-xs text-muted-foreground text-center py-4">
              Sin jugadores asignados
            </p>
          </Card>
        ) : (
          <Card padding="none">
            <div className="divide-y divide-border">
              {players.map((mp) => {
                const currentGoals = draftGoals[mp.id] ?? (mp.goals || 0);
                const hasGoals = (isPlayed || isEditing) && currentGoals > 0;
                const isDeleting = deletingPlayerId === mp.player_id;

                return (
                  <div
                    key={mp.id}
                    onClick={() => {
                      if (!isEditing && mp.player) {
                        setSelectedPlayerForCard(mp);
                      }
                    }}
                    className={`flex items-center justify-between gap-2 sm:gap-3 px-3 sm:px-4 py-3 min-w-0 ${
                      !isEditing ? 'hover:bg-muted/40 transition-colors cursor-pointer group' : ''
                    } ${isDeleting ? 'opacity-40 pointer-events-none' : ''}`}
                    title={!isEditing && mp.player ? `Ver ficha de ${getPlayerDisplayName(mp.player)}` : undefined}
                  >
                    <div className="flex items-center gap-2.5 sm:gap-3 flex-1 min-w-0">
                      {mp.player && (
                        <Avatar player={mp.player} size="sm" />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <p className={`text-sm font-medium text-foreground truncate ${!isEditing ? 'group-hover:text-primary transition-colors' : ''}`}>
                            {mp.player ? getPlayerDisplayName(mp.player) : 'Jugador desconocido'}
                          </p>
                          {mp.pitch_position === 'gk' && (
                            <span
                              className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 shrink-0"
                              title="Arquero del equipo"
                            >
                              🧤 ARQ
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Goal Controls (Editing mode) or Goals Badge (Normal view) */}
                    {isEditing ? (
                      <div className="flex items-center gap-2 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-1 sm:gap-1.5 text-primary">
                          <button
                            onClick={() => handleGoalChange(mp, -1)}
                            disabled={currentGoals === 0}
                            className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-muted text-foreground hover:bg-muted/80 disabled:opacity-30 active:scale-95 transition-all"
                            aria-label="Restar gol"
                            type="button"
                          >
                            <Minus size={14} />
                          </button>

                          <div className="flex flex-col items-center justify-center min-w-[20px] sm:min-w-[24px]">
                            <span className="text-[12px] sm:text-[13px] leading-none mb-0.5 select-none">⚽</span>
                            <span className="text-xs sm:text-[13px] font-bold text-foreground leading-none">{currentGoals}</span>
                          </div>

                          <button
                            onClick={() => handleGoalChange(mp, 1)}
                            className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-muted text-foreground hover:bg-muted/80 active:scale-95 transition-all"
                            aria-label="Sumar gol"
                            type="button"
                          >
                            <Plus size={14} />
                          </button>
                        </div>

                        {/* Delete player button */}
                        <div className="pl-1.5 sm:pl-2 border-l border-border">
                          <button
                            onClick={() => handleRemovePlayer(mp.player_id)}
                            disabled={isDeleting}
                            className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 text-destructive hover:bg-destructive/10 rounded-full transition-colors disabled:opacity-40"
                            title="Eliminar jugador del partido"
                            type="button"
                          >
                            <UserMinus size={15} />
                          </button>
                        </div>
                      </div>
                    ) : (
                      hasGoals && (
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20 shrink-0 shadow-sm">
                          <span className="text-xs">⚽</span>
                          <span className="text-xs font-bold text-foreground">{mp.goals}</span>
                        </div>
                      )
                    )}
                  </div>
                );
              })}
            </div>
          </Card>
        )}
      </div>
    );
  };

  return (
    <div className="mt-8 pt-6 border-t border-border animate-slide-up">
      <div className="flex items-center gap-2 mb-4">
        <Users size={18} className="text-muted-foreground" />
        <h2 className="text-base font-semibold text-foreground">
          {isPlayed ? 'Planteles y Goleadores' : 'Planteles Convocados'}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {renderTeamCard('A', TEAM_LABELS.A, displayTeamA, 'emerald')}
        {renderTeamCard('B', TEAM_LABELS.B, displayTeamB, 'sky')}
      </div>

      {/* Player Card Modal */}
      {selectedPlayerForCard && selectedPlayerForCard.player && (
        <PlayerCardModal
          player={selectedPlayerForCard.player}
          stats={null}
          rating={null}
          isOpenProp={!!selectedPlayerForCard}
          onCloseProp={() => setSelectedPlayerForCard(null)}
          customTrigger={<></>}
        />
      )}

      {/* Add Players Modal */}
      {addModalTeam && (
        <AddPlayersToMatchModal
          isOpen={!!addModalTeam}
          onClose={() => setAddModalTeam(null)}
          teamName={addModalTeam === 'A' ? TEAM_LABELS.A : TEAM_LABELS.B}
          team={addModalTeam}
          matchId={matchId}
          availablePlayers={availablePlayers}
          currentTeamSize={(addModalTeam === 'A' ? teamA : teamB).length}
        />
      )}
    </div>
  );
}
