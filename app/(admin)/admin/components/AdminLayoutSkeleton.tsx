'use client'

export function AdminLayoutSkeleton() {
  return (
    <div className="fixed inset-0 flex overflow-hidden bg-muted">
      {/* Sidebar Skeleton - Desktop */}
      <div className="hidden lg:block fixed inset-y-0 left-0 z-30 w-64 bg-card shadow-lg">
        <div className="flex flex-col h-full">
          {/* Header Skeleton */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-border animate-pulse">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-muted rounded-lg"></div>
              <div className="h-6 w-20 bg-muted rounded"></div>
            </div>
          </div>

          {/* User Info Skeleton */}
          <div className="px-4 py-4 border-b border-border animate-pulse">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-muted rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-muted rounded w-28 mb-2"></div>
                <div className="h-3 bg-muted rounded w-36"></div>
              </div>
            </div>
          </div>

          {/* Navigation Skeleton */}
          <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={`main-${i}`} className="h-10 bg-muted rounded-lg animate-pulse" style={{ animationDelay: `${i * 50}ms` }}></div>
            ))}
            <div className="space-y-1">
              <div className="h-10 bg-muted rounded-lg animate-pulse" style={{ animationDelay: '350ms' }}></div>
              <div className="ml-4 space-y-1 border-l-2 border-border pl-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={`sub-${i}`} className="h-9 bg-muted rounded-lg animate-pulse" style={{ animationDelay: `${400 + i * 50}ms` }}></div>
                ))}
              </div>
            </div>
            {[1, 2, 3].map((i) => (
              <div key={`end-${i}`} className="h-10 bg-muted rounded-lg animate-pulse" style={{ animationDelay: `${700 + i * 50}ms` }}></div>
            ))}
          </nav>

          {/* Footer Skeleton */}
          <div className="px-4 py-4 border-t border-border space-y-2 animate-pulse">
            <div className="h-10 bg-muted rounded-lg"></div>
            <div className="h-10 bg-muted rounded-lg"></div>
          </div>
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-64">
        {/* Mobile Header Skeleton */}
        <header className="lg:hidden bg-card shadow-sm border-b border-border">
          <div className="flex items-center h-16 px-4 animate-pulse">
            <div className="h-6 w-6 bg-muted rounded"></div>
            <div className="ml-4 h-5 bg-muted rounded w-32"></div>
          </div>
        </header>

        {/* Main Content Area Skeleton */}
        <main className="flex-1 overflow-y-auto p-4 bg-background">
          <div className="max-w-7xl mx-auto">
            <div className="space-y-6">
              <div className="animate-pulse">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-muted rounded-xl"></div>
                  <div>
                    <div className="h-8 bg-muted rounded w-64 mb-2"></div>
                    <div className="h-5 bg-muted rounded w-80"></div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-card rounded-2xl p-6 shadow-lg border-l-4 border-border animate-pulse" style={{ animationDelay: `${i * 100}ms` }}>
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="h-4 bg-muted rounded w-24 mb-3"></div>
                        <div className="h-8 bg-muted rounded w-16 mb-2"></div>
                        <div className="h-4 bg-muted rounded w-28"></div>
                      </div>
                      <div className="w-14 h-14 bg-muted rounded-xl"></div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="animate-pulse">
                <div className="h-6 bg-muted rounded w-40 mb-6"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="bg-card rounded-2xl p-6 shadow-lg border border-border" style={{ animationDelay: `${500 + i * 100}ms` }}>
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-muted rounded-xl"></div>
                        <div className="flex-1">
                          <div className="h-5 bg-muted rounded w-28 mb-2"></div>
                          <div className="h-4 bg-muted rounded w-36"></div>
                        </div>
                        <div className="w-5 h-5 bg-muted rounded"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-card rounded-2xl p-6 shadow-lg border border-border animate-pulse">
                <div className="h-6 bg-muted rounded w-48 mb-6"></div>
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-start space-x-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl" style={{ animationDelay: `${900 + i * 100}ms` }}>
                      <div className="w-10 h-10 bg-gray-200 dark:bg-gray-600 rounded-xl"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-full mb-2"></div>
                        <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-24"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
