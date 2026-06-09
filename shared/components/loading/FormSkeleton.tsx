import { Skeleton } from '@/shared/components/ui/skeleton'
import { Card, CardContent, CardHeader } from '@/shared/components/ui/card'

interface FormSkeletonProps {
  fields?: number
}

export function FormSkeleton({ fields = 6 }: FormSkeletonProps) {
  const fieldIds = Array.from({ length: fields }, (_, i) => `form-field-${i}`)

  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64 mt-2" />
      </CardHeader>
      <CardContent className="space-y-6">
        {fieldIds.map((fieldId) => (
          <div key={fieldId} className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
        <Skeleton className="h-12 w-full mt-6" />
      </CardContent>
    </Card>
  )
}
