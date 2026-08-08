'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { addPlayer } from '@/lib/actions/players';
import { UserPlus, X, Upload, Pencil, Camera, Image as ImageIcon, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function AddPlayerModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || '?';

  useEffect(() => {
    setMounted(true);
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    if (selectedFile) {
      formData.append('avatar', selectedFile);
    }
    const result = await addPlayer(formData);

    if (result.error) {
      setError(result.error);
      setIsLoading(false);
    } else {
      setIsOpen(false);
      setSelectedFile(null);
      setPreviewUrl(null);
      setFirstName('');
      setLastName('');
      setIsMenuOpen(false);
      setIsLoading(false);
      router.refresh();
    }
  };

  const modalContent = isOpen ? (
    <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
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

          <div className="flex flex-col items-center justify-center space-y-3 pb-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setSelectedFile(file);
                  setPreviewUrl(URL.createObjectURL(file));
                  setIsMenuOpen(false);
                }
              }}
              accept="image/*"
              className="hidden"
            />
            
            <div className="relative">
              <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-border bg-primary/10 flex items-center justify-center text-primary relative">
                {previewUrl ? (
                  <img src={previewUrl} alt="Avatar preview" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-3xl font-bold">{initials}</span>
                )}
              </div>
              
              <button
                type="button"
                onClick={() => previewUrl ? setIsMenuOpen(!isMenuOpen) : fileInputRef.current?.click()}
                className={`absolute p-1.5 bg-primary text-primary-foreground rounded-full shadow-md hover:bg-primary/90 transition-colors ${
                  previewUrl ? '-top-1 -right-3' : 'bottom-0 right-0'
                }`}
              >
                {previewUrl ? <Pencil size={14} /> : <Camera size={14} />}
              </button>

              {isMenuOpen && previewUrl && (
                <div ref={menuRef} className="absolute top-8 -right-8 w-40 bg-background rounded-xl shadow-lg border border-border py-1 z-50 animate-in fade-in zoom-in duration-200 origin-top-left">
                  <button
                    type="button"
                    onClick={() => {
                      fileInputRef.current?.click();
                      setIsMenuOpen(false);
                    }}
                    className="w-full px-3 py-2 text-sm text-left flex items-center gap-2 hover:bg-muted transition-colors text-foreground"
                  >
                    <ImageIcon size={14} />
                    <span>Cambiar foto</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedFile(null);
                      setPreviewUrl(null);
                      if (fileInputRef.current) fileInputRef.current.value = '';
                      setIsMenuOpen(false);
                    }}
                    className="w-full px-3 py-2 text-sm text-left flex items-center gap-2 hover:bg-muted transition-colors text-destructive"
                  >
                    <Trash2 size={14} />
                    <span>Eliminar foto</span>
                  </button>
                </div>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <Input
              name="first_name"
              label="Nombre"
              placeholder="Ej: Juan"
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <Input
              name="last_name"
              label="Apellido"
              placeholder="Ej: Pérez"
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
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
              <option value="Arquero">Arquero</option>
              <option value="Defensa">Defensa</option>
              <option value="Mediocampista">Mediocampista</option>
              <option value="Delantero">Delantero</option>
            </select>
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <Button type="button" variant="secondary" onClick={() => setIsOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" isLoading={isLoading}>
              Guardar Jugador
            </Button>
          </div>
        </form>
      </div>
    </div>
  ) : null;

  return (
    <>
      <Button onClick={() => setIsOpen(true)} className="flex items-center gap-2">
        <UserPlus size={18} />
        Añadir Jugador
      </Button>

      {mounted && isOpen && createPortal(modalContent, document.body)}
    </>
  );
}
