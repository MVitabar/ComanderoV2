import { Skeleton } from '@/components/ui/skeleton';

export function NotificationListSkeleton() {
  return (
    <div className="space-y-4 p-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-start space-x-4 rounded-lg border p-4">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-1/2" />
            <div className="flex justify-between pt-2">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-5 w-12" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default NotificationListSkeleton;
