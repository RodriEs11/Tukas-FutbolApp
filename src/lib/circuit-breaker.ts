/**
 * Circuit Breaker y verificación de salud para la conexión a la base de datos (Supabase).
 * Proporciona fail-fast y previene el bloqueo de peticiones cuando la DB está inaccesible.
 */

export interface CircuitBreakerState {
  status: 'CLOSED' | 'OPEN' | 'HALF_OPEN';
  failures: number;
  lastFailureTime: number | null;
  lastSuccessTime: number | null;
}

const CIRCUIT_CONFIG = {
  FAILURE_THRESHOLD: 3, // Número de fallos consecutivos antes de abrir el circuito
  RECOVERY_TIMEOUT_MS: 15000, // Tiempo que el circuito permanece abierto antes de probar estado half-open (15s)
  REQUEST_TIMEOUT_MS: 3000, // Timeout estricto para operaciones críticas de DB (3s)
};

// Estado en memoria para la instancia Node.js / Serverless
let circuitState: CircuitBreakerState = {
  status: 'CLOSED',
  failures: 0,
  lastFailureTime: null,
  lastSuccessTime: null,
};

/**
 * Retorna el estado actual del Circuit Breaker.
 */
export function getCircuitState(): Readonly<CircuitBreakerState> {
  // Si el circuito está abierto pero ya pasó el tiempo de recuperación, pasar a HALF_OPEN
  if (
    circuitState.status === 'OPEN' &&
    circuitState.lastFailureTime &&
    Date.now() - circuitState.lastFailureTime > CIRCUIT_CONFIG.RECOVERY_TIMEOUT_MS
  ) {
    circuitState.status = 'HALF_OPEN';
  }
  return { ...circuitState };
}

/**
 * Registra un fallo de conexión a la base de datos.
 */
export function recordDbFailure(error?: unknown): void {
  circuitState.failures += 1;
  circuitState.lastFailureTime = Date.now();

  if (
    circuitState.status === 'HALF_OPEN' ||
    circuitState.failures >= CIRCUIT_CONFIG.FAILURE_THRESHOLD
  ) {
    circuitState.status = 'OPEN';
  }
  console.error('[DB Circuit Breaker] Fallo registrado:', error);
}

/**
 * Registra un éxito en la conexión a la base de datos.
 */
export function recordDbSuccess(): void {
  circuitState.status = 'CLOSED';
  circuitState.failures = 0;
  circuitState.lastSuccessTime = Date.now();
}

/**
 * Ejecuta una promesa con un timeout estricto.
 */
export async function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number = CIRCUIT_CONFIG.REQUEST_TIMEOUT_MS,
  errorMessage: string = 'Timeout de conexión a la base de datos'
): Promise<T> {
  let timeoutHandle: NodeJS.Timeout;

  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutHandle = setTimeout(() => {
      reject(new Error(errorMessage));
    }, timeoutMs);
  });

  try {
    const result = await Promise.race([promise, timeoutPromise]);
    return result;
  } finally {
    clearTimeout(timeoutHandle!);
  }
}

/**
 * Realiza un health-check rápido y liviano directamente al endpoint REST de Supabase.
 */
export async function checkDatabaseHealth(): Promise<{ isHealthy: boolean; latencyMs: number; error?: string }> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return {
      isHealthy: false,
      latencyMs: 0,
      error: 'Variables de entorno de Supabase no configuradas',
    };
  }

  const startTime = Date.now();
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), CIRCUIT_CONFIG.REQUEST_TIMEOUT_MS);

  try {
    // Ping ligero al endpoint raíz de PostgREST (/rest/v1/)
    const response = await fetch(`${supabaseUrl}/rest/v1/`, {
      method: 'GET',
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
      },
      signal: controller.signal,
      cache: 'no-store',
    });

    const latencyMs = Date.now() - startTime;

    // PostgREST responde 200 OK con la OpenAPI spec si está saludable
    if (response.ok || response.status === 404 || response.status === 200) {
      recordDbSuccess();
      return { isHealthy: true, latencyMs };
    } else {
      recordDbFailure(`Status code: ${response.status}`);
      return { isHealthy: false, latencyMs, error: `HTTP ${response.status}` };
    }
  } catch (err: any) {
    const latencyMs = Date.now() - startTime;
    recordDbFailure(err?.message || 'Error de red');
    return {
      isHealthy: false,
      latencyMs,
      error: err?.name === 'AbortError' ? 'Timeout de conexión excedido' : (err?.message || 'Error de conexión'),
    };
  } finally {
    clearTimeout(timeoutId);
  }
}
