import React from 'react';
import { useDroppable } from '@dnd-kit/core';

export const PITCH_ZONES = [
  { id: 'gk', label: 'POR', style: { bottom: '5%', left: '50%', transform: 'translateX(-50%)' } },
  { id: 'def-l', label: 'DFI', style: { bottom: '25%', left: '20%', transform: 'translateX(-50%)' } },
  { id: 'def-c', label: 'DFC', style: { bottom: '22%', left: '50%', transform: 'translateX(-50%)' } },
  { id: 'def-r', label: 'DFD', style: { bottom: '25%', left: '80%', transform: 'translateX(-50%)' } },
  { id: 'mid-l', label: 'MCI', style: { bottom: '55%', left: '25%', transform: 'translateX(-50%)' } },
  { id: 'mid-c', label: 'MC', style: { bottom: '50%', left: '50%', transform: 'translateX(-50%)' } },
  { id: 'mid-r', label: 'MCD', style: { bottom: '55%', left: '75%', transform: 'translateX(-50%)' } },
  { id: 'fwd', label: 'DEL', style: { bottom: '80%', left: '50%', transform: 'translateX(-50%)' } },
];

interface DroppableZoneProps {
  id: string;
  label: string;
  style: React.CSSProperties;
  children?: React.ReactNode;
}

function DroppableZone({ id, label, style, children }: DroppableZoneProps) {
  const { isOver, setNodeRef } = useDroppable({ id });

  // Add slight offset for multiple players in same zone to stack them nicely
  const childArray = React.Children.toArray(children);
  
  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        absolute w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 flex items-center justify-center
        transition-all duration-200 z-10
        ${isOver ? 'bg-primary/40 border-primary shadow-xl scale-110' : 'bg-transparent border-dashed border-white/50'}
      `}
    >
      {childArray.length === 0 ? (
        <span className="text-white/70 text-[10px] sm:text-xs font-bold pointer-events-none select-none">{label}</span>
      ) : (
        <div className="absolute w-full h-full">
          {childArray.map((child, index) => (
            <div 
              key={index} 
              className="absolute top-0 left-0 w-full h-full flex items-center justify-center transition-transform"
              style={{
                transform: `translateY(${index * -8}px) scale(${1 - index * 0.05})`,
                zIndex: 10 - index
              }}
            >
              {child}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

interface GraphicalPitchProps {
  renderZonePlayers: (zoneId: string) => React.ReactNode;
  className?: string;
}

export function GraphicalPitch({ renderZonePlayers, className = "w-full max-w-md" }: GraphicalPitchProps) {
  return (
    <div className={`relative aspect-[3/4] mx-auto bg-emerald-600 rounded-lg overflow-hidden border-4 border-white/80 shadow-2xl isolate ${className}`}>
      {/* Pitch Lines - Background */}
      
      {/* Center Circle (top half) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40%] aspect-square border-[3px] border-white/60 rounded-full" />
      {/* Center Line */}
      <div className="absolute top-0 left-0 w-full h-[3px] bg-white/60" />
      

      {/* Penalty Arc */}
      <div className="absolute bottom-[22%] left-1/2 -translate-x-1/2 translate-y-1/2 w-[25%] aspect-square border-[3px] border-white/60 rounded-full" />
      
      {/* Penalty Area */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[65%] h-[30%] border-[3px] border-white/60 border-b-0 bg-emerald-600 z-[1]" />
      
      {/* Goal Area */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[35%] h-[12%] border-[3px] border-white/60 border-b-0 z-[1]" />
      
      {/* Penalty Mark */}
      <div className="absolute bottom-[22%] left-1/2 -translate-x-1/2 w-2 h-2 bg-white/60 rounded-full z-[1]" />

      {/* Zones */}
      <div className="absolute inset-0 z-10">
        {PITCH_ZONES.map((zone) => (
          <DroppableZone key={zone.id} id={zone.id} label={zone.label} style={zone.style}>
            {renderZonePlayers(zone.id)}
          </DroppableZone>
        ))}
      </div>
    </div>
  );
}
