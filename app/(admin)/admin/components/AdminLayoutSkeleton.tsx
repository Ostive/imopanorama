'use client'

export function AdminLayoutSkeleton() {
  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar Skeleton - Desktop */}
      <div className="hidden lg:block fixed inset-y-0 left-0 z-30 w-64 bg-white dark:bg-gray-800 shadow-lg">
        <div className="flex flex-col h-full">
          {/* Header Skeleton */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700 animate-pulse">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
              <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>

          {/* User Info Skeleton */}
          <div className="px-4 py-4 border-b border-gray-200 dark:border-gray-700 animate-pulse">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-28 mb-2"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-36"></div>
              </div>
            </div>
          </div>

          {/* Navigation Skeleton */}
          <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={`main-${i}`} className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" style={{ animationDelay: `${i * 50}ms` }}></div>
            ))}
            <div className="space-y-1">
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" style={{ animationDelay: '350ms' }}></div>
              <div className="ml-4 space-y-1 border-l-2 border-gray-300 dark:border-gray-600 pl-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={`sub-${i}`} className="h-9 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" style={{ animationDelay: `${400 + i * 50}ms` }}></div>
                ))}
              </div>
            </div>
            {[1, 2, 3].map((i) => (
              <div key={`end-${i}`} className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" style={{ animationDelay: `${700 + i * 50}ms` }}></div>
            ))}
          </nav>

          {/* Footer Skeleton */}
          <div className="px-4 py-4 border-t border-gray-200 dark:border-gray-700 space-y-2 animate-pulse">
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          </div>
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-64">
        {/* Mobile Header Skeleton */}
        <header className="lg:hidden bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center h-16 px-4 animate-pulse">
            <div className="h-6 w-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="ml-4 h-5 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
          </div>
        </header>

        {/* Main Content Area Skeleton */}
        <main className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto">
            <div className="space-y-6">
              <div className="animate-pulse">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
                  <div>
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-64 mb-2"></div>
                    <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-80"></div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border-l-4 border-gray-300 dark:border-gray-600 animate-pulse" style={{ animationDelay: `${i * 100}ms` }}>
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-3"></div>
                        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16 mb-2"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-28"></div>
                      </div>
                      <div className="w-14 h-14 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="animate-pulse">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-40 mb-6"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700" style={{ animationDelay: `${500 + i * 100}ms` }}>
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
                        <div className="flex-1">
                          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-28 mb-2"></div>
                          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-36"></div>
                        </div>
                        <div className="w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 animate-pulse">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-6"></div>
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
