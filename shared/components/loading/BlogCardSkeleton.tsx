import { Skeleton } from '@/shared/components/ui/skeleton'
import { Card, CardContent } from '@/shared/components/ui/card'

export function BlogCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <Skeleton className="h-56 w-full rounded-none" />
      <CardContent className="p-6 space-y-3">
        <div className="flex gap-2">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-20" />
        </div>
        <Skeleton className="h-7 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <div className="flex items-center gap-2 pt-2">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-4 w-24" />
        </div>
      </CardContent>
    </Card>
  )
}
