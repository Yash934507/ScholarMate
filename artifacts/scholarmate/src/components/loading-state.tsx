import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

export function ScholarshipCardSkeleton() {
  return (
    <Card className="h-[300px]" data-testid="skeleton-card">
      <CardHeader>
        <Skeleton className="h-6 w-2/3" />
        <Skeleton className="h-4 w-1/3" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-20 w-full" />
      </CardContent>
    </Card>
  );
}

interface LoadingGridProps {
  count?: number;
  className?: string;
  isCompact?: boolean;
}

export function LoadingGrid({ count = 3, className = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", isCompact = false }: LoadingGridProps) {
  if (isCompact) {
    return (
      <div className="space-y-6" data-testid="loading-grid-compact">
        {Array.from({ length: count }).map((_, i) => (
          <Card key={i} className="flex flex-col sm:flex-row p-6 gap-6">
            <div className="w-full sm:w-3/4 space-y-4">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-16 w-full" />
            </div>
            <div className="w-full sm:w-1/4 flex flex-col items-start sm:items-end space-y-4">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-10 w-full mt-auto" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className={className} data-testid="loading-grid">
      {Array.from({ length: count }).map((_, i) => (
        <ScholarshipCardSkeleton key={i} />
      ))}
    </div>
  );
}
