'use client'

import { m } from 'framer-motion';
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon } from '@heroicons/react/24/outline';

export interface Trend {
  value: number;
  direction: 'up' | 'down' | 'neutral';
}

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  color: string;
  delay?: number;
  trend?: Trend;
  invertTrendColor?: boolean;
}

const COLOR_MAP: Record<string, { border: string; bg: string; text: string }> = {
  '#3b82f6': { border: 'border-primary-500', bg: 'bg-primary-500/10', text: 'text-primary-600' },
  '#10b981': { border: 'border-green-500', bg: 'bg-green-500/10', text: 'text-green-600' },
  '#f59e0b': { border: 'border-amber-500', bg: 'bg-amber-500/10', text: 'text-amber-600' },
  '#8b5cf6': { border: 'border-purple-500', bg: 'bg-purple-500/10', text: 'text-purple-600' },
  '#ef4444': { border: 'border-red-500', bg: 'bg-red-500/10', text: 'text-red-600' },
  '#06b6d4': { border: 'border-cyan-500', bg: 'bg-cyan-500/10', text: 'text-cyan-600' },
  '#ec4899': { border: 'border-pink-500', bg: 'bg-pink-500/10', text: 'text-pink-600' },
  '#f97316': { border: 'border-orange-500', bg: 'bg-orange-500/10', text: 'text-orange-600' },
  blue: { border: 'border-primary-500', bg: 'bg-primary-500/10', text: 'text-primary-600' },
  green: { border: 'border-green-500', bg: 'bg-green-500/10', text: 'text-green-600' },
  amber: { border: 'border-amber-500', bg: 'bg-amber-500/10', text: 'text-amber-600' },
  purple: { border: 'border-purple-500', bg: 'bg-purple-500/10', text: 'text-purple-600' },
  red: { border: 'border-red-500', bg: 'bg-red-500/10', text: 'text-red-600' },
  cyan: { border: 'border-cyan-500', bg: 'bg-cyan-500/10', text: 'text-cyan-600' },
  pink: { border: 'border-pink-500', bg: 'bg-pink-500/10', text: 'text-pink-600' },
  orange: { border: 'border-orange-500', bg: 'bg-orange-500/10', text: 'text-orange-600' },
};

export function StatsCard({ title, value, subtitle, icon, color, delay = 0, trend, invertTrendColor }: StatsCardProps) {
  const c = COLOR_MAP[color] || { border: 'border-primary-500', bg: 'bg-primary-500/10', text: 'text-primary-600' };

  return (
    <m.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ y: -4 }}
      className={`bg-card rounded-2xl shadow-lg hover:shadow-xl p-6 border-l-4 ${c.border} transition-shadow`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">{title}</p>
          <p className={`text-3xl font-bold mt-2 ${c.text}`}>
            {typeof value === 'number' ? value.toLocaleString('fr-FR') : value}
          </p>
          <div className="h-5 mt-1">
            {trend && trend.direction !== 'neutral' ? (
              <div className={`flex items-center gap-1 ${
                (invertTrendColor ? trend.direction === 'down' : trend.direction === 'up')
                  ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'
              }`}>
                {trend.direction === 'up'
                  ? <ArrowTrendingUpIcon className="w-4 h-4" />
                  : <ArrowTrendingDownIcon className="w-4 h-4" />
                }
                <span className="text-sm font-medium">{trend.value}%</span>
              </div>
            ) : trend ? (
              <p className="text-sm text-muted-foreground">--</p>
            ) : subtitle ? (
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            ) : null}
          </div>
        </div>
        <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${c.bg} shrink-0 ml-3`}>
          <div className={c.text}>{icon}</div>
        </div>
      </div>
    </m.div>
  );
}
