import { describe, it, expect } from 'vitest';
import { POINTS, MATCH_STATUS_LABELS, SURFACE_TYPE_LABELS, TEAM_LABELS } from './constants';

describe('Constants', () => {
  it('debería tener valores correctos para POINTS', () => {
    expect(POINTS.WIN).toBe(3);
    expect(POINTS.DRAW).toBe(1);
    expect(POINTS.LOSS).toBe(0);
  });
  
  it('debería definir etiquetas correctas', () => {
    expect(MATCH_STATUS_LABELS.scheduled).toBe('Programado');
    expect(SURFACE_TYPE_LABELS['césped']).toBe('Césped Natural');
    expect(TEAM_LABELS.A).toBe('Equipo A');
  });
});
