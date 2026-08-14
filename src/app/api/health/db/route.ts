import { NextResponse } from 'next/server';
import { checkDatabaseHealth, getCircuitState } from '@/lib/circuit-breaker';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const circuit = getCircuitState();
  const health = await checkDatabaseHealth();

  if (!health.isHealthy) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        database: 'offline',
        circuitBreaker: circuit.status,
        latencyMs: health.latencyMs,
        error: health.error,
        timestamp: new Date().toISOString(),
      },
      { status: 503 }
    );
  }

  return NextResponse.json(
    {
      status: 'healthy',
      database: 'online',
      circuitBreaker: circuit.status,
      latencyMs: health.latencyMs,
      timestamp: new Date().toISOString(),
    },
    { status: 200 }
  );
}
