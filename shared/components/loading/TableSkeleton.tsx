import { Skeleton } from '@/shared/components/ui/skeleton'

interface TableSkeletonProps {
  rows?: number
  columns?: number
}

export function TableSkeleton({ rows = 5, columns = 6 }: TableSkeletonProps) {
  return (
    <div className="space-y-3">
      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {[...Array(columns)].map((_, i) => (
          <Skeleton key={`header-${i}`} className="h-10 w-full" />
        ))}
      </div>
      
      {[...Array(rows)].map((_, rowIndex) => (
        <div key={`row-${rowIndex}`} className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
          {[...Array(columns)].map((_, colIndex) => (
            <Skeleton key={`cell-${rowIndex}-${colIndex}`} className="h-16 w-full" />
          ))}
        </div>
      ))}
    </div>
  )
}
