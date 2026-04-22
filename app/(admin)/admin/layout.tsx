'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/features/auth/context/AuthContext'
import ProtectedRoute from '@/features/auth/components/ProtectedRoute'
import { Bars3Icon } from '@heroicons/react/24/outline'
import {
  HomeIcon,
  BuildingOfficeIcon,
  UsersIcon,
  ChatBubbleLeftRightIcon,
  Cog6ToothIcon,
  ChartBarIcon,
  DocumentTextIcon,
  QuestionMarkCircleIcon,
  NewspaperIcon,
  PhotoIcon,
  BuildingOffice2Icon,
} from '@heroicons/react/24/outline'
import { AdminLayoutSkeleton, Sidebar } from './components'
import type { MenuItem } from './components'

const MENU_ITEMS: MenuItem[] = [
  { name: 'Dashboard',     href: '/admin',              icon: HomeIcon },
  { name: 'Propriétés',   href: '/admin/proprietes',   icon: BuildingOfficeIcon },
  { name: 'Actualités',   href: '/admin/news',         icon: NewspaperIcon },
  { name: 'Utilisateurs', href: '/admin/users',        icon: UsersIcon },
  { name: 'Messages',     href: '/admin/contacts',     icon: ChatBubbleLeftRightIcon },
  { name: 'FAQs',         href: '/admin/faqs',         icon: QuestionMarkCircleIcon },
  {
    name: 'BatiPanorama',
    href: '/admin/batipanorama',
    icon: BuildingOffice2Icon,
    submenu: [
      { name: "Vue d'ensemble", href: '/admin/batipanorama',          icon: HomeIcon },
      { name: 'Projets',        href: '/admin/batipanorama/projects', icon: BuildingOfficeIcon },
      { name: 'Services',       href: '/admin/batipanorama/services', icon: Cog6ToothIcon },
      { name: 'Processus',      href: '/admin/batipanorama/process',  icon: DocumentTextIcon },
    ],
  },
  { name: 'Images',       href: '/admin/images',       icon: PhotoIcon },
  { name: 'Analytics',    href: '/admin/analytics',    icon: ChartBarIcon },
  { name: 'Paramètres',  href: '/admin/settings',     icon: Cog6ToothIcon },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  const { user, logout } = useAuth()
  const pathname = usePathname()

  useEffect(() => {
    const t = setTimeout(() => setIsInitialLoad(false), 100)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => { setSidebarOpen(false) }, [pathname])

  useEffect(() => {
    fetch('/api/contacts/count')
      .then((r) => r.ok ? r.json() : null)
      .then((d) => d && setUnreadCount(d.unread || 0))
      .catch(() => {})
  }, [])

  const menuItems: MenuItem[] = MENU_ITEMS.map((item) =>
    item.href === '/admin/contacts' && unreadCount > 0
      ? { ...item, count: unreadCount }
      : item
  )

  const handleLogout = async () => {
    try { await logout() } catch {}
  }

  if (isInitialLoad || !user) {
    return (
      <ProtectedRoute requiredRole={['admin', 'super_admin']}>
        <AdminLayoutSkeleton />
      </ProtectedRoute>
    )
  }

  const pageTitle = pathname === '/admin'
    ? 'Dashboard'
    : pathname.split('/').filter(Boolean).pop()?.replace(/-/g, ' ') ?? 'Admin'

  return (
    <ProtectedRoute requiredRole={['admin', 'super_admin']}>
      <div className="flex h-screen overflow-hidden bg-gray-100">
        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-20 bg-black/50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <Sidebar
          user={user}
          menuItems={menuItems}
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onLogout={handleLogout}
        />

        <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
          {/* Mobile topbar */}
          <header className="lg:hidden flex items-center h-14 px-4 bg-white border-b border-gray-200 shrink-0">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-1.5 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <Bars3Icon className="h-5 w-5" />
            </button>
            <span className="ml-3 text-sm font-semibold text-gray-900 capitalize">{pageTitle}</span>
          </header>

          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
