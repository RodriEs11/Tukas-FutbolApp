'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PageContainer } from '@/components/layout/PageContainer';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { createField } from '@/lib/actions/fields';
import { ArrowLeft, Landmark, MapPin, FileText } from 'lucide-react';
import Link from 'next/link';

const surfaceOptions = [
  { value: 'césped', label: 'Césped Natural' },
  { value: 'sintético', label: 'Césped Sintético' },
  { value: 'tierra', label: 'Tierra' },
  { value: 'cemento', label: 'Cemento' },
  { value: 'otro', label: 'Otro' },
];

export default function NewFieldPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    const result = await createField(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    } else {
      router.push('/fields');
    }
  }

  return (
    <PageContainer>
      {/* Back button */}
      <Link
        href="/fields"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft size={16} />
        Volver a canchas
      </Link>

      <div className="animate-fade-in">
        <h2 className="text-2xl font-bold text-foreground tracking-tight mb-6">
          Nueva Cancha
        </h2>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm animate-scale-in">
            {error}
          </div>
        )}

        <Card>
          <form action={handleSubmit} className="space-y-5">
            <div className="relative">
              <Landmark
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground z-10 pointer-events-none"
              />
              <Input
                name="name"
                placeholder="Nombre de la cancha"
                required
                className="pl-10"
              />
            </div>

            <div className="relative">
              <MapPin
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground z-10 pointer-events-none"
              />
              <Input
                name="location"
                placeholder="Ubicación (dirección, barrio, etc.)"
                className="pl-10"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1.5">
                Tipo de superficie
              </label>
              <select
                name="surface_type"
                defaultValue="césped"
                className="
                  w-full px-4 py-2.5 rounded-xl
                  bg-zinc-900 border border-zinc-700 text-foreground
                  transition-all duration-200
                  focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500
                  hover:border-zinc-600
                  appearance-none cursor-pointer
                "
              >
                {surfaceOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1.5">
                <div className="flex items-center gap-1.5">
                  <FileText size={14} />
                  Descripción (opcional)
                </div>
              </label>
              <textarea
                name="description"
                rows={3}
                placeholder="Detalles adicionales sobre la cancha..."
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
                Crear Cancha
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </PageContainer>
  );
}
