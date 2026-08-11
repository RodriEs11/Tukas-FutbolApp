import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { Trash2 } from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { getPlayerDisplayName } from '@/lib/utils/helpers';
import type { MatchPlayer, UserProfile } from '@/lib/types/database';

interface DraggablePlayerBadgeProps {
  player: UserProfile;
  matchPlayerId?: string; // If already in match
  disabled?: boolean;
  onClick?: () => void;
}

export function PlayerBadgeUI({ player, isDeleteSelected }: { player: UserProfile, isDeleteSelected?: boolean }) {
  return (
    <>
      <div className="relative bg-background rounded-full shadow-md border-2 border-primary/20 pointer-events-none overflow-hidden">
        <div className={`transition-all duration-200 ${isDeleteSelected ? 'grayscale brightness-50' : ''}`}>
          <Avatar player={player} size="sm" />
        </div>
        {isDeleteSelected && (
          <div className="absolute inset-0 bg-destructive/30 rounded-full border-2 border-destructive flex items-center justify-center">
            <Trash2 size={14} className="text-white drop-shadow-md bg-destructive rounded-full p-0.5" />
          </div>
        )}
      </div>
      <div className="bg-background/80 backdrop-blur-sm px-1.5 py-0.5 rounded text-[10px] font-bold mt-1 text-foreground shadow-sm truncate max-w-[60px] pointer-events-none">
        {getPlayerDisplayName(player).split(' ')[0]}
      </div>
    </>
  );
}

export function DraggablePlayerBadge({ player, matchPlayerId, disabled, onClick }: DraggablePlayerBadgeProps) {
  // Use player.id as the drag id, but we might need a composite if it's already a matchPlayer
  const id = matchPlayerId ? `mp-${matchPlayerId}` : `p-${player.id}`;
  
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id,
    disabled,
    data: {
      player,
      matchPlayerId,
    }
  });

  const style = {
    opacity: isDragging ? 0 : 1, // Completely hide the original so only DragOverlay is visible
    zIndex: isDragging ? 0 : 1,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      {...(!disabled ? listeners : {})} 
      {...(!disabled ? attributes : {})}
      onClick={onClick}
      className={`
        flex flex-col items-center justify-center p-1 select-none
        ${disabled ? 'cursor-pointer hover:scale-105 transition-transform' : 'cursor-grab active:cursor-grabbing touch-none'}
        ${isDragging ? 'opacity-50' : (!disabled ? 'hover:scale-105 transition-transform' : '')}
      `}
    >
      <PlayerBadgeUI player={player} />
    </div>
  );
}
