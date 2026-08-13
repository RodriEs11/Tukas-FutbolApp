'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, Calendar, Clock } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { updateMatchDate } from '@/lib/actions/matches';

interface EditMatchDateModalProps {
  matchId: string;
  currentDate: string; // ISO date string
  isOpen: boolean;
  onClose: () => void;
}

export function EditMatchDateModal({ matchId, currentDate, isOpen, onClose }: EditMatchDateModalProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Extract date (YYYY-MM-DD) and time (HH:mm) from the ISO string
  const dateObj = new Date(currentDate);
  const tzOffset = dateObj.getTimezoneOffset() * 60000;
  const localISOTime = new Date(dateObj.getTime() - tzOffset).toISOString().slice(0, 16);
  
  const initialDate = localISOTime.split('T')[0];
  let initialTime = localISOTime.split('T')[1];

  // Round initialTime to nearest 30 mins if it's not exact, or just let it select the nearest if we format it.
  // We'll assume the time matches the options or we provide a fallback.
  
  const [date, setDate] = useState(initialDate);
  const [time, setTime] = useState(initialTime);

  if (!isOpen) return null;

  // Generate time options from 12:00 to 00:00 (which is 24:00 or 00:00 next day, but usually represented as 00:00)
  const timeOptions = [];
  for (let i = 12; i <= 24; i++) {
    for (let j = 0; j < 60; j += 30) {
      if (i === 24 && j === 30) break; // Don't go past 00:00
      const hour = i === 24 ? '00' : i.toString().padStart(2, '0');
      const minute = j.toString().padStart(2, '0');
      timeOptions.push(`${hour}:${minute}`);
    }
  }

  // Ensure initialTime is in the list, if not, append it or select nearest.
  // A simple slice for initialTime gives "HH:mm".
  initialTime = initialTime.slice(0, 5);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!date || !time) {
      setError('Por favor, selecciona fecha y hora.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Combine date and time and convert to ISO string
      const combinedDate = new Date(`${date}T${time}`);
      const res = await updateMatchDate(matchId, combinedDate.toISOString());
      
      if (res.error) {
        setError(res.error);
      } else {
        router.refresh(); // Refresh the page to show new date
        onClose();
      }
    } catch (err) {
      setError('Ocurrió un error inesperado al guardar la fecha.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-sm bg-card rounded-xl shadow-2xl border border-border animate-slide-up overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <h2 className="text-lg font-bold">Editar Fecha y Hora</h2>
          <button 
            onClick={onClose}
            className="p-2 -mr-2 rounded-full hover:bg-muted text-muted-foreground transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive px-3 py-2 rounded-lg text-sm mb-2">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-sm font-medium flex items-center gap-1.5">
              <Calendar size={14} className="text-muted-foreground" />
              Fecha
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium flex items-center gap-1.5">
              <Clock size={14} className="text-muted-foreground" />
              Hora
            </label>
            <select
              value={time.slice(0, 5)}
              onChange={(e) => setTime(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              required
            >
              <option value="" disabled>Selecciona una hora</option>
              {timeOptions.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" isLoading={isLoading}>
              Guardar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
