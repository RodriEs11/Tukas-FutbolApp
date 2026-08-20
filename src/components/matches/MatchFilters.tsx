'use client';

import { useTransition } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Calendar, X, RotateCcw } from 'lucide-react';

interface MatchFiltersProps {
  initialFrom?: string;
  initialTo?: string;
}

export function MatchFilters({ initialFrom = '', initialTo = '' }: MatchFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const handleFilterChange = (key: 'from' | 'to', value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    // Always reset to page 1 when filter changes
    params.delete('page');

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  const handleClearFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('from');
    params.delete('to');
    params.delete('page');

    startTransition(() => {
      router.push(`${pathname}${params.toString() ? `?${params.toString()}` : ''}`);
    });
  };

  const handleSetThisMonth = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const lastDay = new Date(year, now.getMonth() + 1, 0).getDate();

    const fromDate = `${year}-${month}-01`;
    const toDate = `${year}-${month}-${String(lastDay).padStart(2, '0')}`;

    const params = new URLSearchParams(searchParams.toString());
    params.set('from', fromDate);
    params.set('to', toDate);
    params.delete('page');

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  const hasActiveFilters = Boolean(initialFrom || initialTo);

  return (
    <div className="bg-card border border-border/80 rounded-2xl p-4 mb-6 shadow-sm">
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2 text-foreground font-semibold text-sm">
          <Calendar size={16} className="text-accent" />
          <span>Filtrar por fecha</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSetThisMonth}
            className="text-xs font-medium px-2.5 py-1 rounded-lg bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-colors"
          >
            Este mes
          </button>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleClearFilters}
              disabled={isPending}
              className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-lg bg-destructive/10 hover:bg-destructive/20 text-destructive transition-colors"
            >
              <RotateCcw size={12} />
              <span>Limpiar</span>
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label htmlFor="filter-from" className="block text-xs font-medium text-muted-foreground mb-1">
            Desde
          </label>
          <div className="relative">
            <input
              id="filter-from"
              type="date"
              value={initialFrom}
              onChange={(e) => handleFilterChange('from', e.target.value)}
              className="
                w-full px-3 py-2 text-sm rounded-xl
                bg-background border border-border hover:border-border-hover
                text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent
                transition-all duration-200
              "
            />
            {initialFrom && (
              <button
                type="button"
                onClick={() => handleFilterChange('from', '')}
                className="absolute right-8 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1"
                title="Quitar fecha desde"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="filter-to" className="block text-xs font-medium text-muted-foreground mb-1">
            Hasta
          </label>
          <div className="relative">
            <input
              id="filter-to"
              type="date"
              value={initialTo}
              onChange={(e) => handleFilterChange('to', e.target.value)}
              className="
                w-full px-3 py-2 text-sm rounded-xl
                bg-background border border-border hover:border-border-hover
                text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent
                transition-all duration-200
              "
            />
            {initialTo && (
              <button
                type="button"
                onClick={() => handleFilterChange('to', '')}
                className="absolute right-8 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1"
                title="Quitar fecha hasta"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>
      </div>

      {isPending && (
        <div className="mt-2 text-xs text-muted-foreground animate-pulse">
          Actualizando partidos...
        </div>
      )}
    </div>
  );
}
