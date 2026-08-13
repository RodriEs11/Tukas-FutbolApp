'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Avatar } from '@/components/ui/Avatar';
import { getPlayerDisplayName } from '@/lib/utils/helpers';
import { addPlayersToMatch } from '@/lib/actions/matches';
import type { UserProfile } from '@/lib/types/database';

interface AddPlayersToMatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  teamName: string;
  team: 'A' | 'B';
  matchId: string;
  availablePlayers: UserProfile[];
  currentTeamSize: number;
  onSuccess?: () => void;
}

export function AddPlayersToMatchModal({
  isOpen,
  onClose,
  teamName,
  team,
  matchId,
  availablePlayers,
  currentTeamSize,
  onSuccess
}: AddPlayersToMatchModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);
  const [isAddingPlayers, setIsAddingPlayers] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setSearchQuery('');
      setSelectedPlayers([]);
    }
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

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
      onClose();
      if (onSuccess) onSuccess();
    }
    
    setIsAddingPlayers(false);
  }

  const exceedsLimit = currentTeamSize + selectedPlayers.length > 8;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-card w-full max-w-md rounded-2xl shadow-xl border border-border flex flex-col max-h-[85vh]">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">
            Añadir al {teamName}
          </h2>
          <button 
            onClick={onClose}
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
          <Button variant="ghost" className="flex-1" onClick={onClose}>
            Cancelar
          </Button>
          <Button 
            className="flex-1" 
            onClick={handleAddPlayers}
            disabled={selectedPlayers.length === 0 || isAddingPlayers || exceedsLimit}
            isLoading={isAddingPlayers}
          >
            {exceedsLimit 
              ? 'Supera límite (8)' 
              : selectedPlayers.length > 0 ? `Añadir (${selectedPlayers.length})` : 'Añadir'
            }
          </Button>
        </div>
        
      </div>
    </div>,
    document.body
  );
}
