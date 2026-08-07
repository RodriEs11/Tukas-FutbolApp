import { PlayerCard } from '@/components/players/PlayerCard';
import { BackButton } from '@/components/ui/BackButton';
import { getPlayer } from '@/lib/actions/players';
import { getPlayerStats, getMaxMatchesPlayed } from '@/lib/actions/stats';
import { calculatePlayerRating } from '@/lib/utils/rating';
import { getPlayerDisplayName } from '@/lib/utils/helpers';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const player = await getPlayer(id);
  if (!player) return { title: 'Jugador no encontrado' };
  return { title: `Carta de ${getPlayerDisplayName(player)} | Tukas` };
}

export default async function PlayerCardPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [player, stats, maxMatches] = await Promise.all([
    getPlayer(id),
    getPlayerStats(id),
    getMaxMatchesPlayed(),
  ]);

  if (!player) notFound();

  const rating = stats ? calculatePlayerRating(stats, maxMatches) : null;

  return (
    <div className="card-page-bg">
      <div className="max-w-lg mx-auto px-4 pt-6 pb-12">
        <BackButton fallbackHref={`/players/${id}`} className="mb-8" />

        <div className="flex items-center justify-center min-h-[70dvh]">
          <PlayerCard player={player} stats={stats} rating={rating} />
        </div>
      </div>
    </div>
  );
}
