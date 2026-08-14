'use client';

import React from 'react';
import { ServerOff, RefreshCw } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 text-center antialiased">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-4">
            <ServerOff className="w-8 h-8" />
          </div>

          <h1 className="text-2xl font-bold text-white mb-2">
            Interrupción de Conexión Crítica
          </h1>

          <p className="text-slate-400 text-sm mb-6">
            La aplicación no pudo cargar los recursos esenciales del servidor o base de datos.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <button
              onClick={() => reset()}
              className="flex-1 inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-2.5 px-4 rounded-xl transition-colors text-sm cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              Recargar Aplicación
            </button>
            <a
              href="/maintenance"
              className="flex-1 inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium py-2.5 px-4 rounded-xl transition-colors text-sm"
            >
              Centro de Mantenimiento
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
