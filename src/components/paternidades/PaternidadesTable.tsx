'use client';

import { PaternityStat } from '@/lib/types/database';
import { Avatar } from '@/components/ui/Avatar';
import { Baby, Trophy, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { PaternityDetailModal } from './PaternityDetailModal';

interface PaternidadesTableProps {
  paternities: PaternityStat[];
}

export function PaternidadesTable({ paternities }: PaternidadesTableProps) {
  const [selectedPaternity, setSelectedPaternity] = useState<PaternityStat | null>(null);

  if (paternities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-card rounded-2xl border border-border">
        <div className="w-16 h-16 mb-4 rounded-full bg-muted/50 flex items-center justify-center">
          <Baby className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">Sin Paternidades</h3>
        <p className="text-sm text-muted-foreground max-w-sm">
          Aún no hay jugadores con una ventaja de +3 victorias sobre otro en equipos opuestos.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted/30 border-b border-border text-muted-foreground text-xs sm:text-sm">
            <tr>
              <th className="px-2 sm:px-4 py-3 font-medium w-8 sm:w-12 text-center">#</th>
              <th className="px-2 sm:px-4 py-3 font-medium">PADRE</th>
              <th className="px-2 sm:px-4 py-3 font-medium text-center" title="Cantidad de Hijos">HIJOS</th>
              <th className="px-2 sm:px-4 py-3 font-medium text-right w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border text-xs sm:text-sm">
            {paternities.map((stat, index) => {
              const isFirst = index === 0;
              const isTopThree = index < 3;
              
              return (
                <tr 
                  key={stat.father.id} 
                  onClick={() => setSelectedPaternity(stat)}
                  className={`
                    cursor-pointer transition-colors hover:bg-muted/40
                    ${isFirst ? 'bg-amber-500/5 dark:bg-amber-500/10' : ''}
                  `}
                >
                  <td className="px-1 sm:px-4 py-3 sm:py-4 text-center font-semibold">
                    {isFirst ? (
                      <div className="flex justify-center">
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
                      <Avatar player={stat.father} size="sm" className="hidden sm:flex" />
                      <div className="truncate">
                        <p className={`font-medium truncate ${isFirst ? 'text-amber-600 dark:text-amber-500' : 'text-foreground'}`}>
                          {stat.father.nickname || `${stat.father.first_name} ${stat.father.last_name}`}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-2 sm:px-4 py-3 sm:py-4 text-center">
                    <span className={`inline-flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full font-bold
                      ${isFirst ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' : 'bg-muted text-foreground'}
                    `}>
                      {stat.sons.length}
                    </span>
                  </td>
                  <td className="px-2 sm:px-4 py-3 sm:py-4 text-right">
                    <ChevronRight className="w-4 h-4 text-muted-foreground inline-block opacity-60" />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <PaternityDetailModal 
        paternity={selectedPaternity} 
        onClose={() => setSelectedPaternity(null)} 
      />
    </>
  );
}

