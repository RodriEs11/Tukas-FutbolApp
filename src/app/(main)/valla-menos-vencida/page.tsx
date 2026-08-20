import { getGoalkeeperStats } from '@/lib/actions/stats';
import { PageContainer } from '@/components/layout/PageContainer';
import { GoalkeepersTable } from '@/components/valla-menos-vencida/GoalkeepersTable';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

export const metadata = {
  title: 'Valla Menos Vencida | Tukas',
  description: 'Ranking de la valla menos vencida. Se prioriza el menor promedio de gol, vallas invictas (VI) y regularidad (PJ).',
};

// Next.js dynamic rendering
export const dynamic = 'force-dynamic';

async function GoalkeepersContent() {
  const goalkeepers = await getGoalkeeperStats();
  const minMatches = goalkeepers[0]?.min_matches_required ?? 3;

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/5 border border-emerald-500/20 rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-emerald-700 dark:text-emerald-400 mb-1.5 sm:mb-2 flex items-center gap-2">
          <span>Valla Menos Vencida</span>
          <span>🧤</span>
        </h2>
        <p className="text-muted-foreground text-xs sm:text-sm max-w-xl">
          Ranking de la valla menos vencida. Se prioriza el menor promedio de gol, vallas invictas (VI: partidos con 0 goles recibidos) y regularidad (PJ). Requiere un mínimo del 30% de los partidos del torneo (mínimo actual: {minMatches} PJ) para figurar en el ranking oficial.
        </p>
      </div>

      <GoalkeepersTable goalkeepers={goalkeepers} />
    </div>
  );
}

function GoalkeepersSkeleton() {
  return (
    <div className="flex justify-center py-12">
      <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
    </div>
  );
}

export default function VallaMenosVencidaPage() {
  return (
    <PageContainer>
      <Suspense fallback={<GoalkeepersSkeleton />}>
        <GoalkeepersContent />
      </Suspense>
    </PageContainer>
  );
}
