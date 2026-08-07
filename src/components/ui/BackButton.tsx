'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

interface BackButtonProps {
  fallbackHref: string;
  className?: string;
}

export function BackButton({ fallbackHref, className = 'mb-6' }: BackButtonProps) {
  const router = useRouter();

  const handleBack = () => {
    // Si hay historial en la misma pestaña y la página anterior era de nuestra app
    // En navegación interna de Next.js (client-side), document.referrer no se actualiza y puede estar vacío.
    if (
      typeof window !== 'undefined' && 
      window.history.length > 1 && 
      (!document.referrer || document.referrer.includes(window.location.host))
    ) {
      router.back();
    } else {
      router.push(fallbackHref);
    }
  };

  return (
    <button
      onClick={handleBack}
      className={`inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors ${className}`}
    >
      <ArrowLeft size={16} />
      Volver
    </button>
  );
}
