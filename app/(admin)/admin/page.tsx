'use client'

import { useAuth } from '@/features/auth/context/AuthContext';
import { motion } from 'framer-motion';
import {
  HomeModernIcon,
  UserGroupIcon,
  ChatBubbleLeftRightIcon,
  CurrencyEuroIcon,
  PlusCircleIcon,
  Cog6ToothIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import {
  StatsCard,
  QuickAction,
  RecentActivity,
  AdminDashboardSkeleton,
  AdminPageHeader,
} from './components';

export default function AdminDashboard() {
  const { user, loading } = useAuth();

  if (loading) {
    return <AdminDashboardSkeleton />;
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-primary-50/20 dark:from-gray-950 dark:via-gray-900 dark:to-primary-950/20 py-8">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <AdminPageHeader
          icon={<SparklesIcon className="w-6 h-6 text-white" />}
          title="Dashboard Admin"
          subtitle={`Bienvenue, ${user?.firstName} ${user?.lastName}`}
        />

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Terrains"
          value="24"
          subtitle="+3 ce mois"
          icon={<HomeModernIcon className="w-7 h-7" />}
          color="#3b82f6"
        />
        <StatsCard
          title="Utilisateurs"
          value="156"
          subtitle="+12 cette semaine"
          icon={<UserGroupIcon className="w-7 h-7" />}
          color="#10b981"
          delay={0.05}
        />
        <StatsCard
          title="Messages"
          value="8"
          subtitle="+2 aujourd'hui"
          icon={<ChatBubbleLeftRightIcon className="w-7 h-7" />}
          color="#f59e0b"
          delay={0.1}
        />
        <StatsCard
          title="Revenus"
          value="45,200€"
          subtitle="+18% ce mois"
          icon={<CurrencyEuroIcon className="w-7 h-7" />}
          color="#8b5cf6"
          delay={0.15}
        />
        </div>

        {/* Quick Actions */}
        <motion.div
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
              href="/admin/properties/create"
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
        </motion.div>

        {/* Recent Activity */}
        <RecentActivity />
      </div>
    </div>
  );
}
