'use client';

import { usePathname } from 'next/navigation';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { Trophy } from 'lucide-react';

const pageTitles: Record<string, string> = {
  '/dashboard': 'Inicio',
  '/players': 'Jugadores',
  '/matches': 'Partidos',
  '/fields': 'Canchas',
  '/profile': 'Mi Perfil',
};

export function Header() {
  const pathname = usePathname();

  // Match exact or parent path
  const title =
    pageTitles[pathname] ||
    Object.entries(pageTitles).find(([path]) =>
      pathname.startsWith(path)
    )?.[1] ||
    'Tukas';

  return (
    <header className="
      sticky top-0 z-40
      bg-zinc-950/80 backdrop-blur-xl
      border-b border-zinc-800/60
    ">
      <div className="flex items-center justify-between h-14 px-4 max-w-3xl mx-auto">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-600 shadow-lg shadow-emerald-500/20">
            <Trophy size={16} className="text-white" />
          </div>
          <h1 className="text-lg font-bold text-zinc-100 tracking-tight">
            {title}
          </h1>
        </div>
        <div className="flex items-center gap-1">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
