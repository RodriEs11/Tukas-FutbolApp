'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Input } from '@/components/ui/Input';
import { getPlayerDisplayName } from '@/lib/utils/helpers';
import { removePlayerFromMatch, updateMatchPlayer } from '@/lib/actions/matches';
import { Plus, Minus, UserMinus } from 'lucide-react';
import { AddPlayersToMatchModal } from '@/components/matches/AddPlayersToMatchModal';
import type { UserProfile, MatchPlayer } from '@/lib/types/database';

interface MatchTeamAdminProps {
  matchId: string;
  team: 'A' | 'B';
  teamName: string;
  matchPlayers: MatchPlayer[];
  allMatchPlayers: MatchPlayer[];
  allPlayers: UserProfile[];
  isAdmin: boolean;
  isEditing: boolean;
  isPlayed: boolean;
}

export function MatchTeamAdmin({ matchId, team, teamName, matchPlayers, allMatchPlayers, allPlayers, isAdmin, isEditing, isPlayed }: MatchTeamAdminProps) {
  // Loading states
  const [loadingGoalId, setLoadingGoalId] = useState<string | null>(null);
  const [loadingDeleteId, setLoadingDeleteId] = useState<string | null>(null);
  const [isAddingPlayers, setIsAddingPlayers] = useState(false);

  // Modal & Selection state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Players not in ANY team for this match
  const availablePlayers = allPlayers.filter(
    (p) => !allMatchPlayers.some((mp) => mp.player_id === p.id)
  );

  async function handleRemovePlayer(playerId: string) {
    if (!confirm('¿Seguro que deseas eliminar a este jugador del partido?')) return;
    setLoadingDeleteId(playerId);
    await removePlayerFromMatch(matchId, playerId);
    setLoadingDeleteId(null);
  }

  async function handleUpdateGoals(mp: MatchPlayer, increment: number) {
    const newGoals = Math.max(0, mp.goals + increment);
    if (newGoals === mp.goals) return;
    
    setLoadingGoalId(mp.id);
    const formData = new FormData();
    formData.append('id', mp.id);
    formData.append('goals', newGoals.toString());
    formData.append('attended', 'true');
    await updateMatchPlayer(formData);
    setLoadingGoalId(null);
  }

  const teamColor = team === 'A' ? 'emerald' : 'sky';

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <div className={`w-3 h-3 rounded-full bg-${teamColor}-500`} />
        <h3 className="text-sm font-semibold text-foreground">
          {teamName}
        </h3>
        <span className="text-xs text-muted-foreground font-medium">
          ({matchPlayers.length}/8)
        </span>
      </div>

      {isAdmin && isEditing && (
        <div className="mb-3">
          <Button 
            variant="secondary" 
            fullWidth 
            onClick={() => setIsModalOpen(true)}
            className="border-dashed"
            disabled={matchPlayers.length >= 8}
          >
            <Plus size={16} />
            {matchPlayers.length >= 8 ? 'Límite alcanzado' : 'Añadir jugadores'}
          </Button>
        </div>
      )}

      {matchPlayers.length === 0 ? (
        <Card>
          <p className="text-xs text-muted-foreground text-center py-4">
            Sin jugadores asignados
          </p>
        </Card>
      ) : (
        <Card padding="none">
          <div className="divide-y divide-border">
            {matchPlayers.map((mp) => {
              const isGoalLoading = loadingGoalId === mp.id;
              const isDeleteLoading = loadingDeleteId === mp.player_id;
              
              return (
                <div
                  key={mp.id}
                  className="flex items-center justify-between gap-3 px-4 py-3"
                >
                  {/* Player Info & Goal Controls */}
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {mp.player && (
                      <Avatar player={mp.player} size="sm" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {mp.player ? getPlayerDisplayName(mp.player) : ''}
                      </p>
                    </div>
                    
                    {/* Goal Controls (Next to name) */}
                    {(mp.goals > 0 || isEditing) && (
                      <div className={`flex items-center gap-2 mx-1 text-${teamColor}-400 flex-shrink-0`}>
                        {isEditing && (
                          <button 
                            onClick={() => handleUpdateGoals(mp, -1)} 
                            disabled={isGoalLoading || mp.goals === 0} 
                            className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-foreground hover:bg-muted/80 disabled:opacity-50 active:scale-95 transition-all"
                          >
                            <Minus size={16} />
                          </button>
                        )}
                        
                        <div className="flex flex-col items-center justify-center min-w-[24px]">
                          <span className={`text-[13px] leading-none mb-1 ${isGoalLoading ? 'opacity-50 animate-pulse' : ''}`}>⚽</span>
                          <span className="text-[13px] font-bold text-foreground leading-none">{mp.goals}</span>
                        </div>
                        
                        {isEditing && (
                          <button 
                            onClick={() => handleUpdateGoals(mp, 1)} 
                            disabled={isGoalLoading} 
                            className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-foreground hover:bg-muted/80 disabled:opacity-50 active:scale-95 transition-all"
                          >
                            <Plus size={16} />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {/* Delete Control (Far right) */}
                  {isEditing && (
                    <div className="pl-3 border-l border-border flex-shrink-0">
                      <button 
                        onClick={() => handleRemovePlayer(mp.player_id)} 
                        disabled={isDeleteLoading} 
                        className="flex items-center justify-center w-8 h-8 text-destructive hover:bg-destructive/10 rounded-full transition-colors disabled:opacity-50"
                      >
                        <UserMinus size={16} />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Card>
      )}
      {/* Add Players Modal */}
      <AddPlayersToMatchModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        teamName={teamName}
        team={team}
        matchId={matchId}
        availablePlayers={availablePlayers}
        currentTeamSize={matchPlayers.length}
      />
    </div>
  );
}
