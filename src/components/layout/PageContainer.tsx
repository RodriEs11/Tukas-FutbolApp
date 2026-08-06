import type { ReactNode } from 'react';

interface PageContainerProps {
  children: ReactNode;
  className?: string;
}

export function PageContainer({ children, className = '' }: PageContainerProps) {
  return (
    <main className={`
      flex-1 w-full max-w-3xl mx-auto
      px-4 py-6
      pb-24 md:pb-6
      ${className}
    `}>
      {children}
    </main>
  );
}
