'use client';

import React, { useEffect } from 'react';
import { RefreshCw, ServerCrash, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Captured Error in page/component:', error);
  }, [error]);

  const isNetworkOrDbError =
    error.message?.toLowerCase().includes('database') ||
    error.message?.toLowerCase().includes('timeout') ||
    error.message?.toLowerCase().includes('supabase') ||
    error.message?.toLowerCase().includes('fetch failed') ||
    error.message?.toLowerCase().includes('network');

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500 mb-4">
        {isNetworkOrDbError ? (
          <ServerCrash className="w-8 h-8" />
        ) : (
          <AlertTriangle className="w-8 h-8" />
        )}
      </div>

      <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
        {isNetworkOrDbError
          ? 'Error al conectar con el servidor de datos'
          : 'Ocurrió un error inesperado'}
      </h2>

      <p className="text-muted-foreground text-sm max-w-md mb-6">
        {isNetworkOrDbError
          ? 'No pudimos obtener la información requerida de la base de datos. Puedes reintentar o verificar el estado de los servicios.'
          : error.message || 'Ha ocurrido una falla inesperada en esta sección.'}
      </p>

      <div className="flex items-center gap-3">
        <button
          onClick={() => reset()}
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-medium py-2 px-4 rounded-xl hover:opacity-90 transition-opacity cursor-pointer text-sm"
        >
          <RefreshCw className="w-4 h-4" />
          Reintentar acción
        </button>

        {isNetworkOrDbError && (
          <Link
            href="/maintenance"
            className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground font-medium py-2 px-4 rounded-xl hover:bg-secondary/80 transition-colors text-sm"
          >
            Ver estado del servicio
          </Link>
        )}
      </div>
    </div>
  );
}
