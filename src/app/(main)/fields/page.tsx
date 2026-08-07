import { PageContainer } from '@/components/layout/PageContainer';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { getFields } from '@/lib/actions/fields';
import { getCurrentUser } from '@/lib/actions/auth';
import { SURFACE_TYPE_LABELS } from '@/lib/utils/constants';
import { MapPin, Plus, Landmark } from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Canchas',
};

export default async function FieldsPage() {
  const [fields, user] = await Promise.all([
    getFields(),
    getCurrentUser(),
  ]);

  const isAdmin = user?.role === 'admin';

  return (
    <PageContainer>
      {/* Header */}
      <div className="flex items-center justify-between mb-6 animate-fade-in">
        <div>
          <h2 className="text-2xl font-bold text-foreground tracking-tight">
            Canchas
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            {fields.length} {fields.length === 1 ? 'cancha disponible' : 'canchas disponibles'}
          </p>
        </div>
        {isAdmin && (
          <Link
            href="/fields/new"
            className="
              inline-flex items-center gap-1.5 px-4 py-2.5
              text-sm font-medium text-white
              bg-emerald-600 hover:bg-emerald-700
              rounded-xl shadow-lg shadow-emerald-500/20
              transition-all duration-200 active:scale-95
            "
          >
            <Plus size={16} />
            <span className="hidden sm:inline">Nueva</span>
          </Link>
        )}
      </div>

      {/* Fields List */}
      {fields.length === 0 ? (
        <Card className="animate-fade-in">
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-4">
              <Landmark size={28} className="text-accent" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-1">
              Sin canchas registradas
            </h3>
            <p className="text-muted-foreground text-sm text-center max-w-xs">
              {isAdmin
                ? 'Agregá tu primera cancha para poder asignarla a los partidos.'
                : 'El administrador aún no ha registrado canchas.'}
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-3 animate-slide-up">
          {fields.map((field) => (
            <Card key={field.id} variant="interactive">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <Landmark size={18} className="text-accent" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-foreground">
                    {field.name}
                  </h3>
                  {field.location && (
                    <div className="flex items-center gap-1 mt-1">
                      <MapPin size={12} className="text-muted-foreground shrink-0" />
                      <span className="text-xs text-muted-foreground truncate">
                        {field.location}
                      </span>
                    </div>
                  )}
                  {field.description && (
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {field.description}
                    </p>
                  )}
                </div>
                <Badge variant="default">
                  {SURFACE_TYPE_LABELS[field.surface_type as keyof typeof SURFACE_TYPE_LABELS] ||
                    field.surface_type}
                </Badge>
              </div>
            </Card>
          ))}
        </div>
      )}
    </PageContainer>
  );
}

