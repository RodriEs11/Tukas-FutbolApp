'use client';

import { useTransition } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface MatchPaginationProps {
  currentPage: number;
  totalPages: number;
  totalMatches: number;
  pageSize: number;
}

export function MatchPagination({
  currentPage,
  totalPages,
  totalMatches,
  pageSize,
}: MatchPaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  if (totalPages <= 1) return null;

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) return;

    const params = new URLSearchParams(searchParams.toString());
    if (page === 1) {
      params.delete('page');
    } else {
      params.set('page', page.toString());
    }

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalMatches);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-4 border-t border-border">
      <div className="text-xs text-muted-foreground order-2 sm:order-1">
        Mostrando <span className="font-medium text-foreground">{startItem}</span> a{' '}
        <span className="font-medium text-foreground">{endItem}</span> de{' '}
        <span className="font-medium text-foreground">{totalMatches}</span> partidos
      </div>

      <div className="flex items-center gap-1.5 order-1 sm:order-2">
        <button
          type="button"
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage <= 1 || isPending}
          className="
            inline-flex items-center justify-center p-2 rounded-xl
            bg-card border border-border text-foreground hover:bg-muted
            disabled:opacity-40 disabled:cursor-not-allowed transition-all
          "
          aria-label="Página anterior"
        >
          <ChevronLeft size={16} />
        </button>

        <div className="flex items-center gap-1">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
            // Keep pagination clean if many pages: always show first, last, and around current
            const isNearCurrent = Math.abs(page - currentPage) <= 1;
            const isFirstOrLast = page === 1 || page === totalPages;

            if (!isNearCurrent && !isFirstOrLast) {
              if (page === currentPage - 2 || page === currentPage + 2) {
                return (
                  <span key={page} className="px-1 text-xs text-muted-foreground">
                    ...
                  </span>
                );
              }
              return null;
            }

            const isActive = page === currentPage;

            return (
              <button
                key={page}
                type="button"
                onClick={() => goToPage(page)}
                disabled={isPending}
                className={`
                  min-w-[36px] h-9 px-2 text-xs font-semibold rounded-xl transition-all
                  ${
                    isActive
                      ? 'bg-accent text-accent-foreground shadow-sm shadow-accent/20'
                      : 'bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-muted'
                  }
                `}
              >
                {page}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage >= totalPages || isPending}
          className="
            inline-flex items-center justify-center p-2 rounded-xl
            bg-card border border-border text-foreground hover:bg-muted
            disabled:opacity-40 disabled:cursor-not-allowed transition-all
          "
          aria-label="Página siguiente"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
