'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ServerOff, WifiOff } from 'lucide-react';

export default function MaintenancePage() {
  const router = useRouter();

  useEffect(() => {
    // Al montar (o recargar) la página, se verifica una única vez si la DB ya revivió
    async function verifyDbOnMount() {
      try {
        const res = await fetch('/api/health/db', {
          cache: 'no-store',
          headers: { 'Cache-Control': 'no-cache' },
        });

        if (res.ok) {
          router.replace('/');
          router.refresh();
        }
      } catch {
        // DB sigue caída, permanecer en el cartel sin hacer nada más
      }
    }

    verifyDbOnMount();
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Glow ambiental de fondo */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <main className="w-full max-w-md bg-slate-900/80 border border-slate-800 backdrop-blur-xl rounded-2xl p-6 sm:p-8 shadow-2xl relative z-10 flex flex-col items-center text-center">
        {/* Icono de estado */}
        <div className="relative mb-6">
          <div className="w-20 h-20 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <ServerOff className="w-10 h-10" />
          </div>
          <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
            <span className="relative inline-flex rounded-full h-4 w-4 bg-amber-500"></span>
          </span>
        </div>

        {/* Título y Mensaje */}
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-3">
          Servicio en Mantenimiento
        </h1>
        <p className="text-slate-400 text-sm sm:text-base leading-relaxed mb-6">
          El servidor de base de datos no se encuentra disponible en este momento. Estamos trabajando para reanudar el servicio a la brevedad.
        </p>

        {/* Tarjeta Informativa de Estado */}
        <div className="w-full bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 flex items-center justify-between text-xs sm:text-sm">
          <span className="text-slate-400">Estado del Sistema</span>
          <span className="font-semibold px-2.5 py-1 rounded-full text-xs bg-amber-500/10 text-amber-400 border border-amber-500/20">
            FUERA DE SERVICIO
          </span>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-8 text-xs text-slate-400 text-center flex items-center gap-2">
        <WifiOff className="w-3.5 h-3.5" />
        <span>Las Tukas — Centro de Estado</span>
      </footer>
    </div>
  );
}
