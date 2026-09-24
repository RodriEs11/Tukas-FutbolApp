'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';
import { deleteMatch } from '@/lib/actions/matches';
import { DeleteMatchModal } from './DeleteMatchModal';
import { Button } from '@/components/ui/Button';

interface DeleteMatchButtonProps {
  matchId: string;
  redirectTo?: string;
  variant?: 'icon' | 'button';
  className?: string;
}

export function DeleteMatchButton({
  matchId,
  redirectTo,
  variant = 'icon',
  className = '',
}: DeleteMatchButtonProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setError('');
    setIsOpen(true);
  };

  const handleConfirm = async () => {
    setIsLoading(true);
    setError('');
    try {
      const res = await deleteMatch(matchId);
      if (res?.error) {
        setError(res.error);
        setIsLoading(false);
      } else {
        setIsOpen(false);
        if (redirectTo) {
          router.push(redirectTo);
        } else {
          router.refresh();
        }
      }
    } catch (err) {
      console.error('Error al eliminar el partido:', err);
      setError('Ocurrió un error inesperado al eliminar el partido.');
      setIsLoading(false);
    }
  };

  return (
    <>
      {variant === 'icon' ? (
        <button
          onClick={handleClick}
          className={`p-2 text-red-500 hover:text-red-700 hover:bg-red-500/10 rounded-full transition-colors disabled:opacity-50 ${className}`}
          title="Eliminar Partido"
          type="button"
        >
          <Trash2 size={18} />
        </button>
      ) : (
        <Button
          variant="danger"
          size="sm"
          onClick={handleClick}
          type="button"
          className={`flex items-center gap-1.5 ${className}`}
        >
          <Trash2 size={16} />
          <span>Eliminar Partido</span>
        </Button>
      )}

      <DeleteMatchModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={handleConfirm}
        isLoading={isLoading}
        error={error}
      />
    </>
  );
}
