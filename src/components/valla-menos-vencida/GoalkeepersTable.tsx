'use client';

import { GoalkeeperStat } from '@/lib/types/database';
import { Avatar } from '@/components/ui/Avatar';
import { Trophy, Shield } from 'lucide-react';

interface GoalkeepersTableProps {
  goalkeepers: GoalkeeperStat[];
}

export function GoalkeepersTable({ goalkeepers }: GoalkeepersTableProps) {
  if (goalkeepers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-card rounded-2xl border border-border">
        <div className="w-16 h-16 mb-4 rounded-full bg-muted/50 flex items-center justify-center">
          <Shield className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">Sin arqueros registrados</h3>
        <p className="text-sm text-muted-foreground max-w-sm">
          Aún no hay arqueros asignados en partidos finalizados.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
      <div className="w-full">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted/30 border-b border-border text-muted-foreground text-xs sm:text-sm">
            <tr>
              <th className="px-2 sm:px-4 py-3 font-medium w-8 sm:w-12 text-center">#</th>
              <th className="px-2 sm:px-4 py-3 font-medium">ARQUERO</th>
              <th className="px-2 sm:px-4 py-3 font-medium text-center" title="Partidos como Arquero">PJ</th>
              <th className="px-2 sm:px-4 py-3 font-medium text-center" title="Goles Recibidos">GR</th>
              <th className="px-2 sm:px-4 py-3 font-medium text-center" title="Promedio de Goles Recibidos por Partido">PROM</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border text-xs sm:text-sm">
            {goalkeepers.map((stat, index) => {
              const isFirst = index === 0;
              const isTopThree = index < 3;
              
              return (
                <tr 
                  key={stat.player.id} 
                  className={`
                    transition-colors hover:bg-muted/30
                    ${isFirst ? 'bg-amber-500/5 dark:bg-amber-500/10' : ''}
                  `}
                >
                  <td className="px-1 sm:px-4 py-3 sm:py-4 text-center font-semibold">
                    {isFirst ? (
                      <div className="flex justify-center" title="Valla menos vencida">
                        <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 drop-shadow-sm" />
                      </div>
                    ) : (
                      <span className={isTopThree ? 'text-foreground' : 'text-muted-foreground'}>
                        {index + 1}
                      </span>
                    )}
                  </td>
                  <td className="px-2 sm:px-4 py-3 sm:py-4 max-w-[120px] sm:max-w-[200px]">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <Avatar player={stat.player} size="sm" className="hidden sm:flex" />
                      <div className="truncate">
                        <div className="flex items-center gap-1.5">
                          <p className={`font-medium truncate ${isFirst ? 'text-amber-600 dark:text-amber-500' : 'text-foreground'}`}>
                            {stat.player.nickname || `${stat.player.first_name} ${stat.player.last_name}`}
                          </p>
                          {isFirst && (
                            <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 shrink-0">
                              Valla menos vencida 🧤
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-2 sm:px-4 py-3 sm:py-4 text-center text-muted-foreground">
                    {stat.matches_as_gk}
                  </td>
                  <td className="px-2 sm:px-4 py-3 sm:py-4 text-center">
                    <span className={`inline-flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full font-bold
                      ${isFirst ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' : 'bg-muted text-foreground'}
                    `}>
                      {stat.goals_conceded}
                    </span>
                  </td>
                  <td className="px-2 sm:px-4 py-3 sm:py-4 text-center font-mono font-semibold text-foreground">
                    {stat.average_goals_conceded.toFixed(2)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
