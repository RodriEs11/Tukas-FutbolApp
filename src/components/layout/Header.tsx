'use client';

import { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { Avatar } from '@/components/ui/Avatar';
import Image from 'next/image';
import { Trophy, LogOut, User, Settings } from 'lucide-react';
import { useUser } from '@/lib/hooks/useUser';
import { getInitials, stringToColor } from '@/lib/utils/helpers';
import { logout } from '@/lib/actions/auth';

const pageTitles: Record<string, string> = {
  '/dashboard': 'Inicio',
  '/players': 'Jugadores',
  '/matches': 'Partidos',
  // '/fields': 'Canchas',
  '/scorers': 'Goleadores',
  '/valla-menos-vencida': 'Valla Menos Vencida',
  '/paternidades': 'Paternidades',
  '/profile': 'Mi Perfil',
};

export function Header() {
  const pathname = usePathname();
  const { user, profile, loading } = useUser();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }

    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

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
      bg-background/80 backdrop-blur-xl
      border-b border-border/60
    ">
      <div className="flex items-center justify-between h-14 px-4 max-w-3xl mx-auto">
        <div className="flex items-center gap-2.5">
          <div className="relative flex items-center justify-center w-8 h-8 rounded-full overflow-hidden border border-border/50 shadow-sm">
            <Image src="/Logo.jpeg" alt="Las Tukas" fill className="object-cover" />
          </div>
          <h1 className="text-lg font-bold text-foreground tracking-tight">
            Las Tukas
          </h1>
        </div>
        
        <div className="flex items-center gap-2 relative" ref={menuRef}>
          <ThemeToggle />
          {user || profile ? (
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 transition-colors text-sm font-medium relative z-50"
            >
              <User size={14} />
              <span>Admin</span>
            </button>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted hover:bg-muted/80 transition-colors text-sm font-medium text-foreground"
            >
              <User size={14} />
              <span>Iniciar Sesión</span>
            </Link>
          )}

          {menuOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-card border border-border rounded-xl shadow-xl overflow-hidden py-1 animate-in fade-in slide-in-from-top-2 z-50">
              <div className="px-4 py-2 border-b border-border/60">
                <p className="text-sm font-medium text-foreground truncate">
                  {profile?.first_name} {profile?.last_name}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {profile?.role === 'admin' ? 'Administrador' : 'Jugador'}
                </p>
              </div>

              <Link
                href="/profile/edit"
                onClick={() => setMenuOpen(false)}
                className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted/50 flex items-center gap-2 transition-colors border-b border-border/60"
              >
                <Settings size={14} />
                Editar perfil
              </Link>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  logout();
                }}
                className="w-full text-left px-4 py-2 text-sm text-destructive hover:bg-muted/50 flex items-center gap-2 transition-colors"
              >
                <LogOut size={14} />
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
