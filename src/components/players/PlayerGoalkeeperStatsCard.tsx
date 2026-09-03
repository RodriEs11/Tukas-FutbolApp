import { Shield, Award, CheckCircle2, AlertCircle, Percent, Hash } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import type { PlayerStats } from '@/lib/types/database';

interface PlayerGoalkeeperStatsCardProps {
  stats: PlayerStats;
}

export function PlayerGoalkeeperStatsCard({ stats }: PlayerGoalkeeperStatsCardProps) {
  const matchesAsGk = stats.matches_as_gk ?? 0;
  const goalsConceded = stats.goals_conceded ?? 0;
  const avgGoalsConceded = stats.average_goals_conceded ?? 0;
  const cleanSheets = stats.clean_sheets ?? 0;
  const cleanSheetPct = stats.clean_sheet_percentage ?? 0;
  const cleanSheetPointsAvg = stats.clean_sheet_points_avg ?? 0;
  const isEligible = stats.is_gk_eligible ?? false;
  const minRequired = stats.min_gk_matches_required ?? 3;

  return (
    <div className="space-y-3 animate-slide-up">
      {/* Header section with title and eligibility badge */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Shield size={18} />
          </div>
          <div>
            <h3 className="text-base font-semibold text-foreground">
              Estadísticas en el Arco
            </h3>
            <p className="text-xs text-muted-foreground">
              Rendimiento como arquero
            </p>
          </div>
        </div>

        {/* Eligibility for Valla Menos Vencida */}
        {isEligible ? (
          <Badge variant="success" className="gap-1 py-1 text-xs">
            <CheckCircle2 size={12} />
            Elegible en Ranking
          </Badge>
        ) : (
          <Badge variant="warning" className="gap-1 py-1 text-xs" title={`Requiere al menos ${minRequired} partidos como arquero`}>
            <AlertCircle size={12} />
            {matchesAsGk}/{minRequired} PJ mín.
          </Badge>
        )}
      </div>

      {/* Main highlight metrics */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="text-center p-3">
          <div className="flex flex-col items-center gap-1">
            <span className="text-xs font-medium text-muted-foreground">Partidos</span>
            <span className="text-2xl font-bold text-foreground">
              {matchesAsGk}
            </span>
            <span className="text-[11px] text-muted-foreground">PJ al arco</span>
          </div>
        </Card>

        <Card className="text-center p-3 stat-glow">
          <div className="flex flex-col items-center gap-1">
            <span className="text-xs font-medium text-emerald-400">Vallas Invictas</span>
            <span className="text-2xl font-bold text-emerald-400">
              {cleanSheets}
            </span>
            <span className="text-[11px] text-muted-foreground">Arcos en 0</span>
          </div>
        </Card>

        <Card className="text-center p-3">
          <div className="flex flex-col items-center gap-1">
            <span className="text-xs font-medium text-muted-foreground">Goles Recibidos</span>
            <span className="text-2xl font-bold text-foreground">
              {goalsConceded}
            </span>
            <span className="text-[11px] text-muted-foreground">Totales</span>
          </div>
        </Card>
      </div>

      {/* Detailed metrics card */}
      <Card>
        <div className="space-y-3.5 p-1">
          {/* Promedio de goles recibidos */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Hash size={16} className="text-sky-400" />
              <span className="text-sm text-muted-foreground">
                Promedio de Goles Recibidos
              </span>
            </div>
            <span className="text-sm font-bold text-foreground">
              {matchesAsGk > 0 ? avgGoalsConceded.toFixed(2) : '-'}
              <span className="text-xs font-normal text-muted-foreground ml-1">G/P</span>
            </span>
          </div>

          {/* Porcentaje de vallas invictas */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Percent size={16} className="text-emerald-400" />
              <span className="text-sm text-muted-foreground">
                % Vallas Invictas
              </span>
            </div>
            <span className="text-sm font-bold text-emerald-400">
              {matchesAsGk > 0 ? `${cleanSheetPct}%` : '-'}
            </span>
          </div>

          <hr className="border-border" />

          {/* Puntaje promedio de arquero (0-10) */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award size={16} className="text-amber-400" />
              <div>
                <span className="text-sm text-muted-foreground">
                  Puntaje Promedio (Valla Menos Vencida)
                </span>
                <p className="text-[11px] text-muted-foreground">
                  Escala de 0 a 10 pts según goles concedidos
                </p>
              </div>
            </div>
            <span className="text-sm font-bold text-amber-400">
              {matchesAsGk > 0 ? `${cleanSheetPointsAvg.toFixed(1)} pts` : '-'}
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
}
