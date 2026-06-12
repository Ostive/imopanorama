'use client'

import { m } from 'framer-motion';
import { HomeModernIcon, UserGroupIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';

interface RecentActivityData {
  properties: { id: string; title: string; createdAt: string; status: string }[];
  users: { id: string; firstName: string; lastName: string; email: string; createdAt: string }[];
  contacts: { id: string; firstName: string; lastName: string; email: string; createdAt: string; isRead: boolean }[];
}

function timeAgo(date: string) {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `Il y a ${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `Il y a ${hours}h`;
  const days = Math.floor(hours / 24);
  return `Il y a ${days}j`;
}

interface Props {
  data: RecentActivityData | null;
  loading: boolean;
}

export function RecentActivity({ data, loading }: Props) {
  const items: { key: string; color: string; bg: string; border: string; icon: React.ReactNode; label: React.ReactNode; time: string }[] = [];

  if (data) {
    data.properties.forEach(p => items.push({
      key: `p-${p.id}`,
      color: 'bg-green-500',
      bg: 'from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20',
      border: 'border-green-100 dark:border-green-900/40',
      icon: <HomeModernIcon className="w-5 h-5 text-white" />,
      label: <>Nouvelle propriété : <span className="text-green-600 dark:text-green-400">{p.title}</span></>,
      time: timeAgo(p.createdAt),
    }));

    data.users.forEach(u => items.push({
      key: `u-${u.id}`,
      color: 'bg-primary-500',
      bg: 'from-primary-50 to-cyan-50 dark:from-primary-900/20 dark:to-cyan-900/20',
      border: 'border-primary-100 dark:border-primary-900/40',
      icon: <UserGroupIcon className="w-5 h-5 text-white" />,
      label: <>Nouvel utilisateur : <span className="text-primary-600 dark:text-primary-400">{u.firstName} {u.lastName}</span></>,
      time: timeAgo(u.createdAt),
    }));

    data.contacts.forEach(c => items.push({
      key: `c-${c.id}`,
      color: 'bg-purple-500',
      bg: 'from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20',
      border: 'border-purple-100 dark:border-purple-900/40',
      icon: <ChatBubbleLeftRightIcon className="w-5 h-5 text-white" />,
      label: <>Message de <span className="text-purple-600 dark:text-purple-400">{c.firstName} {c.lastName}</span>{!c.isRead && <span className="ml-2 text-xs bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 px-1.5 py-0.5 rounded-full">Non lu</span>}</>,
      time: timeAgo(c.createdAt),
    }));

    items.sort((a, b) => 0); // already sorted by API
  }

  return (
    <m.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-card rounded-2xl shadow-lg p-6 border border-border"
    >
      <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
        <span className="text-2xl">🔔</span>
        Activité récente
      </h3>

      {loading && (
        <div className="space-y-4 animate-pulse">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-16 bg-muted rounded-xl" />
          ))}
        </div>
      )}

      {!loading && items.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-8">Aucune activité récente.</p>
      )}

      {!loading && items.length > 0 && (
        <div className="space-y-4">
          {items.map(item => (
            <m.div
              key={item.key}
              whileHover={{ x: 5 }}
              className={`flex items-start space-x-4 p-4 bg-linear-to-r ${item.bg} rounded-xl border ${item.border}`}
            >
              <div className={`w-10 h-10 ${item.color} rounded-xl flex items-center justify-center shrink-0`}>
                {item.icon}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">{item.label}</p>
                <p className="text-xs text-muted-foreground mt-1">{item.time}</p>
              </div>
            </m.div>
          ))}
        </div>
      )}
    </m.div>
  );
}
