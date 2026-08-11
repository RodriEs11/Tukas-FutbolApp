'use client';

import React, { useState, useEffect, useRef, useId } from 'react';
import { DndContext, DragEndEvent, DragStartEvent, DragOverlay, useSensor, useSensors, PointerSensor, TouchSensor, useDroppable, pointerWithin } from '@dnd-kit/core';
import { snapCenterToCursor } from '@dnd-kit/modifiers';
import { GraphicalPitch, PITCH_ZONES } from '@/components/matches/GraphicalPitch';
import { DraggablePlayerBadge, PlayerBadgeUI } from '@/components/matches/DraggablePlayerBadge';
import { updateMatchPlayersBulk, removePlayerFromMatch } from '@/lib/actions/matches';
import { AddPlayersToMatchModal } from '@/components/matches/AddPlayersToMatchModal';
import { PlayerCardModal } from '@/components/players/PlayerCardModal';
import { Button } from '@/components/ui/Button';
import { Plus, Trash2 } from 'lucide-react';
import type { MatchPlayer, UserProfile } from '@/lib/types/database';

interface GraphicalLineupAdminProps {
  matchId: string;
  team: 'A' | 'B';
  matchPlayers: MatchPlayer[];
  availablePlayers: UserProfile[]; // Players not in any team yet
  isEditing: boolean;
  onUnsavedChangesChange?: (hasUnsaved: boolean, getSaveAction?: () => Promise<void>) => void;
}

function SelectablePlayerBadge({ player, isSelected, onClick }: { player: UserProfile, isSelected: boolean, onClick: () => void }) {
  return (
    <div onClick={onClick} className={`cursor-pointer flex flex-col items-center justify-center p-1 transition-transform ${isSelected ? 'animate-ios-shake scale-95' : 'hover:scale-105'}`}>
      <PlayerBadgeUI player={player} isDeleteSelected={isSelected} />
    </div>
  );
}

function BenchDroppable({ children }: { children: React.ReactNode }) {
  const { setNodeRef, isOver } = useDroppable({ id: 'bench' });
  return (
    <div 
      ref={setNodeRef}
      className={`grid grid-cols-2 justify-items-center gap-1 p-2 rounded-lg border-2 border-dashed transition-all duration-200 flex-1 content-start overflow-y-auto overflow-x-hidden min-h-72 ${
        isOver 
          ? 'bg-primary/20 border-primary shadow-inner scale-[1.02]' 
          : 'bg-muted/30 border-border/60'
      }`}
    >
      {children}
    </div>
  );
}

