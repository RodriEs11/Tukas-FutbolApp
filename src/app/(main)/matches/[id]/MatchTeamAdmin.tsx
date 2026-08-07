'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Input } from '@/components/ui/Input';
import { getPlayerDisplayName } from '@/lib/utils/helpers';
import { addPlayersToMatch, removePlayerFromMatch, updateMatchPlayer } from '@/lib/actions/matches';
import { Plus, Minus, UserMinus, Search, X } from 'lucide-react';
import type { UserProfile, MatchPlayer } from '@/lib/types/database';

interface MatchTeamAdminProps {
  matchId: string;
  team: 'A' | 'B';
  teamName: string;
  matchPlayers: MatchPlayer[];
  allPlayers: UserProfile[];
  isAdmin: boolean;
  isPlayed: boolean;
}

export function MatchTeamAdmin({ matchId, team, teamName, matchPlayers, allPlayers, isAdmin, isPlayed }: MatchTeamAdminProps) {
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

  // Players not in this team (might be in the other team, but we allow selection and backend handles it)
  const availablePlayers = allPlayers.filter(
    (p) => !matchPlayers.some((mp) => mp.player_id === p.id)
  );

  const filteredPlayers = availablePlayers.filter(p => 
    getPlayerDisplayName(p).toLowerCase().includes(searchQuery.toLowerCase())
  );

  function togglePlayerSelection(playerId: string) {
    setSelectedPlayers(prev => 
      prev.includes(playerId) 
        ? prev.filter(id => id !== playerId)
        : [...prev, playerId]
    );
  }

  async function handleAddPlayers() {
    if (selectedPlayers.length === 0) return;
    setIsAddingPlayers(true);
    
    const result = await addPlayersToMatch(matchId, selectedPlayers, team);
    
    if (result?.error) {
      alert(result.error);
    } else if (result?.success) {
      if (result.duplicatesCount && result.duplicatesCount > 0) {
        alert(`Se añadieron ${result.addedCount} jugadores. ${result.duplicatesCount} ya estaban en un equipo y fueron omitidos.`);
      }
      setIsModalOpen(false);
      setSelectedPlayers([]);
      setSearchQuery('');
    }
    
    setIsAddingPlayers(false);
  }

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
        <span className="text-xs text-muted-foreground">
          ({matchPlayers.length})
        </span>
      </div>

      {isAdmin && (
        <div className="mb-3">
          <Button 
            variant="secondary" 
            fullWidth 
            onClick={() => setIsModalOpen(true)}
            className="border-dashed"
          >
            <Plus size={16} />
            Añadir jugadores
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
                    {(mp.goals > 0 || isAdmin) && (
                      <div className={`flex items-center gap-2 mx-1 text-${teamColor}-400 flex-shrink-0`}>
                        {isAdmin && (
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
                        
                        {isAdmin && (
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
                  {isAdmin && (
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

      {/* Multi-select Modal */}
      {isModalOpen && mounted && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-card w-full max-w-md rounded-2xl shadow-xl border border-border flex flex-col max-h-[85vh]">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="text-lg font-semibold text-foreground">
                Añadir al {teamName}
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-muted-foreground hover:text-foreground transition-colors p-1"
              >
                <X size={20} />
              </button>
            </div>
            
            {/* Modal Search */}
            <div className="p-4 border-b border-border">
              <div className="relative">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground z-10 pointer-events-none" />
                <Input
                  placeholder="Buscar jugador..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Players List */}
            <div className="flex-1 overflow-y-auto p-2">
              {filteredPlayers.length === 0 ? (
                <p className="text-center text-sm text-muted-foreground py-8">
                  No se encontraron jugadores.
                </p>
              ) : (
                <div className="space-y-1">
                  {filteredPlayers.map(p => {
                    const isSelected = selectedPlayers.includes(p.id);
                    return (
                      <div
                        key={p.id}
                        onClick={() => togglePlayerSelection(p.id)}
                        className={`
                          flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors
                          ${isSelected ? 'bg-accent/10 border-accent/20' : 'hover:bg-muted/50'}
                        `}
                      >
                        <div className={`
                          w-5 h-5 rounded-md border flex items-center justify-center
                          ${isSelected ? 'bg-accent border-accent text-accent-foreground' : 'border-input bg-background'}
                        `}>
                          {isSelected && <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                        </div>
                        <Avatar player={p} size="sm" />
                        <span className={`text-sm font-medium ${isSelected ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {getPlayerDisplayName(p)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-border flex gap-3">
              <Button variant="ghost" className="flex-1" onClick={() => setIsModalOpen(false)}>
                Cancelar
              </Button>
              <Button 
                className="flex-1" 
                onClick={handleAddPlayers}
                disabled={selectedPlayers.length === 0 || isAddingPlayers}
                isLoading={isAddingPlayers}
              >
                Añadir {selectedPlayers.length > 0 ? `(${selectedPlayers.length})` : ''}
              </Button>
            </div>
            
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
