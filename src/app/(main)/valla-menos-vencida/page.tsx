import { getGoalkeeperStats } from '@/lib/actions/stats';
import { PageContainer } from '@/components/layout/PageContainer';
import { GoalkeepersTable } from '@/components/valla-menos-vencida/GoalkeepersTable';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

export const metadata = {
  title: 'Valla Menos Vencida | Tukas',
  description: 'Reconocimiento a los arqueros con menor promedio de goles recibidos en partidos finalizados',
};

// Next.js dynamic rendering
export const dynamic = 'force-dynamic';

async function GoalkeepersContent() {
  const goalkeepers = await getGoalkeeperStats();

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/5 border border-emerald-500/20 rounded-2xl p-6 mb-6">
        <h2 className="text-2xl font-bold text-emerald-700 dark:text-emerald-400 mb-2 flex items-center gap-2">
          <span>Valla Menos Vencida</span>
          <span>🧤</span>
        </h2>
        <p className="text-muted-foreground text-sm max-w-xl">
          Reconocimiento a los arqueros que menos goles reciben por partido. Se contabilizan únicamente los partidos jugados como arquero en encuentros finalizados.
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
