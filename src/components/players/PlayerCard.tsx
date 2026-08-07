'use client';

import { useRef, useState, useCallback } from 'react';
import { getInitials, stringToColor } from '@/lib/utils/helpers';
import type { UserProfile, PlayerStats } from '@/lib/types/database';

interface PlayerCardProps {
  player: UserProfile;
  stats: PlayerStats | null;
  rating: number | null;
}

export function PlayerCard({ player, stats, rating }: PlayerCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState('');
  const [isHovering, setIsHovering] = useState(false);

  const winRate =
    stats && stats.matches_played > 0
      ? Math.round((stats.wins / stats.matches_played) * 100)
      : 0;

  const golesPerMatch =
    stats && stats.matches_played > 0
      ? (stats.goals / stats.matches_played).toFixed(1)
      : '0.0';

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -15;
    const rotateY = ((x - centerX) / centerX) * 15;

    setTransform(
      `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
    );
  }, []);

  const handleMouseEnter = useCallback(() => {
    setIsHovering(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovering(false);
    setTransform('');
  }, []);

  const handleTouchMove = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      if (!cardRef.current || !e.touches[0]) return;

      const rect = cardRef.current.getBoundingClientRect();
      const x = e.touches[0].clientX - rect.left;
      const y = e.touches[0].clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -10;
      const rotateY = ((x - centerX) / centerX) * 10;

      setTransform(
        `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
      );
      setIsHovering(true);
    },
    []
  );

  const handleTouchEnd = useCallback(() => {
    setIsHovering(false);
    setTransform('');
  }, []);

  const initials = getInitials(player);
  const bgColor = stringToColor(player.id);

  return (
    <div
      ref={cardRef}
      className={`player-card animate-card-entrance ${
        isHovering ? 'player-card-tilt' : 'player-card-tilt-reset'
      }`}
      style={{ transform: transform || undefined }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Shine overlay */}
      <div className="player-card-shine" />

      <div className="player-card-content">
        {/* Rating */}
        <div className="self-start">
          {rating !== null ? (
            <div className="player-card-rating">{rating}</div>
          ) : (
            <div className="player-card-rating player-card-rating-unrated">
              --
            </div>
          )}
        </div>

        {/* Avatar */}
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

        {/* Name section */}
        <div>
          <div className="player-card-divider" />
          <div className="mt-2">
            <div className="player-card-name">
              {player.first_name} {player.last_name}
            </div>
            {player.nickname && (
              <div className="player-card-nickname">
                &quot;{player.nickname}&quot;
              </div>
            )}
          </div>
          <div className="player-card-divider mt-2" />
        </div>

        {/* Stats */}
        <div className="player-card-stats">
          <div className="player-card-stat">
            <span className="player-card-stat-value">{golesPerMatch}</span>
            <span className="player-card-stat-label">GOL</span>
          </div>
          <div className="player-card-stat">
            <span className="player-card-stat-value">{winRate}%</span>
            <span className="player-card-stat-label">VIC</span>
          </div>
          <div className="player-card-stat">
            <span className="player-card-stat-value">
              {stats?.points ?? 0}
            </span>
            <span className="player-card-stat-label">PTS</span>
          </div>
          <div className="player-card-stat">
            <span className="player-card-stat-value">
              {stats?.matches_played ?? 0}
            </span>
            <span className="player-card-stat-label">PJ</span>
          </div>
        </div>

        {/* Brand */}
        <div className="player-card-brand">⚽ Tukas</div>
      </div>
    </div>
  );
}
