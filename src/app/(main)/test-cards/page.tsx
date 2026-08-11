import { PlayerCardModal } from '@/components/players/PlayerCardModal';
import { PageContainer } from '@/components/layout/PageContainer';
import type { UserProfile, PlayerStats } from '@/lib/types/database';

export default function TestCardsPage() {
  const mockPlayer = {
    id: 'test-123',
    first_name: 'LIONEL',
    last_name: 'MESSI',
    nickname: 'La Pulga',
    position: 'Delantero',
    preferred_foot: 'Izquierda',
    avatar_url: null,
    role: 'player',
    created_at: new Date().toISOString(),
    email: 'test@tukas.com',
  } as UserProfile;

  const mockStats = {
    player_id: 'test-123',
    matches_played: 20,
    wins: 15,
    draws: 3,
    losses: 2,
    goals: 25,
    points: 48,
  } as PlayerStats;

  const tiers = [
    { title: 'Sin Clasificar (< 3 partidos)', rating: null },
    { title: 'Bronce (1 - 59)', rating: 55 },
    { title: 'Plata (60 - 74)', rating: 70 },
    { title: 'Oro (75 - 84)', rating: 82 },
    { title: 'Élite (85 - 99)', rating: 95 },
  ];

  return (
    <PageContainer>
      <div className="flex flex-col items-center max-w-2xl mx-auto py-12 gap-8 animate-fade-in">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2 text-foreground">Laboratorio de Cartas</h1>
          <p className="text-muted-foreground">
            Haz clic en cada botón para abrir el modal interactivo y probar los distintos colores y efectos de cada rango (tier).
          </p>
        </div>
        
        <div className="grid gap-6 w-full mt-4">
          {tiers.map((tier, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 bg-card rounded-xl border border-border shadow-sm">
              <div className="flex flex-col">
                <span className="font-bold text-lg">{tier.title}</span>
                <span className="text-sm text-muted-foreground">
                  Simulando Rating: {tier.rating ?? 'N/A'}
                </span>
              </div>
              
              <PlayerCardModal 
                player={mockPlayer} 
                stats={mockStats} 
                rating={tier.rating} 
              />
            </div>
          ))}
        </div>
      </div>
    </PageContainer>
  );
}
