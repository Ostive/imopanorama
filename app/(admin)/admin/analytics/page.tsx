'use client'

import { useState, useEffect, useCallback } from 'react';
import { m } from 'framer-motion';
import ProtectedRoute from '@/features/auth/components/ProtectedRoute';
import { PageSkeleton } from '@/shared/components/loading';
import {
  ChartBarIcon,
  EyeIcon,
  UserGroupIcon,
  ClockIcon,
  HomeIcon,
  HeartIcon,
  EnvelopeIcon,
  BellAlertIcon,
  ArrowTopRightOnSquareIcon,
  BuildingOfficeIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import { AdminPageHeader, StatsCard } from '../components';

import type { Trend } from '../components/StatsCard';

interface AnalyticsData {
  overview: {
    visitors: number;
    pageViews: number;
    bounceRate: number;
    avgSessionDuration: string;
    trends: {
      visitors: Trend;
      pageViews: Trend;
      bounceRate: Trend;
      avgSessionDuration: Trend;
    };
  };
  traffic: {
    organic: number;
    direct: number;
    social: number;
    referral: number;
  };
  topPages: Array<{
    page: string;
    title: string;
    views: number;
  }>;
  devices: {
    mobile: number;
    desktop: number;
    tablet: number;
  };
  locations: Array<{
    country: string;
    visitors: number;
    percentage: number;
  }>;
  recentActivity: Array<{
    time: string;
    action: string;
    location: string;
  }>;
  business: {
    properties: {
      total: number;
      available: number;
      sold: number;
      reserved: number;
    };
    conversions: {
      propertyContacts: { current: number; previous: number };
      contacts: { current: number; previous: number };
      favorites: { current: number; previous: number };
      batiQuotes: { current: number; previous: number };
      newUsers: { current: number; previous: number };
      propertyViews: { current: number; previous: number };
    };
    totals: { totalUsers: number };
    unread: {
      contacts: number;
      propertyContacts: number;
      quotes: number;
      total: number;
    };
    topViewedProperties: Array<{ title: string; views: number }>;
    recentContacts: Array<{
      name: string;
      email: string;
      property: string;
      isRead: boolean;
      date: string;
    }>;
  };
}

function ProgressBar({ label, value, color }: { label: string; value: number; color: string }) {
  const colorMap: Record<string, string> = {
    green: 'bg-green-500', blue: 'bg-primary-500', purple: 'bg-purple-500', orange: 'bg-orange-500',
    red: 'bg-red-500', amber: 'bg-amber-500', cyan: 'bg-cyan-500', pink: 'bg-pink-500',
  };
  return (
    <div className="flex items-center gap-3">
      <div className={`w-3 h-3 rounded-full ${colorMap[color] || 'bg-gray-500'}`} />
      <span className="text-sm text-gray-700 flex-1">{label}</span>
      <div className="w-32 bg-gray-100 rounded-full h-2">
        <div className={`h-2 rounded-full ${colorMap[color] || 'bg-gray-500'}`} style={{ width: `${Math.min(value, 100)}%` }} />
      </div>
      <span className="text-sm font-semibold text-gray-900 w-10 text-right">{value}%</span>
    </div>
  );
}

function ConversionCard({ title, current, previous, icon: Icon, color }: {
  title: string;
  current: number;
  previous: number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}) {
  const diff = previous > 0 ? Math.round(((current - previous) / previous) * 100) : current > 0 ? 100 : 0;
  const isUp = diff > 0;
  const colorMap: Record<string, string> = {
    blue: 'text-primary-600', green: 'text-green-600', purple: 'text-purple-600',
    orange: 'text-orange-600', red: 'text-red-600', pink: 'text-pink-600',
  };

  return (
    <div className="flex items-center gap-4 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
      <div className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center">
        <Icon className={`w-5 h-5 ${colorMap[color] || 'text-gray-600'}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-600 truncate">{title}</p>
        <p className="text-lg font-bold text-gray-900">{current}</p>
      </div>
      <div className="text-right">
        <div className={`text-xs font-semibold ${isUp ? 'text-green-600' : diff < 0 ? 'text-red-500' : 'text-gray-400'}`}>
          {diff === 0 ? '--' : `${isUp ? '+' : ''}${diff}%`}
        </div>
        <p className="text-xs text-gray-400">vs. période préc.</p>
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('7d');
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'business' | 'audience'>('overview');

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/analytics/data?timeRange=${timeRange}`);
      if (!response.ok) throw new Error('Failed to fetch analytics data');
      const data = await response.json();
      setAnalytics(data);
    } catch (err) {
      console.error('Error fetching analytics:', err);
      setError('Erreur lors du chargement des données analytiques');
    } finally {
      setLoading(false);
    }
  }, [timeRange]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const timeRanges = [
    { value: '24h', label: '24h' },
    { value: '7d', label: '7j' },
    { value: '30d', label: '30j' },
    { value: '90d', label: '3 mois' }
  ];

  const tabs = [
    { key: 'overview' as const, label: 'Vue d\'ensemble' },
    { key: 'business' as const, label: 'Business' },
    { key: 'audience' as const, label: 'Audience' },
  ];

  const umamiUrl = process.env.NEXT_PUBLIC_UMAMI_URL;
  const grafanaUrl = process.env.NEXT_PUBLIC_GRAFANA_URL || 'http://localhost:3200';

  if (loading) {
    return <PageSkeleton />;
  }

  if (error || !analytics) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-primary-50/20 dark:from-gray-950 dark:via-gray-900 dark:to-primary-950/20 py-8 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Erreur de chargement'}</p>
          <button type="button" onClick={fetchAnalytics} className="btn-primary">Réessayer</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-primary-50/20 dark:from-gray-950 dark:via-gray-900 dark:to-primary-950/20 py-8">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <AdminPageHeader
          icon={<ChartBarIcon className="w-6 h-6 text-white" />}
          title="Analytics"
          subtitle="Suivez les performances de votre site en temps réel"
          showBackButton
          actions={
            <div className="flex items-center gap-2">
              {timeRanges.map((range) => (
                <m.button
                  key={range.value}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setTimeRange(range.value)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                    timeRange === range.value
                      ? 'bg-linear-to-r from-primary-600 to-primary-600 text-white shadow-md'
                      : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                  }`}
                >
                  {range.label}
                </m.button>
              ))}
            </div>
          }
        />

        {/* Tabs + External links */}
        <div className="flex items-center justify-between mb-6 mt-2">
          <div className="flex gap-1 bg-white rounded-xl p-1 shadow-sm border border-gray-100">
            {tabs.map((tab) => (
              <button type="button"
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.key
                    ? 'bg-primary-600 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            {umamiUrl && (
              <a
                href={umamiUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-colors"
              >
                <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                Umami
              </a>
            )}
            <a
              href={grafanaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-orange-50 text-orange-700 hover:bg-orange-100 border border-orange-200 transition-colors"
            >
              <ArrowTopRightOnSquareIcon className="w-4 h-4" />
              Grafana
            </a>
          </div>
        </div>

        {/* Unread alerts banner */}
        {analytics.business.unread.total > 0 && (
          <m.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-3"
          >
            <BellAlertIcon className="w-5 h-5 text-amber-600 shrink-0" />
            <p className="text-sm text-amber-800 flex-1">
              <span className="font-bold">{analytics.business.unread.total} message(s) non lu(s) :</span>{' '}
              {analytics.business.unread.propertyContacts > 0 && `${analytics.business.unread.propertyContacts} demande(s) propriété`}
              {analytics.business.unread.contacts > 0 && `, ${analytics.business.unread.contacts} contact(s)`}
              {analytics.business.unread.quotes > 0 && `, ${analytics.business.unread.quotes} devis`}
            </p>
          </m.div>
        )}

        {/* =================== OVERVIEW TAB =================== */}
        {activeTab === 'overview' && (
          <>
            {/* KPI Cards with real trends */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <StatsCard
                title="Visiteurs" value={analytics.overview.visitors}
                icon={<UserGroupIcon className="w-7 h-7" />} color="blue"
                trend={analytics.overview.trends.visitors} delay={0}
              />
              <StatsCard
                title="Pages vues" value={analytics.overview.pageViews}
                icon={<EyeIcon className="w-7 h-7" />} color="green"
                trend={analytics.overview.trends.pageViews} delay={0.05}
              />
              <StatsCard
                title="Taux de rebond" value={`${analytics.overview.bounceRate}%`}
                icon={<ChartBarIcon className="w-7 h-7" />} color="amber"
                trend={analytics.overview.trends.bounceRate} invertTrendColor delay={0.1}
              />
              <StatsCard
                title="Durée moyenne" value={analytics.overview.avgSessionDuration}
                icon={<ClockIcon className="w-7 h-7" />} color="purple"
                trend={analytics.overview.trends.avgSessionDuration} delay={0.15}
              />
            </div>

            {/* Business quick stats */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
              <StatsCard title="Propriétés" value={analytics.business.properties.total} icon={<HomeIcon className="w-7 h-7" />} color="blue" delay={0.05} />
              <StatsCard title="Disponibles" value={analytics.business.properties.available} icon={<CheckCircleIcon className="w-7 h-7" />} color="green" delay={0.1} />
              <StatsCard title="Réservées" value={analytics.business.properties.reserved} icon={<ExclamationCircleIcon className="w-7 h-7" />} color="orange" delay={0.15} />
              <StatsCard title="Vendues" value={analytics.business.properties.sold} icon={<BuildingOfficeIcon className="w-7 h-7" />} color="red" delay={0.2} />
              <StatsCard title="Utilisateurs" value={analytics.business.totals.totalUsers} icon={<UserGroupIcon className="w-7 h-7" />} color="purple" delay={0.25} />
              <StatsCard title="Non lus" value={analytics.business.unread.total} icon={<EnvelopeIcon className="w-7 h-7" />} color="pink" delay={0.3} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Traffic Sources */}
              <m.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl shadow-md p-6">
                <h3 className="text-base font-bold text-gray-900 mb-4">Sources de trafic</h3>
                <div className="space-y-3">
                  <ProgressBar label="Recherche organique" value={analytics.traffic.organic} color="green" />
                  <ProgressBar label="Accès direct" value={analytics.traffic.direct} color="blue" />
                  <ProgressBar label="Réseaux sociaux" value={analytics.traffic.social} color="purple" />
                  <ProgressBar label="Référents" value={analytics.traffic.referral} color="orange" />
                </div>
              </m.div>

              {/* Top Pages */}
              <m.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                className="bg-white rounded-2xl shadow-md p-6">
                <h3 className="text-base font-bold text-gray-900 mb-4">Pages les plus visitées</h3>
                <div className="space-y-2">
                  {analytics.topPages.map((page, i) => (
                    <div key={page.page} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                      <span className="text-xs font-bold text-gray-400 w-5 text-center">{i + 1}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{page.title}</p>
                        <p className="text-xs text-gray-400 truncate">{page.page}</p>
                      </div>
                      <span className="text-sm font-bold text-gray-700">{page.views.toLocaleString('fr-FR')}</span>
                    </div>
                  ))}
                  {analytics.topPages.length === 0 && (
                    <p className="text-sm text-gray-400 text-center py-4">Aucune donnée</p>
                  )}
                </div>
              </m.div>
            </div>

            {/* Recent Activity */}
            <m.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-md">
              <div className="px-6 py-4 border-b border-gray-100">
                <h3 className="text-base font-bold text-gray-900">Activité récente</h3>
              </div>
              <div className="p-4">
                <div className="space-y-2">
                  {analytics.recentActivity.map((activity, index) => (
                    <div key={`${activity.time}-${activity.action}-${activity.location}`} className="flex items-center gap-3 p-2.5 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                      <span className="text-xs font-mono text-gray-400 shrink-0">{activity.time}</span>
                      <span className="text-sm text-gray-700 flex-1 truncate">{activity.action}</span>
                      <span className="text-xs text-gray-400 shrink-0">{activity.location}</span>
                    </div>
                  ))}
                  {analytics.recentActivity.length === 0 && (
                    <p className="text-sm text-gray-400 text-center py-4">Aucune activité récente</p>
                  )}
                </div>
              </div>
            </m.div>
          </>
        )}

        {/* =================== BUSINESS TAB =================== */}
        {activeTab === 'business' && (
          <>
            {/* Conversions */}
            <m.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-md p-6 mb-6">
              <h3 className="text-base font-bold text-gray-900 mb-4">Conversions & Interactions</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <ConversionCard title="Demandes propriétés" icon={EnvelopeIcon} color="blue"
                  current={analytics.business.conversions.propertyContacts.current}
                  previous={analytics.business.conversions.propertyContacts.previous} />
                <ConversionCard title="Contacts généraux" icon={EnvelopeIcon} color="green"
                  current={analytics.business.conversions.contacts.current}
                  previous={analytics.business.conversions.contacts.previous} />
                <ConversionCard title="Devis BatiPanorama" icon={BuildingOfficeIcon} color="orange"
                  current={analytics.business.conversions.batiQuotes.current}
                  previous={analytics.business.conversions.batiQuotes.previous} />
                <ConversionCard title="Favoris ajoutés" icon={HeartIcon} color="red"
                  current={analytics.business.conversions.favorites.current}
                  previous={analytics.business.conversions.favorites.previous} />
                <ConversionCard title="Nouveaux utilisateurs" icon={UserGroupIcon} color="purple"
                  current={analytics.business.conversions.newUsers.current}
                  previous={analytics.business.conversions.newUsers.previous} />
                <ConversionCard title="Vues propriétés" icon={EyeIcon} color="pink"
                  current={analytics.business.conversions.propertyViews.current}
                  previous={analytics.business.conversions.propertyViews.previous} />
              </div>
            </m.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Top Viewed Properties */}
              <m.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl shadow-md p-6">
                <h3 className="text-base font-bold text-gray-900 mb-4">Propriétés les plus vues</h3>
                <div className="space-y-2">
                  {analytics.business.topViewedProperties.map((prop, i) => (
                    <div key={prop.title} className="flex items-center gap-3 p-2.5 rounded-lg bg-gray-50">
                      <span className="text-xs font-bold text-gray-400 w-5 text-center">{i + 1}</span>
                      <span className="text-sm text-gray-800 flex-1 truncate">{prop.title}</span>
                      <div className="flex items-center gap-1">
                        <EyeIcon className="w-3.5 h-3.5 text-gray-400" />
                        <span className="text-sm font-bold text-gray-700">{prop.views}</span>
                      </div>
                    </div>
                  ))}
                  {analytics.business.topViewedProperties.length === 0 && (
                    <p className="text-sm text-gray-400 text-center py-4">Aucune donnée</p>
                  )}
                </div>
              </m.div>

              {/* Recent Contacts */}
              <m.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                className="bg-white rounded-2xl shadow-md p-6">
                <h3 className="text-base font-bold text-gray-900 mb-4">Dernières demandes</h3>
                <div className="space-y-2">
                  {analytics.business.recentContacts.map((contact, i) => (
                    <div key={`${contact.email}-${contact.date}`} className="flex items-center gap-3 p-2.5 rounded-lg bg-gray-50">
                      <div className={`w-2 h-2 rounded-full shrink-0 ${contact.isRead ? 'bg-gray-300' : 'bg-red-500'}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{contact.name}</p>
                        <p className="text-xs text-gray-400 truncate">{contact.property}</p>
                      </div>
                      <span className="text-xs text-gray-400 shrink-0">
                        {new Date(contact.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}
                      </span>
                    </div>
                  ))}
                  {analytics.business.recentContacts.length === 0 && (
                    <p className="text-sm text-gray-400 text-center py-4">Aucune demande</p>
                  )}
                </div>
              </m.div>
            </div>

            {/* Umami iframe */}
            {umamiUrl && (
              <m.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl shadow-md overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="text-base font-bold text-gray-900">Umami Analytics</h3>
                  <a href={umamiUrl} target="_blank" rel="noopener noreferrer"
                    className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1">
                    Ouvrir <ArrowTopRightOnSquareIcon className="w-3.5 h-3.5" />
                  </a>
                </div>
                <div className="w-full h-[600px]">
                  <iframe
                    src={`${umamiUrl}/share/overview`}
                    className="w-full h-full border-0"
                    sandbox="allow-scripts allow-popups allow-presentation"
                    title="Umami Analytics"
                  />
                </div>
              </m.div>
            )}
          </>
        )}

        {/* =================== AUDIENCE TAB =================== */}
        {activeTab === 'audience' && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Devices */}
              <m.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-md p-6">
                <h3 className="text-base font-bold text-gray-900 mb-4">Appareils</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center text-xl">
                      <svg className="w-6 h-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">Mobile</span>
                        <span className="text-sm font-bold text-gray-900">{analytics.devices.mobile}%</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div className="h-2 rounded-full bg-primary-500" style={{ width: `${analytics.devices.mobile}%` }} />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center">
                      <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">Ordinateur</span>
                        <span className="text-sm font-bold text-gray-900">{analytics.devices.desktop}%</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div className="h-2 rounded-full bg-green-500" style={{ width: `${analytics.devices.desktop}%` }} />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center">
                      <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">Tablette</span>
                        <span className="text-sm font-bold text-gray-900">{analytics.devices.tablet}%</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div className="h-2 rounded-full bg-purple-500" style={{ width: `${analytics.devices.tablet}%` }} />
                      </div>
                    </div>
                  </div>
                </div>
              </m.div>

              {/* Locations */}
              <m.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
                className="bg-white rounded-2xl shadow-md p-6">
                <h3 className="text-base font-bold text-gray-900 mb-4">Localisation</h3>
                <div className="space-y-2">
                  {analytics.locations.map((location, i) => {
                    const flags: Record<string, string> = {
                      'Madagascar': '\u{1F1F2}\u{1F1EC}', 'France': '\u{1F1EB}\u{1F1F7}',
                      'Maurice': '\u{1F1F2}\u{1F1FA}', 'Reunion': '\u{1F1F7}\u{1F1EA}',
                      'La Réunion': '\u{1F1F7}\u{1F1EA}',
                    };
                    return (
                      <div key={location.country} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-gray-50 transition-colors">
                        <span className="text-lg w-7 text-center">{flags[location.country] || '\u{1F30D}'}</span>
                        <span className="text-sm text-gray-700 flex-1">{location.country}</span>
                        <span className="text-sm font-bold text-gray-900">{location.visitors.toLocaleString('fr-FR')}</span>
                        <span className="text-xs text-gray-400 w-12 text-right">{location.percentage}%</span>
                      </div>
                    );
                  })}
                  {analytics.locations.length === 0 && (
                    <p className="text-sm text-gray-400 text-center py-4">Aucune donnée</p>
                  )}
                </div>
              </m.div>
            </div>

            {/* Traffic Sources detailed */}
            <m.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-md p-6 mb-6">
              <h3 className="text-base font-bold text-gray-900 mb-4">Sources de trafic</h3>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center p-4 rounded-xl bg-green-50">
                  <p className="text-2xl font-bold text-green-700">{analytics.traffic.organic}%</p>
                  <p className="text-sm text-green-600 mt-1">Recherche organique</p>
                </div>
                <div className="text-center p-4 rounded-xl bg-primary-50">
                  <p className="text-2xl font-bold text-primary-700">{analytics.traffic.direct}%</p>
                  <p className="text-sm text-primary-600 mt-1">Accès direct</p>
                </div>
                <div className="text-center p-4 rounded-xl bg-purple-50">
                  <p className="text-2xl font-bold text-purple-700">{analytics.traffic.social}%</p>
                  <p className="text-sm text-purple-600 mt-1">Réseaux sociaux</p>
                </div>
                <div className="text-center p-4 rounded-xl bg-orange-50">
                  <p className="text-2xl font-bold text-orange-700">{analytics.traffic.referral}%</p>
                  <p className="text-sm text-orange-600 mt-1">Référents</p>
                </div>
              </div>
            </m.div>

            {/* Top Pages */}
            <m.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
              className="bg-white rounded-2xl shadow-md p-6">
              <h3 className="text-base font-bold text-gray-900 mb-4">Top 10 pages</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left py-2 pr-4 text-xs font-semibold text-gray-500 uppercase">#</th>
                      <th className="text-left py-2 pr-4 text-xs font-semibold text-gray-500 uppercase">Page</th>
                      <th className="text-left py-2 pr-4 text-xs font-semibold text-gray-500 uppercase">URL</th>
                      <th className="text-right py-2 text-xs font-semibold text-gray-500 uppercase">Vues</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analytics.topPages.map((page, i) => (
                      <tr key={page.page} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                        <td className="py-2.5 pr-4 text-gray-400 font-bold">{i + 1}</td>
                        <td className="py-2.5 pr-4 font-medium text-gray-900 max-w-[200px] truncate">{page.title}</td>
                        <td className="py-2.5 pr-4 text-gray-400 max-w-[200px] truncate">{page.page}</td>
                        <td className="py-2.5 text-right font-bold text-gray-700">{page.views.toLocaleString('fr-FR')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {analytics.topPages.length === 0 && (
                  <p className="text-sm text-gray-400 text-center py-4">Aucune donnée</p>
                )}
              </div>
            </m.div>
          </>
        )}
      </div>
    </div>
  );
}
