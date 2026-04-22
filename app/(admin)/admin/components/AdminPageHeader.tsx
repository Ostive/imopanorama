import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { Skeleton } from '@/shared/components/ui/skeleton';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

interface AdminPageHeaderProps {
  icon: ReactNode;
  title: string;
  subtitle: string;
  actions?: ReactNode;
  showBackButton?: boolean;
  backHref?: string;
  loading?: boolean;
}

export function AdminPageHeader({
  icon,
  title,
  subtitle,
  actions,
  showBackButton = false,
  backHref = '/admin',
  loading = false,
}: AdminPageHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-12 h-12 bg-linear-to-br from-primary-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
            {icon}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold bg-linear-to-r from-primary-600 to-blue-600 bg-clip-text text-transparent">
                {title}
              </h1>
              {loading && (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Skeleton className="h-4 w-24" />
                </div>
              )}
            </div>
            <p className="text-gray-600 font-medium mt-1">{subtitle}</p>
          </div>
        </div>
        {(showBackButton || actions) && (
          <div className="flex flex-wrap gap-3 lg:flex-shrink-0">
            {showBackButton && (
              <Link
                href={backHref}
                className="inline-flex items-center px-4 py-2 text-gray-700 bg-white hover:bg-gray-50 font-semibold rounded-xl transition-all border border-gray-200 shadow-sm"
              >
                <ArrowLeftIcon className="h-5 w-5 mr-2" /> Retour
              </Link>
            )}
            {actions}
          </div>
        )}
      </div>
    </motion.div>
  );
}
