'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { updatePlayer } from '@/lib/actions/players';
import { Pencil, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { UserProfile } from '@/lib/types/database';

interface EditPlayerModalProps {
  player: UserProfile;
}

export function EditPlayerModal({ player }: EditPlayerModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    formData.append('id', player.id);
    const result = await updatePlayer(formData);

    if (result.error) {
      setError(result.error);
      setIsLoading(false);
    } else {
      setIsOpen(false);
      setIsLoading(false);
      router.refresh();
    }
  };

  const modalContent = isOpen ? (
    <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
      <div className="bg-background border border-border w-full max-w-md rounded-2xl shadow-xl overflow-hidden animate-slide-up">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="font-semibold text-lg">Editar Jugador</h3>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 rounded-full hover:bg-muted text-muted-foreground transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {error && (
            <div className="p-3 bg-destructive/10 text-destructive rounded-xl text-sm">
              {error}
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-4">
            <Input
              name="first_name"
              label="Nombre"
              defaultValue={player.first_name}
              placeholder="Ej: Juan"
              required
            />
            <Input
              name="last_name"
              label="Apellido"
              defaultValue={player.last_name}
              placeholder="Ej: Pérez"
              required
            />
          </div>
          
          <Input
            name="nickname"
            label="Apodo (Opcional)"
            defaultValue={player.nickname || ''}
            placeholder="Ej: El Mago"
          />

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-foreground">
              Pierna Hábil
            </label>
            <select
              name="preferred_foot"
              className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent"
              defaultValue={player.preferred_foot || ''}
            >
              <option value="" disabled>Seleccionar pierna...</option>
              <option value="Derecha">Derecha</option>
              <option value="Izquierda">Izquierda</option>
              <option value="Ambas">Ambas</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-foreground">
              Posición
            </label>
            <select
              name="position"
              className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent"
              defaultValue={player.position || ''}
            >
              <option value="" disabled>Seleccionar posición...</option>
              <option value="Portero">Portero</option>
              <option value="Defensa">Defensa</option>
              <option value="Mediocampista">Mediocampista</option>
              <option value="Delantero">Delantero</option>
            </select>
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" isLoading={isLoading}>
              Guardar Cambios
            </Button>
          </div>
        </form>
      </div>
    </div>
  ) : null;

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)} 
        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg border transition-all duration-200 hover:bg-muted text-muted-foreground hover:text-foreground"
      >
        <Pencil size={14} />
        Editar
      </button>

      {mounted && isOpen && createPortal(modalContent, document.body)}
    </>
  );
}
