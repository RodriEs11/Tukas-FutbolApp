'use client';

import { useMemo } from 'react';
import { getInitials, stringToColor, isGoalkeeper } from '@/lib/utils/helpers';
import { getCardTier } from '@/lib/utils/rating';
import type { UserProfile, PlayerStats } from '@/lib/types/database';

interface PlayerCardProps {
  player: UserProfile;
  stats: PlayerStats | null;
  rating: number | null;
}

export function PlayerCard({ player, stats, rating }: PlayerCardProps) {
  const tier = useMemo(() => getCardTier(rating), [rating]);
  const isGk = isGoalkeeper(player.position);

  const winRate =
    stats && stats.matches_played > 0
      ? Math.round((stats.wins / stats.matches_played) * 100)
      : 0;

  const golesPerMatch =
    stats && stats.matches_played > 0
      ? (stats.goals / stats.matches_played).toFixed(1)
      : '0.0';

  const vallaMenosVencida =
    stats && (stats.matches_as_gk ?? 0) > 0
      ? (stats.clean_sheet_points_avg ?? 0).toFixed(1)
      : (stats?.matches_played ?? 0) === 0
      ? '0.0'
      : (stats?.clean_sheet_points_avg ?? 0).toFixed(1);

  const arcosEnCero = stats?.clean_sheets ?? 0;

  const initials = getInitials(player);
  const bgColor = stringToColor(player.id);

  return (
    <div
      className={`player-card animate-card-entrance tier-${tier.tier}`}
    >
      <div className="player-card-bg" />
      {/* Shine overlay */}
      <div className="player-card-shine" />

      <div className="player-card-content">
        
        {/* Top Section (Rating + Avatar) */}
        <div className="flex relative w-full h-[150px]">
          {/* Left: Stats */}
          <div className="flex flex-col items-center w-[35%] pt-6 z-10">
            {rating !== null ? (
              <div className="player-card-rating">{rating}</div>
            ) : (
              <div className="player-card-rating player-card-rating-unrated">--</div>
            )}
            <div className="player-card-tier-label">
              {player.position ? player.position.substring(0, 3).toUpperCase() : 'POS'}
            </div>
            {player.preferred_foot && (
              <div className="player-card-foot">
                {player.preferred_foot.substring(0, 3).toUpperCase()}
              </div>
            )}
          </div>

          {/* Right: Avatar */}
          <div className="absolute right-[0px] top-[15px] z-0">
            {player.avatar_url ? (
              <img
                src={player.avatar_url}
                alt={`${player.first_name} ${player.last_name}`}
                className="player-card-avatar"
              />
            ) : (
              <div
                className="player-card-avatar"
                style={{ backgroundColor: bgColor }}
              >
                {initials}
              </div>
            )}
          </div>
        </div>

        {/* Name section */}
        <div className="w-full mt-auto z-10">
          <div className="player-card-name">
            {player.first_name} {player.last_name}
          </div>
          <div className="player-card-divider" />
        </div>

        {/* Stats Grid */}
        {isGk ? (
          <div className="player-card-stats z-10">
            <div className="player-card-stat" title="Valla menos vencida">
              <span className="player-card-stat-value">{vallaMenosVencida}</span>
              <span className="player-card-stat-label">VMV</span>
            </div>
            <div className="player-card-stat" title="Arcos en cero">
              <span className="player-card-stat-value">{arcosEnCero}</span>
              <span className="player-card-stat-label">ARC</span>
            </div>
            <div className="player-card-stat" title="Porcentaje de victorias">
              <span className="player-card-stat-value">{winRate}%</span>
              <span className="player-card-stat-label">VIC</span>
            </div>
            <div className="player-card-stat" title="Partidos jugados">
              <span className="player-card-stat-value">{stats?.matches_played ?? 0}</span>
              <span className="player-card-stat-label">PJ</span>
            </div>
          </div>
        ) : (
          <div className="player-card-stats z-10">
            <div className="player-card-stat" title="Goles por partido">
              <span className="player-card-stat-value">{golesPerMatch}</span>
              <span className="player-card-stat-label">GOL</span>
            </div>
            <div className="player-card-stat" title="Puntos">
              <span className="player-card-stat-value">{stats?.points ?? 0}</span>
              <span className="player-card-stat-label">PTS</span>
            </div>
            <div className="player-card-stat" title="Porcentaje de victorias">
              <span className="player-card-stat-value">{winRate}%</span>
              <span className="player-card-stat-label">VIC</span>
            </div>
            <div className="player-card-stat" title="Partidos jugados">
              <span className="player-card-stat-value">{stats?.matches_played ?? 0}</span>
              <span className="player-card-stat-label">PJ</span>
            </div>
          </div>
        )}

        {/* Brand */}
        <div className="player-card-brand mt-4 z-10">TUKAS</div>
      </div>
    </div>
  );
}
