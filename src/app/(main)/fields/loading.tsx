import { PageContainer } from '@/components/layout/PageContainer';
import { Skeleton } from '@/components/ui/Skeleton';
import { Card } from '@/components/ui/Card';

export default function FieldsLoading() {
  return (
    <PageContainer>
      <div className="flex items-center justify-between mb-8">
        <Skeleton className="h-8 w-32" /> {/* Title */}
        <Skeleton className="h-9 w-36 rounded-xl" /> {/* Button */}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5].map((i) => (
          <Card key={i} className="p-0 overflow-hidden flex flex-col h-[200px]">
            <Skeleton className="h-2/3 w-full rounded-none" />
            <div className="p-4 flex-1 flex flex-col justify-center">
              <Skeleton className="h-5 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </Card>
        ))}
      </div>
    </PageContainer>
  );
}
