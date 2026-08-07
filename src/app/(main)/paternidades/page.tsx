import { PageContainer } from '@/components/layout/PageContainer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Paternidades',
};

export default function PaternidadesPage() {
  return (
    <PageContainer>
      <div className="mb-6 animate-fade-in">
        <h2 className="text-2xl font-bold text-foreground tracking-tight">
          Paternidades
        </h2>
        <p className="text-muted-foreground text-sm mt-1">
          Historial de enfrentamientos y estadísticas
        </p>
      </div>
      
      <div className="flex flex-col items-center justify-center h-64 text-muted-foreground border-2 border-dashed border-border/50 rounded-2xl bg-card/50">
        <span className="text-sm font-medium">Sección en construcción</span>
      </div>
    </PageContainer>
  );
}
