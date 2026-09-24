'use client';

import { useState } from 'react';
import { cancelMatch } from '@/lib/actions/matches';
import { Ban } from 'lucide-react';

export function CancelMatchButton({ matchId }: { matchId: string }) {
  const [isPending, setIsPending] = useState(false);

  const handleCancel = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!window.confirm('¿Estás seguro de que quieres cancelar este partido?')) {
      return;
    }

    setIsPending(true);
    try {
      const result = await cancelMatch(matchId);
      if (result?.error) {
        alert(result.error);
      }
    } catch (error) {
      console.error(error);
      alert('Error al cancelar el partido');
    } finally {
      setIsPending(false);
    }
  };

  return (
    <button
      onClick={handleCancel}
      disabled={isPending}
      className="p-2 text-red-500 hover:bg-red-500/10 rounded-full transition-colors disabled:opacity-50"
      title="Cancelar Partido"
    >
      <Ban size={18} />
    </button>
  );
}
