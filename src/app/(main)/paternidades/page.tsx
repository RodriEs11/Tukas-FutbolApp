import { getPaternities } from '@/lib/actions/stats';
import { PageContainer } from '@/components/layout/PageContainer';
import { PaternidadesTable } from '@/components/paternidades/PaternidadesTable';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

export const metadata = {
  title: 'Paternidades | Tukas',
  description: 'Historial de ventajas entre jugadores',
};

// Next.js dynamic rendering
export const dynamic = 'force-dynamic';

async function PaternidadesContent() {
  const paternities = await getPaternities();
  
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/5 border border-emerald-500/20 rounded-2xl p-6 mb-6">
        <h2 className="text-2xl font-bold text-emerald-700 dark:text-emerald-400 mb-2">Paternidades</h2>
        <p className="text-muted-foreground text-sm max-w-xl">
          Competencia entre jugadores rivales. Se considera &quot;padre&quot; a quien le haya ganado al menos 3 partidos más de los que perdió contra otro jugador estando en equipos opuestos.
        </p>
      </div>

      <PaternidadesTable paternities={paternities} />
    </div>
  );
}

function PaternidadesSkeleton() {
  return (
    <div className="flex justify-center py-12">
      <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
    </div>
  );
}

export default function PaternidadesPage() {
  return (
    <PageContainer>
      <Suspense fallback={<PaternidadesSkeleton />}>
        <PaternidadesContent />
      </Suspense>
    </PageContainer>
  );
}
