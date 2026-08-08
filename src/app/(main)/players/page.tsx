import { PageContainer } from '@/components/layout/PageContainer';
import { Card } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { getPlayers } from '@/lib/actions/players';
import { getCurrentUser } from '@/lib/actions/auth';
import { AddPlayerModal } from '@/components/players/AddPlayerModal';
import { DeletePlayerButton } from '@/components/players/DeletePlayerButton';
import { Search, UserPlus } from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Jugadores',
};

export default async function PlayersPage() {
  const players = await getPlayers();
  const currentUser = await getCurrentUser();
  const isAdmin = currentUser?.role === 'admin';

  return (
    <PageContainer>
      {/* Header */}
      <div className="flex items-center justify-between mb-6 animate-fade-in">
        <div>
          <h2 className="text-2xl font-bold text-foreground tracking-tight">
            Jugadores
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            {players.length} {players.length === 1 ? 'jugador registrado' : 'jugadores registrados'}
          </p>
        </div>
        
        {isAdmin && <AddPlayerModal />}
      </div>

      {/* Player List */}
      {players.length === 0 ? (
        <Card className="animate-fade-in">
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-4">
              <UserPlus size={28} className="text-accent" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-1">
              Sin jugadores aún
            </h3>
            <p className="text-muted-foreground text-sm text-center max-w-xs">
              Los jugadores aparecerán aquí cuando se registren en la plataforma.
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-2 animate-slide-up">
          {players.map((player, index) => (
            <Link key={player.id} href={`/players/${player.id}`}>
              <Card
                variant="interactive"
                className={`delay-${Math.min(index + 1, 5)}`}
              >
                <div className="flex items-center gap-3">
                  <Avatar player={player} size="md" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">
                      {player.first_name} {player.last_name}
                    </p>
                    {player.nickname && (
                      <p className="text-xs text-muted-foreground truncate">
                        &quot;{player.nickname}&quot;
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={player.role === 'admin' ? 'warning' : 'default'}>
                      {player.role === 'admin' ? 'Admin' : 'Jugador'}
                    </Badge>
                    {isAdmin && player.id !== currentUser?.id && (
                      <DeletePlayerButton 
                        playerId={player.id} 
                        playerName={`${player.first_name} ${player.last_name}`} 
                      />
                    )}
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </PageContainer>
  );
}

