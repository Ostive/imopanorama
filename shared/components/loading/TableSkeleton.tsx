import { Skeleton } from '@/shared/components/ui/skeleton'

interface TableSkeletonProps {
  rows?: number
  columns?: number
}

export function TableSkeleton({ rows = 5, columns = 6 }: TableSkeletonProps) {
  const columnIds = Array.from({ length: columns }, (_, i) => `column-${i}`)
  const rowIds = Array.from({ length: rows }, (_, i) => `row-${i}`)

  return (
    <div className="space-y-3">
      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {columnIds.map((columnId) => (
          <Skeleton key={`header-${columnId}`} className="h-10 w-full" />
        ))}
      </div>
      
      {rowIds.map((rowId) => (
        <div key={rowId} className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
          {columnIds.map((columnId) => (
            <Skeleton key={`cell-${rowId}-${columnId}`} className="h-16 w-full" />
          ))}
        </div>
      ))}
    </div>
  )
}
