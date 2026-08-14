import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getCircuitState, recordDbFailure, recordDbSuccess, withTimeout } from './circuit-breaker';

describe('Circuit Breaker & Resilience', () => {
  beforeEach(() => {
    recordDbSuccess();
  });

  it('debería inicializarse en estado CLOSED', () => {
    const state = getCircuitState();
    expect(state.status).toBe('CLOSED');
    expect(state.failures).toBe(0);
  });

  it('debería abrir el circuito (OPEN) tras superar el umbral de fallos', () => {
    recordDbFailure(new Error('Fallo 1'));
    recordDbFailure(new Error('Fallo 2'));
    expect(getCircuitState().status).toBe('CLOSED');

    recordDbFailure(new Error('Fallo 3'));
    expect(getCircuitState().status).toBe('OPEN');
  });

  it('debería cerrarse nuevamente al registrar éxito', () => {
    recordDbFailure(new Error('Fallo'));
    recordDbFailure(new Error('Fallo'));
    recordDbFailure(new Error('Fallo'));
    expect(getCircuitState().status).toBe('OPEN');

    recordDbSuccess();
    expect(getCircuitState().status).toBe('CLOSED');
    expect(getCircuitState().failures).toBe(0);
  });

  it('withTimeout debería resolver la promesa si responde a tiempo', async () => {
    const fastPromise = Promise.resolve('ok');
    const res = await withTimeout(fastPromise, 100);
    expect(res).toBe('ok');
  });

  it('withTimeout debería lanzar error si la promesa excede el tiempo límite', async () => {
    const slowPromise = new Promise((resolve) => setTimeout(resolve, 200));
    await expect(withTimeout(slowPromise, 50, 'Timeout DB')).rejects.toThrow('Timeout DB');
  });
});
