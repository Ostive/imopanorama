import { motion } from 'framer-motion';

export function AdminPageSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/20 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Skeleton */}
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-8 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gray-200 rounded-xl animate-pulse" />
            <div>
              <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-2" />
              <div className="h-4 w-64 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <div className="h-10 w-24 bg-gray-200 rounded-xl animate-pulse" />
            <div className="h-10 w-32 bg-gray-200 rounded-xl animate-pulse" />
          </div>
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-gray-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="h-4 w-20 bg-gray-200 rounded animate-pulse mb-3" />
                  <div className="h-8 w-16 bg-gray-200 rounded animate-pulse mb-2" />
                  <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
                </div>
                <div className="w-14 h-14 rounded-xl bg-gray-200 animate-pulse" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Content Skeleton */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-200 rounded-lg animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2" />
                </div>
                <div className="flex gap-2">
                  <div className="w-8 h-8 bg-gray-200 rounded animate-pulse" />
                  <div className="w-8 h-8 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function StatsCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-gray-200">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="h-4 w-20 bg-gray-200 rounded animate-pulse mb-3" />
          <div className="h-8 w-16 bg-gray-200 rounded animate-pulse mb-2" />
          <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="w-14 h-14 rounded-xl bg-gray-200 animate-pulse" />
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
      </div>
      <div className="divide-y divide-gray-200">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="px-6 py-4 flex items-center gap-4">
            <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
              <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2" />
            </div>
            <div className="flex gap-2">
              <div className="w-8 h-8 bg-gray-200 rounded animate-pulse" />
              <div className="w-8 h-8 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
