'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { finishMatch } from '@/lib/actions/matches';
import { CheckCircle2 } from 'lucide-react';

interface FinishMatchButtonProps {
  matchId: string;
  isPlayed: boolean;
  onSuccess?: () => void;
}

export function FinishMatchButton({ matchId, isPlayed, onSuccess }: FinishMatchButtonProps) {
  const [loading, setLoading] = useState(false);

  async function handleFinish() {
    const msg = isPlayed 
      ? '¿Actualizar el resultado con los goles actuales? Esto recalculará las estadísticas del partido.'
      : '¿Seguro que deseas finalizar el partido? Esto actualizará las estadísticas y no se puede deshacer (a menos que se cambie el estado en DB).';
    if (!confirm(msg)) {
      return;
    }
    
    setLoading(true);
    try {
      await finishMatch(matchId);
      onSuccess?.();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative w-full sm:w-auto">
      <Button onClick={handleFinish} disabled={loading} variant={isPlayed ? "secondary" : "primary"} className="w-full">
        <CheckCircle2 size={16} className="mr-2" />
        {isPlayed ? 'Actualizar Resultado' : 'Finalizar Partido'}
      </Button>
    </div>
  );
}
