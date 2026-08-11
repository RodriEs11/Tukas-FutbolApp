'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Star, X } from 'lucide-react';
import { PlayerCard } from '@/components/players/PlayerCard';
import type { UserProfile } from '@/lib/types/database';

// Note: I will define PlayerStats interface here since we don't know the exact import, but any type works for now
// Actually let's import it from the exact path if possible, or use 'any' if I don't know it.
// I'll check what types are available or just use any.
// Let's use `any` for stats temporarily, or try to import it. Let me just use `any` for stats to avoid build errors if the type is slightly different.

export function PlayerCardModal({ 
  player, 
  stats, 
  rating,
  isOpenProp,
  onCloseProp,
  customTrigger
}: { 
  player: UserProfile; 
  stats: any; 
  rating: number | null;
  isOpenProp?: boolean;
  onCloseProp?: () => void;
  customTrigger?: React.ReactNode;
}) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = isOpenProp !== undefined ? isOpenProp : internalIsOpen;
  
  const handleClose = () => {
    if (onCloseProp) onCloseProp();
    else setInternalIsOpen(false);
  };
  const [mounted, setMounted] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const updateTilt = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    let xNormalized = (x / rect.width) * 2 - 1;
    let yNormalized = (y / rect.height) * 2 - 1;
    
    // Clamp to -1 and 1 to prevent over-rotation when dragging outside
    xNormalized = Math.max(-1, Math.min(1, xNormalized));
    yNormalized = Math.max(-1, Math.min(1, yNormalized));

    setTilt({
      x: -yNormalized * 25,
      y: xNormalized * 25,
    });
  };

  const updateTiltTouch = (e: React.TouchEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const touch = e.touches[0];
    if (!touch) return;
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    let xNormalized = (x / rect.width) * 2 - 1;
    let yNormalized = (y / rect.height) * 2 - 1;

    // Clamp to -1 and 1 to prevent over-rotation when dragging outside
    xNormalized = Math.max(-1, Math.min(1, xNormalized));
    yNormalized = Math.max(-1, Math.min(1, yNormalized));

    setTilt({
      x: -yNormalized * 25,
      y: xNormalized * 25,
    });
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    updateTilt(e);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    updateTilt(e);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setIsDragging(true);
    updateTiltTouch(e);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    updateTiltTouch(e);
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
    setTilt({ x: 0, y: 0 });
  };

  useEffect(() => {
    setMounted(true);
    
    // Close on escape key
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden'; // Prevent scrolling
    }
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const modalContent = isOpen ? (
    <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in"
         onClick={(e) => {
           // Close if clicking outside the card wrapper
           if (e.target === e.currentTarget) handleClose();
         }}
    >
      <button
        onClick={handleClose}
        className="absolute top-6 right-6 p-2 rounded-full bg-white/10 text-white/80 hover:bg-white/20 hover:text-white transition-all duration-300 z-[110]"
      >
        <X size={24} />
      </button>

      <div className="perspective-1000 w-full max-w-sm flex justify-center items-center">
        <div className="animate-flip-in-3d w-full flex justify-center drop-shadow-2xl">
          <div
            className="select-none touch-none"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUpOrLeave}
            onMouseLeave={handleMouseUpOrLeave}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleMouseUpOrLeave}
            onTouchCancel={handleMouseUpOrLeave}
            style={{
              transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${isDragging ? 1.05 : 1})`,
              transition: isDragging ? 'transform 0.05s ease-out' : 'transform 0.4s ease-out',
              transformStyle: 'preserve-3d',
              cursor: isDragging ? 'grabbing' : 'grab',
            }}
          >
            <PlayerCard player={player} stats={stats} rating={rating} />
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <>
      {customTrigger ? (
        <div onClick={() => setInternalIsOpen(true)} className="contents">
          {customTrigger}
        </div>
      ) : (
        <button
          onClick={() => setInternalIsOpen(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg border transition-all duration-200 hover:shadow-[0_0_16px_-4px_rgba(212,168,83,0.4)]"
          style={{
            color: '#d4a853',
            backgroundColor: 'rgba(212, 168, 83, 0.1)',
            borderColor: 'rgba(212, 168, 83, 0.3)',
          }}
        >
          <Star size={14} />
          Ver Carta
        </button>
      )}

      {mounted && isOpen && createPortal(modalContent, document.body)}
    </>
  );
}
