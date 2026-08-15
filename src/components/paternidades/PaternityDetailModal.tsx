'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Baby, X, Trophy } from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { PaternityStat } from '@/lib/types/database';

interface PaternityDetailModalProps {
  paternity: PaternityStat | null;
  onClose: () => void;
}

export function PaternityDetailModal({ paternity, onClose }: PaternityDetailModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (paternity) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [paternity, onClose]);

  if (!mounted || !paternity) return null;

  const fatherName = paternity.father.nickname || `${paternity.father.first_name} ${paternity.father.last_name}`;

  return createPortal(
    <div
      className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="paternity-modal-title"
    >
      <div className="bg-background border border-border w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-slide-up flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="p-5 border-b border-border bg-muted/20 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar player={paternity.father} size="md" />
              <div className="absolute -bottom-1 -right-1 bg-amber-500 text-white rounded-full p-0.5 shadow-sm">
                <Trophy size={12} />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 id="paternity-modal-title" className="font-bold text-base sm:text-lg text-foreground">
                  {fatherName}
                </h3>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  Padre
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                {paternity.sons.length} {paternity.sons.length === 1 ? 'hijo registrado' : 'hijos registrados'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Cerrar modal"
            className="p-1.5 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body: List of Sons */}
        <div className="p-5 overflow-y-auto space-y-3 flex-1">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            <Baby className="w-4 h-4 text-emerald-500" />
            <span>Detalle de Hijos (+3 victorias de ventaja)</span>
          </div>

          <div className="space-y-2.5">
            {paternity.sons.map((son) => {
              const sonName = son.son.nickname || `${son.son.first_name} ${son.son.last_name}`;
              return (
                <div
                  key={son.son.id}
                  className="flex items-center justify-between p-3 sm:p-3.5 rounded-xl bg-card border border-border/70 hover:border-emerald-500/30 hover:bg-muted/20 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <Avatar player={son.son} size="sm" />
                    <div>
                      <p className="font-semibold text-sm text-foreground">{sonName}</p>
                      <p className="text-xs text-muted-foreground">
                        {son.son.position || 'Jugador'}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end">
                    <span className="inline-flex items-center text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 dark:bg-emerald-500/20 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                      +{son.net_wins} {son.net_wins === 1 ? 'victoria' : 'victorias'}
                    </span>
                    <span className="text-[10px] text-muted-foreground mt-0.5">Diferencia neta</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-border bg-muted/10 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium rounded-xl bg-muted text-foreground hover:bg-muted/80 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
