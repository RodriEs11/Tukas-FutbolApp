'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PageContainer } from '@/components/layout/PageContainer';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { createMatch } from '@/lib/actions/matches';
import { ArrowLeft, CalendarDays, FileText } from 'lucide-react';
import Link from 'next/link';

export default function NewMatchPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
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
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1.5">
                <div className="flex items-center gap-1.5">
                  <CalendarDays size={14} />
                  Fecha y Hora
                </div>
              </label>
              <Input
                name="match_date"
                type="datetime-local"
                required
              />
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
