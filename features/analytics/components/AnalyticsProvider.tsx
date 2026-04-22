'use client';

import { useEffect } from 'react';
import { useAnalytics } from '../hooks/useAnalytics';

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  // Initialize analytics tracking
  useAnalytics();

  return <>{children}</>;
}
