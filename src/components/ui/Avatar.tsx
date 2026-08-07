import { getInitials, stringToColor } from '@/lib/utils/helpers';
import type { UserProfile } from '@/lib/types/database';

interface AvatarProps {
  player: UserProfile;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeStyles = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-14 h-14 text-lg',
};

export function Avatar({ player, size = 'md', className = '' }: AvatarProps) {
  const initials = getInitials(player);
  const bgColor = stringToColor(player.id);

  if (player.avatar_url) {
    return (
      <img
        src={player.avatar_url}
        alt={`${player.first_name} ${player.last_name}`}
        className={`
          ${sizeStyles[size]} rounded-full object-cover
          ${className}
        `}
      />
    );
  }

  return (
    <div
      className={`
        ${sizeStyles[size]} rounded-full
        flex items-center justify-center
        font-semibold text-white
        ${className}
      `}
      style={{ backgroundColor: bgColor }}
    >
      {initials}
    </div>
  );
}
