'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  BellIcon,
  CheckCircleIcon,
  ClockIcon,
  EyeIcon,
  TrashIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { AdminPageHeader, AdminTablePagination, StatsCard } from '../components';
import {
  NOTIFICATION_PRIORITY_LABELS,
  NOTIFICATION_TYPE_LABELS,
  NotificationItem,
  NotificationPriority,
} from '@/features/notifications/types';

const priorityClass: Record<NotificationPriority, string> = {
  LOW: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
  NORMAL: 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300',
  HIGH: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
  URGENT: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
};

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [total, setTotal] = useState(0);
  const [unread, setUnread] = useState(0);

  const totalPages = Math.max(1, Math.ceil(total / limit));
  const read = useMemo(() => Math.max(0, total - unread), [total, unread]);

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
      });
      if (unreadOnly) params.set('unreadOnly', 'true');
      const res = await fetch(`/api/notifications?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch notifications');
      const data = await res.json();
      setNotifications(data.notifications || []);
      setTotal(data.total || 0);
      setUnread(data.unread || 0);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [page, limit, unreadOnly]);

  const markAsRead = async (id: string) => {
    const res = await fetch(`/api/notifications/${id}`, { method: 'PATCH' });
    if (res.ok) fetchNotifications();
  };

  const deleteNotification = async (id: string) => {
    const res = await fetch(`/api/notifications/${id}`, { method: 'DELETE' });
    if (res.ok) fetchNotifications();
  };

  const markAllAsRead = async () => {
    const res = await fetch('/api/notifications', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'mark-all-read' }),
    });
    if (res.ok) fetchNotifications();
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-primary-50/20 dark:from-gray-950 dark:via-gray-900 dark:to-primary-950/20 py-8">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <AdminPageHeader
          icon={<BellIcon className="w-6 h-6 text-white" />}
          title="Notifications"
          subtitle="Alertes admin, nouveaux leads et rappels CRM"
          showBackButton
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 mb-8">
          <StatsCard title="Total" value={total} icon={<BellIcon className="w-7 h-7" />} color="blue" />
          <StatsCard title="Non lues" value={unread} icon={<ClockIcon className="w-7 h-7" />} color="amber" delay={0.05} />
          <StatsCard title="Traitees" value={read} icon={<CheckCircleIcon className="w-7 h-7" />} color="green" delay={0.1} />
        </div>

        <div className="mb-6 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between rounded-2xl border border-border bg-card p-4 shadow-sm">
          <button type="button"
            onClick={() => { setUnreadOnly((value) => !value); setPage(1); }}
            className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition ${
              unreadOnly
                ? 'bg-primary-600 text-white'
                : 'bg-muted text-foreground hover:bg-gray-200 dark:hover:bg-gray-800'
            }`}
          >
            {unreadOnly ? <XMarkIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
            {unreadOnly ? 'Voir toutes' : 'Voir non lues'}
          </button>
          <button type="button"
            onClick={markAllAsRead}
            disabled={unread === 0}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <CheckCircleIcon className="h-4 w-4" />
            Tout marquer comme lu
          </button>
        </div>

        <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-xl">
          {isLoading ? (
            <div className="divide-y divide-border">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="p-5 animate-pulse">
                  <div className="h-4 w-1/3 rounded bg-muted mb-3" />
                  <div className="h-3 w-2/3 rounded bg-muted" />
                </div>
              ))}
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-16 text-center">
              <BellIcon className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-bold text-foreground">Aucune notification</h3>
              <p className="mt-2 text-sm text-muted-foreground">Les nouveaux contacts et alertes CRM apparaitront ici.</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-5 transition ${notification.isRead ? 'bg-card' : 'bg-primary-50/50 dark:bg-primary-950/20'}`}
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        {!notification.isRead && <span className="h-2.5 w-2.5 rounded-full bg-primary-600" />}
                        <h3 className="font-bold text-foreground">{notification.title}</h3>
                        <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-bold text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                          {NOTIFICATION_TYPE_LABELS[notification.type] || notification.type}
                        </span>
                        <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${priorityClass[notification.priority]}`}>
                          {NOTIFICATION_PRIORITY_LABELS[notification.priority] || notification.priority}
                        </span>
                      </div>
                      <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">{notification.message}</p>
                      <p className="mt-2 text-xs font-medium text-muted-foreground">
                        {new Date(notification.createdAt).toLocaleString('fr-FR', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2 lg:justify-end">
                      {notification.targetUrl && (
                        <Link
                          href={notification.targetUrl}
                          className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 text-sm font-bold text-foreground transition hover:bg-muted"
                        >
                          <EyeIcon className="h-4 w-4" />
                          Ouvrir
                        </Link>
                      )}
                      {!notification.isRead && (
                        <button type="button"
                          onClick={() => markAsRead(notification.id)}
                          className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-3 py-2 text-sm font-bold text-white transition hover:bg-primary-700"
                        >
                          <CheckCircleIcon className="h-4 w-4" />
                          Lu
                        </button>
                      )}
                      <button type="button"
                        onClick={() => deleteNotification(notification.id)}
                        className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-card px-3 py-2 text-sm font-bold text-red-600 transition hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-950/20"
                      >
                        <TrashIcon className="h-4 w-4" />
                        Supprimer
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <AdminTablePagination
            page={page}
            limit={limit}
            total={total}
            totalPages={totalPages}
            onPageChange={setPage}
            onLimitChange={(nextLimit) => { setLimit(nextLimit); setPage(1); }}
          />
        </div>
      </div>
    </div>
  );
}
