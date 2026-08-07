'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PageContainer } from '@/components/layout/PageContainer';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { createMatch } from '@/lib/actions/matches';
import { getFields } from '@/lib/actions/fields';
import type { Field } from '@/lib/types/database';
import { CalendarDays, FileText, Clock, MapPin } from 'lucide-react';
import { BackButton } from '@/components/ui/BackButton';

const TIME_OPTIONS = [
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30',
  '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00', '23:30', '00:00'
];

export default function NewMatchPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [field, setField] = useState<Field | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function loadField() {
      const fetchedFields = await getFields();
      if (fetchedFields.length > 0) {
        setField(fetchedFields[0]);
      }
    }
    loadField();
  }, []);


  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    
    const date = formData.get('match_day') as string;
    let time = formData.get('match_time') as string;
    
    if (!date || !time) {
      setError('Por favor selecciona fecha y hora');
      setLoading(false);
      return;
    }

    // Handle 00:00 as midnight of the selected day
    const matchDate = new Date(`${date}T${time}:00`);
    
    formData.set('match_date', matchDate.toISOString());
    formData.delete('match_day');
    formData.delete('match_time');

    const result = await createMatch(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    } else {
      router.push('/matches');
    }
  }

  return (
    <PageContainer>
      {/* Back button */}
      <BackButton fallbackHref="/matches" />

      <div className="animate-fade-in">
        <h2 className="text-2xl font-bold text-foreground tracking-tight mb-6">
          Nuevo Partido
        </h2>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-destructive text-sm animate-scale-in">
            {error}
          </div>
        )}

        <Card>
          <form action={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <CalendarDays size={14} />
                    Fecha
                  </div>
                </label>
                <Input
                  name="match_day"
                  type="date"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <Clock size={14} />
                    Hora
                  </div>
                </label>
                <select
                  name="match_time"
                  required
                  className="
                    w-full px-4 py-2.5 rounded-xl
                    bg-background border border-border text-foreground
                    transition-all duration-200
                    focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500
                    hover:border-border-hover
                  "
                >
                  <option value="">Selecciona hora...</option>
                  {TIME_OPTIONS.map(time => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
              </div>
            </div>

            {field && (
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <MapPin size={14} />
                    Cancha
                  </div>
                </label>
                <div className="
                  w-full px-4 py-2.5 rounded-xl
                  bg-background/50 border border-border text-foreground
                  cursor-not-allowed opacity-80 flex items-center
                ">
                  {field.name} {field.location ? `(${field.location})` : ''}
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1.5">
                <div className="flex items-center gap-1.5">
                  <FileText size={14} />
                  Notas (opcional)
                </div>
              </label>
              <textarea
                name="notes"
                rows={3}
                placeholder="Ej: Amistoso de viernes, llevar pecheras..."
                className="
                  w-full px-4 py-2.5 rounded-xl
                  bg-background border border-border text-foreground
                  placeholder:text-muted-foreground
                  transition-all duration-200
                  focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500
                  hover:border-border-hover
                  resize-none
                "
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="secondary"
                fullWidth
                onClick={() => router.back()}
              >
                Cancelar
              </Button>
              <Button type="submit" fullWidth isLoading={loading}>
                Crear Partido
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </PageContainer>
  );
}

