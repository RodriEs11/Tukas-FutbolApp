'use client';

import { Trash2 } from 'lucide-react';
import { deletePlayer } from '@/lib/actions/players';
import { useState } from 'react';

export function DeletePlayerButton({ playerId, playerName }: { playerId: string; playerName: string }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (window.confirm(`¿Estás seguro de que quieres eliminar a ${playerName}?`)) {
      setIsDeleting(true);
      try {
        const result = await deletePlayer(playerId);
        if (result.error) {
          alert('Error al eliminar el jugador: ' + result.error);
        }
      } catch (error) {
        console.error('Error deleting player:', error);
        alert('Ocurrió un error al intentar eliminar el jugador.');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="p-2 text-red-500 hover:text-red-700 hover:bg-red-500/10 rounded-full transition-colors disabled:opacity-50"
      title="Eliminar jugador"
    >
      <Trash2 size={18} />
    </button>
  );
}
