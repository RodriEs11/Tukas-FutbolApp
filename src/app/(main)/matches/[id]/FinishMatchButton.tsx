'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '@/components/ui/Button';
import { finishMatch } from '@/lib/actions/matches';
import { CheckCircle2, X } from 'lucide-react';

interface FinishMatchButtonProps {
  matchId: string;
  isPlayed: boolean;
}

export function FinishMatchButton({ matchId, isPlayed }: FinishMatchButtonProps) {
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  async function handleFinish() {
    const msg = isPlayed 
      ? '¿Actualizar el resultado con los goles actuales? Esto recalculará las estadísticas del partido.'
      : '¿Seguro que deseas finalizar el partido? Esto actualizará las estadísticas y no se puede deshacer (a menos que se cambie el estado en DB).';
    if (!confirm(msg)) {
      return;
    }
    
    setLoading(true);
    await finishMatch(matchId);
    setLoading(false);
    
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  }

  return (
    <div className="relative w-full sm:w-auto">
      <Button onClick={handleFinish} disabled={loading} variant={isPlayed ? "secondary" : "primary"} className="w-full">
        <CheckCircle2 size={16} className="mr-2" />
        {isPlayed ? 'Actualizar Resultado' : 'Finalizar Partido'}
      </Button>

      {/* Toast Notification */}
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
