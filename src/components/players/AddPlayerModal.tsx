'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { addPlayer } from '@/lib/actions/players';
import { UserPlus, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function AddPlayerModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const result = await addPlayer(formData);

    if (result.error) {
      setError(result.error);
      setIsLoading(false);
    } else {
      setIsOpen(false);
      setIsLoading(false);
      router.refresh();
    }
  };

  if (!isOpen) {
    return (
      <Button onClick={() => setIsOpen(true)} className="flex items-center gap-2">
        <UserPlus size={18} />
        Añadir Jugador
      </Button>
    );
  }

  return (
    <>
      <Button onClick={() => setIsOpen(true)} className="flex items-center gap-2">
        <UserPlus size={18} />
        Añadir Jugador
      </Button>

      {/* Modal Overlay */}
      <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
        <div className="bg-background border border-border w-full max-w-md rounded-2xl shadow-xl overflow-hidden animate-slide-up">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h3 className="font-semibold text-lg">Añadir Nuevo Jugador</h3>
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
                placeholder="Ej: Juan"
                required
              />
              <Input
                name="last_name"
                label="Apellido"
                placeholder="Ej: Pérez"
                required
              />
            </div>
            
            <Input
              name="nickname"
              label="Apodo (Opcional)"
              placeholder="Ej: El Mago"
            />

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-foreground">
                Pierna Hábil
              </label>
              <select
                name="preferred_foot"
                className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent"
                defaultValue=""
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
                defaultValue=""
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
                Guardar Jugador
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
