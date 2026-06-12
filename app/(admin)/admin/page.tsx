'use client'

import { useEffect, useState } from 'react';
import { useAuth } from '@/features/auth/context/AuthContext';
import { m } from 'framer-motion';
import {
  HomeModernIcon,
  UserGroupIcon,
  ChatBubbleLeftRightIcon,
  PlusCircleIcon,
  Cog6ToothIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { StatsCard } from './components/StatsCard';
import { QuickAction } from './components/QuickAction';
import { RecentActivity } from './components/RecentActivity';
import { AdminDashboardSkeleton } from './components/AdminDashboardSkeleton';
import { AdminPageHeader } from './components/AdminPageHeader';

interface DashboardStats {
  stats: {
    properties: { total: number; thisMonth: number };
    users: { total: number; thisWeek: number };
    contacts: { total: number; today: number; unread: number };
  };
  recentActivity: {
    properties: { id: string; title: string; createdAt: string; status: string }[];
    users: { id: string; firstName: string; lastName: string; email: string; createdAt: string }[];
    contacts: { id: string; firstName: string; lastName: string; email: string; createdAt: string; isRead: boolean }[];
  };
}

export default function AdminDashboard() {
  const { user, loading } = useAuth();
  const [data, setData] = useState<DashboardStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/stats')
      .then(r => r.ok ? r.json() : null)
      .then(d => setData(d))
      .finally(() => setStatsLoading(false));
  }, []);

  if (loading) return <AdminDashboardSkeleton />;

  const s = data?.stats;

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-primary-50/20 dark:from-gray-950 dark:via-gray-900 dark:to-primary-950/20 py-8">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <AdminPageHeader
          icon={<SparklesIcon className="w-6 h-6 text-white" />}
          title="Dashboard Admin"
          subtitle={`Bienvenue, ${user?.firstName} ${user?.lastName}`}
        />

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatsCard
            title="Propriétés"
            value={statsLoading ? '…' : String(s?.properties.total ?? 0)}
            subtitle={statsLoading ? '' : `+${s?.properties.thisMonth ?? 0} ce mois`}
            icon={<HomeModernIcon className="w-7 h-7" />}
            color="#3b82f6"
          />
          <StatsCard
            title="Utilisateurs"
            value={statsLoading ? '…' : String(s?.users.total ?? 0)}
            subtitle={statsLoading ? '' : `+${s?.users.thisWeek ?? 0} cette semaine`}
            icon={<UserGroupIcon className="w-7 h-7" />}
            color="#10b981"
            delay={0.05}
          />
          <StatsCard
            title="Messages non lus"
            value={statsLoading ? '…' : String(s?.contacts.unread ?? 0)}
            subtitle={statsLoading ? '' : `${s?.contacts.today ?? 0} aujourd'hui`}
            icon={<ChatBubbleLeftRightIcon className="w-7 h-7" />}
            color="#f59e0b"
            delay={0.1}
          />
        </div>

        {/* Quick Actions */}
        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
            <span className="text-2xl">⚡</span>
            Actions rapides
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <QuickAction
              title="Ajouter propriété"
              description="Créer une nouvelle annonce"
              icon={<PlusCircleIcon className="w-6 h-6" />}
              href="/admin/proprietes/new"
              color="#3b82f6"
            />
            <QuickAction
              title="Gérer utilisateurs"
              description="Voir tous les comptes"
              icon={<UserGroupIcon className="w-6 h-6" />}
              href="/admin/users"
              color="#10b981"
            />
            <QuickAction
              title="Messages"
              description="Répondre aux contacts"
              icon={<ChatBubbleLeftRightIcon className="w-6 h-6" />}
              href="/admin/contacts"
              color="#f59e0b"
            />
            <QuickAction
              title="Paramètres"
              description="Configuration du site"
              icon={<Cog6ToothIcon className="w-6 h-6" />}
              href="/admin/settings"
              color="#8b5cf6"
            />
          </div>
        </m.div>

        {/* Recent Activity */}
        <RecentActivity data={data?.recentActivity ?? null} loading={statsLoading} />
      </div>
    </div>
  );
}
