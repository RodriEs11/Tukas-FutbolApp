export const ALL_PITCH_POSITIONS = [
  'gk',
  'def-c',
  'def-l',
  'def-r',
  'mid-c',
  'mid-l',
  'mid-r',
  'fwd',
] as const;

export type PitchPosition = typeof ALL_PITCH_POSITIONS[number];

export interface PlayerPositionInfo {
  id?: string;
  position?: string | null;
  preferred_foot?: string | null;
}

/**
 * Returns prioritized pitch positions based on a player's profile position and preferred foot.
 */
export function getPreferredPositions(
  position?: string | null,
  preferredFoot?: string | null
): PitchPosition[] {
  const normPosition = position?.toLowerCase().trim();
  const normFoot = preferredFoot?.toLowerCase().trim();

  if (normPosition === 'arquero' || normPosition === 'portero' || normPosition === 'goalkeeper') {
    return ['gk'];
  }

  if (normPosition === 'defensa' || normPosition === 'defender') {
    if (normFoot === 'izquierda' || normFoot === 'izquierdo' || normFoot === 'left') {
      return ['def-l', 'def-c', 'def-r'];
    }
    if (normFoot === 'derecha' || normFoot === 'derecho' || normFoot === 'right') {
      return ['def-r', 'def-c', 'def-l'];
    }
    return ['def-c', 'def-l', 'def-r'];
  }

  if (normPosition === 'mediocampista' || normPosition === 'medio' || normPosition === 'midfielder') {
    if (normFoot === 'izquierda' || normFoot === 'izquierdo' || normFoot === 'left') {
      return ['mid-l', 'mid-c', 'mid-r'];
    }
    if (normFoot === 'derecha' || normFoot === 'derecho' || normFoot === 'right') {
      return ['mid-r', 'mid-c', 'mid-l'];
    }
    return ['mid-c', 'mid-l', 'mid-r'];
  }

  if (normPosition === 'delantero' || normPosition === 'forward' || normPosition === 'striker') {
    return ['fwd'];
  }

  return [];
}

/**
 * Assigns a pitch position for a single player considering currently occupied positions.
 * Updates occupiedPositions in-place if a position is assigned.
 */
export function assignNextPitchPosition(
  player: PlayerPositionInfo,
  occupiedPositions: Set<string>
): string | null {
  const preferences = getPreferredPositions(player.position, player.preferred_foot);

  // Try preferred positions first
  for (const pos of preferences) {
    if (!occupiedPositions.has(pos)) {
      occupiedPositions.add(pos);
      return pos;
    }
  }

  // Fallback to general tactical order: gk -> def-c -> def-l -> def-r -> mid-c -> mid-l -> mid-r -> fwd
  for (const pos of ALL_PITCH_POSITIONS) {
    if (!occupiedPositions.has(pos)) {
      occupiedPositions.add(pos);
      return pos;
    }
  }

  return null;
}

/**
 * Assigns pitch positions to a batch of players.
 */
export function assignPitchPositionsBatch(
  players: PlayerPositionInfo[],
  currentlyOccupied: (string | null | undefined)[]
): Map<string, string | null> {
  const occupied = new Set<string>(
    currentlyOccupied.filter((pos): pos is string => Boolean(pos))
  );

  const assignments = new Map<string, string | null>();

  for (const player of players) {
    const assigned = assignNextPitchPosition(player, occupied);
    if (player.id) {
      assignments.set(player.id, assigned);
    }
  }

  return assignments;
}
