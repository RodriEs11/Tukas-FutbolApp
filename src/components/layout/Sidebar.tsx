'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Users, Trophy, MapPin, User, Trophy as Logo, Target, Swords } from 'lucide-react';

const getNavItems = (isAdmin: boolean) => {
  const items = [
    { href: '/dashboard', label: 'Inicio', icon: Home },
    { href: '/players', label: 'Jugadores', icon: Users },
    { href: '/scorers', label: 'Goleadores', icon: Target },
    { href: '/paternidades', label: 'Paternidades', icon: Swords },
    { href: '/matches', label: 'Partidos', icon: Trophy },
  ];
  if (isAdmin) {
    items.push({ href: '/fields', label: 'Canchas', icon: MapPin });
  }
  items.push({ href: '/profile', label: 'Perfil', icon: User });
  return items;
};

export function Sidebar({ isAdmin }: { isAdmin?: boolean }) {
  const pathname = usePathname();
  const navItems = getNavItems(!!isAdmin);

  return (
    <aside className="
      hidden md:flex md:flex-col
      w-64 h-screen
      bg-card border-r border-border
      fixed left-0 top-0
    ">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 h-16 border-b border-border">
        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-emerald-600 shadow-lg shadow-emerald-500/20">
          <Logo size={18} className="text-white" />
        </div>
        <span className="text-xl font-bold text-foreground tracking-tight">Tukas</span>
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
                      ? 'bg-accent/10 text-accent border border-accent/20'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50 border border-transparent'
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
      <div className="px-4 py-4 border-t border-border">
        <p className="text-xs text-muted-foreground text-center">Tukas v2.0</p>
      </div>
    </aside>
  );
}
