'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { Trophy, LogOut } from 'lucide-react';
import { useUser } from '@/lib/hooks/useUser';
import { getInitials, stringToColor } from '@/lib/utils/helpers';
import { logout } from '@/lib/actions/auth';

const pageTitles: Record<string, string> = {
  '/dashboard': 'Inicio',
  '/players': 'Jugadores',
  '/matches': 'Partidos',
  '/fields': 'Canchas',
  '/profile': 'Mi Perfil',
};

export function Header() {
  const pathname = usePathname();
  const { profile } = useUser();
  const [menuOpen, setMenuOpen] = useState(false);

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
        
        <div className="flex items-center gap-1 relative">
          {profile ? (
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold text-white transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 relative z-50"
              style={{ backgroundColor: stringToColor(profile.id) }}
            >
              {getInitials(profile)}
            </button>
          ) : (
            <div className="w-8 h-8 rounded-full bg-zinc-800 animate-pulse relative z-50" />
          )}

          {menuOpen && (
            <>
              {/* Overlay for closing the menu */}
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setMenuOpen(false)} 
              />
              
              <div className="absolute right-0 top-full mt-2 w-48 bg-zinc-900 border border-zinc-800 rounded-xl shadow-xl overflow-hidden py-1 animate-in fade-in slide-in-from-top-2 z-50">
                <div className="px-4 py-2 border-b border-zinc-800/60">
                  <p className="text-sm font-medium text-foreground truncate">
                    {profile?.first_name} {profile?.last_name}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {profile?.role === 'admin' ? 'Administrador' : 'Jugador'}
                  </p>
                </div>
                <div className="p-2 flex items-center justify-between">
                  <span className="text-sm text-muted-foreground px-2">Tema</span>
                  <ThemeToggle />
                </div>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    logout();
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-zinc-800/50 flex items-center gap-2 transition-colors"
                >
                  <LogOut size={14} />
                  Cerrar sesión
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
