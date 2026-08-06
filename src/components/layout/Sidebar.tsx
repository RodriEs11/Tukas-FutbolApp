'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Users, Trophy, MapPin, User, Trophy as Logo } from 'lucide-react';

const navItems = [
  { href: '/dashboard', label: 'Inicio', icon: Home },
  { href: '/players', label: 'Jugadores', icon: Users },
  { href: '/matches', label: 'Partidos', icon: Trophy },
  { href: '/fields', label: 'Canchas', icon: MapPin },
  { href: '/profile', label: 'Perfil', icon: User },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="
      hidden md:flex md:flex-col
      w-64 h-screen
      bg-zinc-950 border-r border-zinc-800/60
      fixed left-0 top-0
    ">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 h-16 border-b border-zinc-800/60">
        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-emerald-600 shadow-lg shadow-emerald-500/20">
          <Logo size={18} className="text-white" />
        </div>
        <span className="text-xl font-bold text-zinc-100 tracking-tight">Tukas</span>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 py-4 px-3">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + '/');
            const Icon = item.icon;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-xl
                    text-sm font-medium
                    transition-all duration-200
                    ${isActive
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50 border border-transparent'
                    }
                  `}
                >
                  <Icon size={18} strokeWidth={isActive ? 2.5 : 1.8} />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-zinc-800/60">
        <p className="text-xs text-zinc-600 text-center">Tukas v2.0</p>
      </div>
    </aside>
  );
}