export function GraphicalLineupAdmin({ matchId, team, matchPlayers, availablePlayers, isEditing, onUnsavedChangesChange }: GraphicalLineupAdminProps) {
  const [localPlayers, setLocalPlayers] = useState<MatchPlayer[]>(matchPlayers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activePlayerId, setActivePlayerId] = useState<string | null>(null);
  const [selectedPlayerForCard, setSelectedPlayerForCard] = useState<MatchPlayer | null>(null);
  const dndContextId = useId();
  
  const [deleteMode, setDeleteMode] = useState(false);
  const [selectedForDeletion, setSelectedForDeletion] = useState<string[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pendingSaveDataRef = useRef<MatchPlayer[] | null>(null);

  const forceSave = async (playersToSave: MatchPlayer[]) => {
    if (playersToSave.length === 0) return;
    const updates = playersToSave.map(mp => ({
      id: mp.id,
      pitch_position: mp.pitch_position || null
    }));
    await updateMatchPlayersBulk(updates, matchId);
  };

  useEffect(() => {
    return () => {
      // Cleanup: if unmounted while a save is pending, save immediately
      if (saveTimeoutRef.current && pendingSaveDataRef.current) {
        clearTimeout(saveTimeoutRef.current);
        forceSave(pendingSaveDataRef.current).catch(console.error);
      }
    };
  }, [matchId]);
  
  // Sync when props change
  useEffect(() => {
    setLocalPlayers(matchPlayers);
  }, [matchPlayers]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 100, tolerance: 5 } })
  );

  function handleDragStart(event: DragStartEvent) {
    if (!isEditing) return;
    setActivePlayerId(event.active.id as string);
  }

  function handleDragEnd(event: DragEndEvent) {
    setActivePlayerId(null);
    if (!isEditing) return;
    
    const { active, over } = event;
    if (!over) return; // Dropped outside a zone

    const activeData = active.data.current;
    if (!activeData) return;

    const { matchPlayerId } = activeData as { matchPlayerId?: string };
    const zoneId = over.id as string;
    
    // If dropped on the bench zone (we'll name it 'bench')
    const targetPosition = zoneId === 'bench' ? null : zoneId;

    if (matchPlayerId) {
      const sourcePlayerIndex = localPlayers.findIndex(mp => mp.id === matchPlayerId);
      if (sourcePlayerIndex === -1) return;
      const sourcePlayer = localPlayers[sourcePlayerIndex];
      const sourcePosition = sourcePlayer.pitch_position;
      
      // If they drop it in the same place, do nothing
      if (sourcePosition === targetPosition) return;

      const nextState = [...localPlayers];
      
      // Swapping logic: Find if there's already a player in the target position
      // We only swap if target is NOT bench. If target is bench, we don't swap, they just go to bench pool.
      if (targetPosition !== null) {
        const occupantIndex = nextState.findIndex(mp => mp.pitch_position === targetPosition);
        if (occupantIndex !== -1) {
          // Swap! The occupant goes to the source player's old position (which could be another zone, or null/bench)
          nextState[occupantIndex] = { ...nextState[occupantIndex], pitch_position: sourcePosition };
        }
      }
      
      // Move the dragged player
      nextState[sourcePlayerIndex] = { ...sourcePlayer, pitch_position: targetPosition };
      
      setLocalPlayers(nextState);

      if (nextState.length > 0) {
        pendingSaveDataRef.current = nextState;
        
        if (onUnsavedChangesChange) {
           onUnsavedChangesChange(true, async () => {
             if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
             await forceSave(pendingSaveDataRef.current || []);
             pendingSaveDataRef.current = null;
           });
        }
        
        if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
        
        saveTimeoutRef.current = setTimeout(() => {
          if (pendingSaveDataRef.current) {
            forceSave(pendingSaveDataRef.current).catch(console.error);
            pendingSaveDataRef.current = null;
            if (onUnsavedChangesChange) onUnsavedChangesChange(false);
          }
        }, 1500);
      }
    }
  }

  // Players currently on the pitch for this team
  const pitchPlayers = localPlayers.filter(mp => mp.pitch_position && PITCH_ZONES.some(z => z.id === mp.pitch_position));
  
  // Players in this team but not assigned a specific zone
  const unassignedTeamPlayers = localPlayers.filter(mp => !mp.pitch_position || !PITCH_ZONES.some(z => z.id === mp.pitch_position));

  const teamName = team === 'A' ? 'Equipo A' : 'Equipo B';

  function toggleDeletion(playerId: string) {
    setSelectedForDeletion(prev => 
      prev.includes(playerId) ? prev.filter(id => id !== playerId) : [...prev, playerId]
    );
  }

  async function confirmDeletion() {
    if (selectedForDeletion.length === 0) return;
    setIsDeleting(true);
    // Remove players one by one using Promise.all
    const promises = selectedForDeletion.map(playerId => removePlayerFromMatch(matchId, playerId));
    await Promise.all(promises);
    
    // Reset mode
    setDeleteMode(false);
    setSelectedForDeletion([]);
    setIsDeleting(false);
    
    // Note: the parent will revalidate and provide new matchPlayers props, triggering the useEffect to update localPlayers.
  }

  return (
    <div className="flex flex-col gap-2 animate-fade-in">
      
      <DndContext 
        id={dndContextId}
        sensors={sensors} 
        collisionDetection={pointerWithin}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={() => setActivePlayerId(null)}
      >
        <div className="flex flex-row gap-3 items-stretch justify-center w-full max-w-3xl mx-auto">
          {/* Bench / Unassigned Players */}
          <div className="bg-card rounded-xl p-2 border border-border shadow-sm shrink-0 w-[160px] flex flex-col">
            <div className="flex flex-col items-center justify-between mb-3 gap-2">
              <h4 className="text-sm font-semibold text-center">
                Banco <span className="text-xs text-muted-foreground block">({localPlayers.length}/8)</span>
              </h4>
              
              {isEditing && (
                <div className="flex flex-col gap-2 w-full">
                  {deleteMode ? (
                    <>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => { setDeleteMode(false); setSelectedForDeletion([]); }}
                        className="w-full text-white hover:text-white hover:bg-white/10 font-medium text-xs px-2"
                      >
                        Cancelar
                      </Button>
                      <Button 
                        size="sm" 
                        variant="danger" 
                        onClick={confirmDeletion} 
                        disabled={selectedForDeletion.length === 0 || isDeleting}
                        isLoading={isDeleting}
                        className="w-full text-xs px-2"
                      >
                        Quitar ({selectedForDeletion.length})
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button 
                        size="sm" 
                        variant="secondary" 
                        onClick={() => setDeleteMode(true)}
                        disabled={localPlayers.length === 0}
                        className="w-full text-destructive border-destructive/30 hover:bg-destructive/10 text-xs px-2"
                      >
                        <Trash2 size={12} className="mr-1" /> Eliminar
                      </Button>
                      <Button 
                        size="sm" 
                        variant="secondary" 
                        onClick={() => setIsModalOpen(true)}
                        disabled={localPlayers.length >= 8}
                        className="w-full text-xs px-2"
                      >
                        <Plus size={12} className="mr-1" /> Añadir
                      </Button>
                    </>
                  )}
                </div>
              )}
            </div>
            
            <BenchDroppable>
              {unassignedTeamPlayers.map(mp => {
                if (deleteMode) {
                  return (
                    <SelectablePlayerBadge 
                      key={mp.id} 
                      player={mp.player!} 
                      isSelected={selectedForDeletion.includes(mp.player_id)}
                      onClick={() => toggleDeletion(mp.player_id)}
                    />
                  );
                }
                return (
                  <DraggablePlayerBadge 
                    key={mp.id} 
                    player={mp.player!} 
                    matchPlayerId={mp.id} 
                    disabled={!isEditing}
                    onClick={!isEditing ? () => setSelectedPlayerForCard(mp) : undefined}
                  />
                );
              })}
              {unassignedTeamPlayers.length === 0 && (
                <p className="text-xs text-muted-foreground m-auto py-2 col-span-2 text-center">Vacío</p>
              )}
            </BenchDroppable>
          </div>

          {/* Graphical Pitch */}
          <div className="flex-1 w-full flex justify-center items-center">
            <GraphicalPitch
              renderZonePlayers={(zoneId) => {
                const playersInZone = pitchPlayers.filter(mp => mp.pitch_position === zoneId);
                return playersInZone.map(mp => {
                  if (deleteMode) {
                    return (
                      <SelectablePlayerBadge 
                        key={mp.id} 
                        player={mp.player!} 
                        isSelected={selectedForDeletion.includes(mp.player_id)}
                        onClick={() => toggleDeletion(mp.player_id)}
                      />
                    );
                  }
                  return (
                    <DraggablePlayerBadge 
                      key={mp.id} 
                      player={mp.player!} 
                      matchPlayerId={mp.id}
                      disabled={!isEditing}
                      onClick={!isEditing ? () => setSelectedPlayerForCard(mp) : undefined}
                    />
                  );
                });
              }}
            />
          </div>
        </div>

        <DragOverlay dropAnimation={null} modifiers={[snapCenterToCursor]}>
          {activePlayerId ? (
            <div className="flex flex-col items-center justify-center p-1 scale-110 opacity-90 cursor-grabbing drop-shadow-2xl">
              <PlayerBadgeUI 
                player={
                  // Extract player object from the composite id or directly from localPlayers
                  localPlayers.find(p => `mp-${p.id}` === activePlayerId || `p-${p.player_id}` === activePlayerId)?.player!
                } 
              />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      <AddPlayersToMatchModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        teamName={teamName}
        team={team}
        matchId={matchId}
        availablePlayers={availablePlayers}
        currentTeamSize={localPlayers.length}
        onSuccess={() => {
          // Parent revalidates, useEffect updates localPlayers
        }}
      />
      
      {selectedPlayerForCard && (
        <PlayerCardModal
          player={selectedPlayerForCard.player!}
          stats={null}
          rating={null}
          isOpenProp={!!selectedPlayerForCard}
          onCloseProp={() => setSelectedPlayerForCard(null)}
          customTrigger={<></>}
        />
      )}
    </div>
  );
}
