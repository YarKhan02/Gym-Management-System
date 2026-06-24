import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export const PageHeaderSkeleton = ({
  action = false,
}: {
  action?: boolean;
}) => (
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
    <div className="space-y-2">
      <Skeleton className="h-8 w-44 sm:w-64" />
      <Skeleton className="h-4 w-56 sm:w-80" />
    </div>
    {action && <Skeleton className="h-10 w-full sm:w-32" />}
  </div>
);

export const ToolbarSkeleton = ({
  fields = 1,
}: {
  fields?: number;
}) => (
  <div className="flex flex-col sm:flex-row gap-3">
    {Array.from({ length: fields }).map((_, index) => (
      <Skeleton key={index} className="h-10 w-full sm:w-48" />
    ))}
  </div>
);

export const StatGridSkeleton = ({
  count = 4,
}: {
  count?: number;
}) => (
  <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
    {Array.from({ length: count }).map((_, index) => (
      <Card key={index} className="border-4 border-primary">
        <CardHeader className="flex flex-row items-center justify-between pb-2 p-3 sm:p-6">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-6 w-6 rounded-full" />
        </CardHeader>
        <CardContent className="p-3 sm:p-6 pt-0 space-y-2">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-3 w-32 max-w-full" />
        </CardContent>
      </Card>
    ))}
  </div>
);

export const TableSkeleton = ({
  columns = 4,
  rows = 6,
}: {
  columns?: number;
  rows?: number;
}) => (
  <div className="space-y-3 sm:space-y-4">
    <div className="border-4 border-primary overflow-x-auto">
      <div className="min-w-[640px]">
        <div
          className="grid border-b-4 border-primary"
          style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
        >
          {Array.from({ length: columns }).map((_, index) => (
            <div key={index} className="p-2 sm:p-4">
              <Skeleton className="h-4 w-20" />
            </div>
          ))}
        </div>
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div
            key={rowIndex}
            className="grid border-b-2 border-border"
            style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
          >
            {Array.from({ length: columns }).map((_, columnIndex) => (
              <div key={columnIndex} className="p-2 sm:p-4">
                <Skeleton className={columnIndex === 0 ? 'h-4 w-32' : 'h-4 w-20'} />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  </div>
);

export const CardSkeleton = ({
  rows = 4,
  className = '',
}: {
  rows?: number;
  className?: string;
}) => (
  <Card className={`border-4 border-primary ${className}`}>
    <CardHeader>
      <Skeleton className="h-5 w-44" />
    </CardHeader>
    <CardContent className="space-y-4">
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="space-y-2">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-5 w-full max-w-sm" />
        </div>
      ))}
    </CardContent>
  </Card>
);
