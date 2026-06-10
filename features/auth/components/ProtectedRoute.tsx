'use client'

import { redirect, usePathname } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { AdminPageSkeleton } from '@/shared/components/admin/AdminPageSkeleton';
import NotFound from '@/app/not-found';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requiredRole?: string | string[];
  requiredPermission?: string;
  fallbackUrl?: string;
}

export default function ProtectedRoute({
  children,
  requireAuth = true,
  requiredRole,
  requiredPermission,
  fallbackUrl = '/login'
}: ProtectedRouteProps) {
  const { user, isAuthenticated, hasRole, hasPermission, loading } = useAuth();
  const pathname = usePathname();

  if (loading) {
    return <AdminPageSkeleton />;
  }

  if (requireAuth && !isAuthenticated) {
    redirect(`${fallbackUrl}?redirect=${encodeURIComponent(pathname)}`);
  }

  if ((requiredRole && !hasRole(requiredRole)) || (requiredPermission && !hasPermission(requiredPermission))) {
    return <NotFound />;
  }

  return <>{children}</>;
}
