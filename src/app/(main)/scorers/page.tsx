import { getScorersStats } from '@/lib/actions/stats';
import { PageContainer } from '@/components/layout/PageContainer';
import { ScorersTable } from '@/components/scorers/ScorersTable';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

export const metadata = {
  title: 'Goleadores | Tukas',
  description: 'Tabla de goleadores de los partidos jugados',
};

// Next.js dynamic rendering
export const dynamic = 'force-dynamic';

async function ScorersContent() {
  const scorers = await getScorersStats();
  
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/5 border border-emerald-500/20 rounded-2xl p-6 mb-6">
        <h2 className="text-2xl font-bold text-emerald-700 dark:text-emerald-400 mb-2">Tabla de Goleadores</h2>
        <p className="text-muted-foreground text-sm max-w-xl">
          Clasificación general de los máximos anotadores. Se contabilizan únicamente los goles convertidos en partidos finalizados.
        </p>
      </div>

      <ScorersTable scorers={scorers} />
    </div>
  );
}

function ScorersSkeleton() {
  return (
    <div className="flex justify-center py-12">
      <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
    </div>
  );
}

export default function ScorersPage() {
  return (
    <PageContainer>
      <Suspense fallback={<ScorersSkeleton />}>
        <ScorersContent />
      </Suspense>
    </PageContainer>
  );
}
