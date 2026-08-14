import { describe, it, expect } from 'vitest';
import {
  getPreferredPositions,
  assignNextPitchPosition,
  assignPitchPositionsBatch,
  ALL_PITCH_POSITIONS,
} from './pitchPositioning';

describe('pitchPositioning', () => {
  describe('getPreferredPositions', () => {
    it('returns gk for Arquero', () => {
      expect(getPreferredPositions('Arquero', 'Derecha')).toEqual(['gk']);
    });

    it('returns left-priority defense for Defensa with left foot', () => {
      expect(getPreferredPositions('Defensa', 'Izquierda')).toEqual(['def-l', 'def-c', 'def-r']);
    });

    it('returns right-priority defense for Defensa with right foot', () => {
      expect(getPreferredPositions('Defensa', 'Derecha')).toEqual(['def-r', 'def-c', 'def-l']);
    });

    it('returns center-first defense for Defensa with Ambas or unspecified foot', () => {
      expect(getPreferredPositions('Defensa', 'Ambas')).toEqual(['def-c', 'def-l', 'def-r']);
      expect(getPreferredPositions('Defensa', null)).toEqual(['def-c', 'def-l', 'def-r']);
    });

    it('returns left-priority midfield for Mediocampista with left foot', () => {
      expect(getPreferredPositions('Mediocampista', 'Izquierda')).toEqual(['mid-l', 'mid-c', 'mid-r']);
    });

    it('returns right-priority midfield for Mediocampista with right foot', () => {
      expect(getPreferredPositions('Mediocampista', 'Derecha')).toEqual(['mid-r', 'mid-c', 'mid-l']);
    });

    it('returns center-first midfield for Mediocampista with Ambas or unspecified foot', () => {
      expect(getPreferredPositions('Mediocampista', 'Ambas')).toEqual(['mid-c', 'mid-l', 'mid-r']);
    });

    it('returns fwd for Delantero', () => {
      expect(getPreferredPositions('Delantero', 'Derecha')).toEqual(['fwd']);
    });

    it('returns empty array for unknown or null position', () => {
      expect(getPreferredPositions(null, null)).toEqual([]);
    });
  });

  describe('assignNextPitchPosition', () => {
    it('assigns preferred position if available', () => {
      const occupied = new Set<string>();
      const pos = assignNextPitchPosition({ position: 'Arquero' }, occupied);
      expect(pos).toBe('gk');
      expect(occupied.has('gk')).toBe(true);
    });

    it('assigns next preferred position if first choice is occupied', () => {
      const occupied = new Set<string>(['def-r']);
      const pos = assignNextPitchPosition({ position: 'Defensa', preferred_foot: 'Derecha' }, occupied);
      expect(pos).toBe('def-c');
      expect(occupied.has('def-c')).toBe(true);
    });

    it('falls back to default tactical order when all role positions are occupied', () => {
      const occupied = new Set<string>(['fwd']);
      const pos = assignNextPitchPosition({ position: 'Delantero' }, occupied);
      expect(pos).toBe('gk'); // First available in tactical order
    });

    it('assigns according to tactical fallback order if position is unspecified', () => {
      const occupied = new Set<string>(['gk']);
      const pos = assignNextPitchPosition({ position: null }, occupied);
      expect(pos).toBe('def-c');
    });

    it('returns null if all pitch positions are occupied', () => {
      const occupied = new Set<string>(ALL_PITCH_POSITIONS);
      const pos = assignNextPitchPosition({ position: 'Delantero' }, occupied);
      expect(pos).toBeNull();
    });
  });

  describe('assignPitchPositionsBatch', () => {
    it('correctly distributes positions across a squad of players', () => {
      const players = [
        { id: 'p1', position: 'Arquero', preferred_foot: 'Derecha' },
        { id: 'p2', position: 'Defensa', preferred_foot: 'Izquierda' },
        { id: 'p3', position: 'Defensa', preferred_foot: 'Derecha' },
        { id: 'p4', position: 'Mediocampista', preferred_foot: 'Ambas' },
        { id: 'p5', position: 'Delantero', preferred_foot: 'Derecha' },
      ];

      const assignments = assignPitchPositionsBatch(players, []);

      expect(assignments.get('p1')).toBe('gk');
      expect(assignments.get('p2')).toBe('def-l');
      expect(assignments.get('p3')).toBe('def-r');
      expect(assignments.get('p4')).toBe('mid-c');
      expect(assignments.get('p5')).toBe('fwd');
    });

    it('respects already occupied positions in the match team', () => {
      const currentlyOccupied = ['gk', 'def-l'];
      const players = [
        { id: 'p1', position: 'Arquero', preferred_foot: 'Derecha' },
        { id: 'p2', position: 'Defensa', preferred_foot: 'Izquierda' },
      ];

      const assignments = assignPitchPositionsBatch(players, currentlyOccupied);

      // gk is occupied -> p1 gets def-c (fallback)
      expect(assignments.get('p1')).toBe('def-c');
      // def-l and def-c are occupied -> p2 gets def-r
      expect(assignments.get('p2')).toBe('def-r');
    });
  });
});
