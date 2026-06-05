'use client'

export function AdminDashboardSkeleton() {
  return (
    <div className="p-6">
      {/* Dashboard Header Skeleton */}
      <div className="mb-8">
        <div className="h-8 w-48 bg-muted rounded animate-pulse mb-2"></div>
        <div className="h-5 w-64 bg-muted rounded animate-pulse"></div>
      </div>

      {/* Stats Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[1, 2, 3, 4].map((index) => (
          <div key={index} className="bg-card rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="h-4 w-24 bg-muted rounded animate-pulse mb-2"></div>
                <div className="h-7 w-16 bg-muted rounded animate-pulse mb-2"></div>
                <div className="h-4 w-20 bg-muted rounded animate-pulse"></div>
              </div>
              <div className="h-8 w-8 bg-muted rounded-full animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions Skeleton */}
      <div className="mb-8">
        <div className="h-6 w-32 bg-muted rounded animate-pulse mb-4"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((index) => (
            <div key={index} className="block p-4 bg-card rounded-lg shadow">
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 bg-muted rounded-full animate-pulse"></div>
                <div>
                  <div className="h-5 w-24 bg-muted rounded animate-pulse mb-2"></div>
                  <div className="h-4 w-32 bg-muted rounded animate-pulse"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity Skeleton */}
      <div className="bg-card rounded-lg shadow p-6">
        <div className="h-6 w-32 bg-muted rounded animate-pulse mb-4"></div>
        <div className="space-y-4">
          {[1, 2, 3].map((index) => (
            <div key={index} className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
              <div className="w-2 h-2 bg-muted rounded-full animate-pulse"></div>
              <div className="flex-1">
                <div className="h-4 w-full bg-muted rounded animate-pulse mb-2"></div>
                <div className="h-3 w-20 bg-muted rounded animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
