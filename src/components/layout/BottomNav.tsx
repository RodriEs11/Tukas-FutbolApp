'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Users, Trophy, MapPin, type LucideIcon } from 'lucide-react';

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

// Modular: agrega nuevas pestañas simplemente agregando un item a este array
const getNavItems = (isAdmin: boolean): NavItem[] => {
  const items = [
    { href: '/dashboard', label: 'Inicio', icon: Home },
    { href: '/players', label: 'Jugadores', icon: Users },
    { href: '/matches', label: 'Partidos', icon: Trophy },
  ];
  if (isAdmin) {
    items.push({ href: '/fields', label: 'Canchas', icon: MapPin });
  }
  return items;
};

export function BottomNav({ isAdmin }: { isAdmin?: boolean }) {
  const pathname = usePathname();
  const navItems = getNavItems(!!isAdmin);

  return (
    <nav className="
      fixed bottom-0 left-0 right-0 z-50
      bg-background/90 backdrop-blur-xl
      border-t border-border/60
      pb-[env(safe-area-inset-bottom)]
      md:hidden
    ">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + '/');
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex flex-col items-center justify-center
                w-full h-full gap-0.5
                transition-all duration-200 ease-out
                rounded-xl mx-1
                active:scale-95
                ${isActive
                  ? 'text-accent'
                  : 'text-muted-foreground hover:text-foreground'
                }
              `}
            >
              <div className="relative">
                <Icon
                  size={22}
                  strokeWidth={isActive ? 2.5 : 1.8}
                  className="transition-all duration-200"
                />
                {isActive && (
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-accent" />
                )}
              </div>
              <span className={`
                text-[10px] font-medium
                transition-all duration-200
                ${isActive ? 'text-accent' : ''}
              `}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
