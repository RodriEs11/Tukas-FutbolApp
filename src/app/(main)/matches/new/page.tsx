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
import { ArrowLeft, CalendarDays, FileText, MapPin, Clock } from 'lucide-react';
import Link from 'next/link';

const TIME_OPTIONS = [
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30',
  '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00', '23:30', '00:00'
];

export default function NewMatchPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [fields, setFields] = useState<Field[]>([]);
  const router = useRouter();

  useEffect(() => {
    async function loadFields() {
      const fetchedFields = await getFields();
      setFields(fetchedFields);
    }
    loadFields();
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
      <Link
        href="/matches"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft size={16} />
        Volver a partidos
      </Link>

      <div className="animate-fade-in">
        <h2 className="text-2xl font-bold text-foreground tracking-tight mb-6">
          Nuevo Partido
        </h2>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm animate-scale-in">
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
                    bg-zinc-900 border border-zinc-700 text-foreground
                    transition-all duration-200
                    focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500
                    hover:border-zinc-600
                  "
                >
                  <option value="">Selecciona hora...</option>
                  {TIME_OPTIONS.map(time => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1.5">
                <div className="flex items-center gap-1.5">
                  <MapPin size={14} />
                  Cancha (Opcional)
                </div>
              </label>
              <select
                name="field_id"
                className="
                  w-full px-4 py-2.5 rounded-xl
                  bg-zinc-900 border border-zinc-700 text-foreground
                  transition-all duration-200
                  focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500
                  hover:border-zinc-600
                "
              >
                <option value="">Selecciona una cancha...</option>
                {fields.map((field) => (
                  <option key={field.id} value={field.id}>
                    {field.name} {field.location ? `(${field.location})` : ''}
                  </option>
                ))}
              </select>
            </div>

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
                  bg-zinc-900 border border-zinc-700 text-foreground
                  placeholder:text-zinc-500
                  transition-all duration-200
                  focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500
                  hover:border-zinc-600
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
