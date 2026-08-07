import { PageContainer } from '@/components/layout/PageContainer';
import { Skeleton } from '@/components/ui/Skeleton';
import { Card } from '@/components/ui/Card';

export default function ProfileLoading() {
  return (
    <PageContainer>
      <div className="mb-8">
        <Skeleton className="h-8 w-32" /> {/* Title */}
      </div>

      <div className="max-w-2xl mx-auto space-y-6">
        <Card className="p-8 flex flex-col items-center space-y-4">
          <Skeleton variant="circular" className="h-24 w-24" />
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-32" />
        </Card>

        <Card className="p-6 space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-10 w-full rounded-xl" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-10 w-full rounded-xl" />
          </div>
          <div className="pt-4">
            <Skeleton className="h-10 w-full rounded-xl" />
          </div>
        </Card>
      </div>
    </PageContainer>
  );
}
