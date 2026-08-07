import { PageContainer } from '@/components/layout/PageContainer';
import { Skeleton } from '@/components/ui/Skeleton';
import { Card } from '@/components/ui/Card';

export default function MatchesLoading() {
  return (
    <PageContainer>
      <div className="flex items-center justify-between mb-8">
        <Skeleton className="h-8 w-32" /> {/* Title */}
        <Skeleton className="h-9 w-36 rounded-xl" /> {/* Button */}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="p-0 overflow-hidden">
            {/* Top section */}
            <div className="bg-muted/30 p-4 border-b border-border flex justify-between items-center">
              <Skeleton className="h-6 w-24 rounded-md" />
              <Skeleton className="h-6 w-20 rounded-md" />
            </div>
            
            {/* Middle section (Score) */}
            <div className="p-6 flex items-center justify-between">
              <div className="flex flex-col items-center">
                <Skeleton className="h-4 w-12 mb-2" />
                <Skeleton className="h-10 w-8" />
              </div>
              <Skeleton className="h-4 w-4" />
              <div className="flex flex-col items-center">
                <Skeleton className="h-4 w-12 mb-2" />
                <Skeleton className="h-10 w-8" />
              </div>
            </div>

            {/* Bottom section */}
            <div className="bg-muted/30 p-3 flex justify-between">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-20" />
            </div>
          </Card>
        ))}
      </div>
    </PageContainer>
  );
}
