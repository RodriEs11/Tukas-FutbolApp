'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { getPlayerDisplayName } from '@/lib/utils/helpers';
import { addPlayerToMatch, removePlayerFromMatch, updateMatchPlayer } from '@/lib/actions/matches';
import { Goal, Plus, Minus, UserMinus } from 'lucide-react';
import type { UserProfile, MatchPlayer } from '@/lib/types/database';

interface MatchTeamAdminProps {
  matchId: string;
  team: 'A' | 'B';
  teamName: string;
  matchPlayers: MatchPlayer[];
  allPlayers: UserProfile[];
  isAdmin: boolean;
  isPlayed: boolean;
}

export function MatchTeamAdmin({ matchId, team, teamName, matchPlayers, allPlayers, isAdmin, isPlayed }: MatchTeamAdminProps) {
  const [loading, setLoading] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState('');

  // Players not in this match
  const availablePlayers = allPlayers.filter(
    (p) => !matchPlayers.some((mp) => mp.player_id === p.id)
  );

  async function handleAddPlayer() {
    if (!selectedPlayer) return;
    setLoading(true);
    await addPlayerToMatch(matchId, selectedPlayer, team);
    setSelectedPlayer('');
    setLoading(false);
  }

  async function handleRemovePlayer(playerId: string) {
    if (!confirm('¿Seguro que deseas eliminar a este jugador del partido?')) return;
    setLoading(true);
    await removePlayerFromMatch(matchId, playerId);
    setLoading(false);
  }

  async function handleUpdateGoals(mp: MatchPlayer, increment: number) {
    const newGoals = Math.max(0, mp.goals + increment);
    if (newGoals === mp.goals) return;
    
    setLoading(true);
    const formData = new FormData();
    formData.append('id', mp.id);
    formData.append('goals', newGoals.toString());
    formData.append('attended', 'true');
    await updateMatchPlayer(formData);
    setLoading(false);
  }

  const teamColor = team === 'A' ? 'emerald' : 'sky';

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <div className={`w-3 h-3 rounded-full bg-${teamColor}-500`} />
        <h3 className="text-sm font-semibold text-foreground">
          {teamName}
        </h3>
        <span className="text-xs text-muted-foreground">
          ({matchPlayers.length})
        </span>
      </div>

      {isAdmin && (
        <div className="flex gap-2 mb-3">
          <select
            value={selectedPlayer}
            onChange={(e) => setSelectedPlayer(e.target.value)}
            disabled={loading}
            className="flex-1 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
          >
            <option value="">Añadir jugador...</option>
            {availablePlayers.map(p => (
              <option key={p.id} value={p.id}>{getPlayerDisplayName(p)}</option>
            ))}
          </select>
          <Button size="sm" onClick={handleAddPlayer} disabled={!selectedPlayer || loading}>
            <Plus size={16} />
          </Button>
        </div>
      )}

      {matchPlayers.length === 0 ? (
        <Card>
          <p className="text-xs text-muted-foreground text-center py-4">
            Sin jugadores asignados
          </p>
        </Card>
      ) : (
        <Card padding="none">
          <div className="divide-y divide-border">
            {matchPlayers.map((mp) => (
              <div
                key={mp.id}
                className="flex items-center gap-3 px-4 py-2.5"
              >
                {mp.player && (
                  <>
                    <Avatar player={mp.player} size="sm" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground truncate">
                        {getPlayerDisplayName(mp.player)}
                      </p>
                    </div>
                  </>
                )}
                
                <div className="flex items-center gap-3">
                  {(mp.goals > 0 || isAdmin) && (
                    <div className={`flex items-center gap-2 text-${teamColor}-400`}>
                      {isAdmin && (
                        <button onClick={() => handleUpdateGoals(mp, -1)} disabled={loading || mp.goals === 0} className="hover:text-white disabled:opacity-50">
                          <Minus size={14} />
                        </button>
                      )}
                      <Goal size={12} />
                      <span className="text-xs font-bold w-3 text-center">{mp.goals}</span>
                      {isAdmin && (
                        <button onClick={() => handleUpdateGoals(mp, 1)} disabled={loading} className="hover:text-white disabled:opacity-50">
                          <Plus size={14} />
                        </button>
                      )}
                    </div>
                  )}
                  {isAdmin && (
                    <button onClick={() => handleRemovePlayer(mp.player_id)} disabled={loading} className="text-red-400 hover:text-red-300 ml-2">
                      <UserMinus size={14} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
