'use client'

import { useState, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@/features/auth/context/AuthContext'
import ProtectedRoute from '@/features/auth/components/ProtectedRoute'
import Image from 'next/image'
import Link from 'next/link'
import {
  Bars3Icon,
  ArrowLeftOnRectangleIcon,
  UserCircleIcon,
  ArrowTopRightOnSquareIcon,
} from '@heroicons/react/24/outline'
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
  BellIcon,
} from '@heroicons/react/24/outline'
import { AdminLayoutSkeleton } from './components/AdminLayoutSkeleton'
import { Sidebar } from './components/sidebar/Sidebar'
import type { MenuItem } from './components/sidebar/Sidebar'

const MENU_ITEMS: MenuItem[] = [
  { name: 'Dashboard',     href: '/admin',              icon: HomeIcon },
  { name: 'Propriétés',   href: '/admin/proprietes',   icon: BuildingOfficeIcon },
  { name: 'Actualités',   href: '/admin/news',         icon: NewspaperIcon },
  { name: 'Utilisateurs', href: '/admin/users',        icon: UsersIcon },
  { name: 'Messages',     href: '/admin/contacts',     icon: ChatBubbleLeftRightIcon },
  { name: 'Notifications', href: '/admin/notifications', icon: BellIcon },
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  const { user, logout } = useAuth()
  const pathname = usePathname()
  const mobileMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!mobileMenuOpen) return
    const handler = (e: MouseEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target as Node)) {
        setMobileMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [mobileMenuOpen])

  const { data: counts } = useQuery({
    queryKey: ['admin-layout-counts'],
    queryFn: async () => {
      const [contacts, notifications] = await Promise.all([
        fetch('/api/contacts/count').then((r) => r.ok ? r.json() : null).catch(() => null),
        fetch('/api/notifications/count').then((r) => r.ok ? r.json() : null).catch(() => null),
      ])
      return {
        unreadCount: contacts?.unread || 0,
        unreadNotifications: notifications?.unread || 0,
      }
    },
    staleTime: 30_000,
  })

  useEffect(() => {
    const t = setTimeout(() => setIsInitialLoad(false), 100)
    return () => clearTimeout(t)
  }, [])

  const unreadCount = counts?.unreadCount || 0
  const unreadNotifications = counts?.unreadNotifications || 0

  const menuItems: MenuItem[] = MENU_ITEMS.map((item) =>
    item.href === '/admin/contacts' && unreadCount > 0
      ? { ...item, count: unreadCount }
      : item.href === '/admin/notifications' && unreadNotifications > 0
      ? { ...item, count: unreadNotifications }
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
      <div className="fixed inset-0 flex overflow-hidden bg-gray-100 dark:bg-gray-950">
        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            aria-hidden="true"
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
          <header className="lg:hidden relative flex items-center justify-between h-14 px-3 bg-card border-b border-border shrink-0">
            {/* Left: hamburger */}
            <button type="button"
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg text-muted-foreground hover:text-gray-700 dark:hover:text-gray-200 hover:bg-muted transition-colors shrink-0"
            >
              <Bars3Icon className="h-5 w-5" />
            </button>

            {/* Center: logo */}
            <div className="absolute left-1/2 -translate-x-1/2 pointer-events-none">
              <Image
                src="/images/brand/logo.png"
                alt="ImoPanorama"
                width={110}
                height={36}
                className="h-6 w-auto object-contain"
                priority
              />
            </div>

            {/* Right: avatar dropdown */}
            <div className="relative shrink-0" ref={mobileMenuRef}>
              <button type="button"
                onClick={() => setMobileMenuOpen((o) => !o)}
                className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/40 text-primary-800 dark:text-primary-200 flex items-center justify-center font-semibold text-xs select-none hover:ring-2 hover:ring-primary-400 transition-all"
              >
                {[user?.firstName?.charAt(0), user?.lastName?.charAt(0)].filter(Boolean).join('') || '?'}
              </button>

              {mobileMenuOpen && (
                <div className="absolute top-full right-0 mt-1.5 w-56 bg-card border border-border rounded-xl shadow-xl py-1 z-50">
                  <div className="px-3 py-2.5 border-b border-border">
                    <p className="text-sm font-semibold text-foreground truncate">{user?.firstName} {user?.lastName}</p>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">{user?.email}</p>
                  </div>
                  <div className="py-1">
                    <Link
                      href="/admin/profile"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-sm text-foreground hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <UserCircleIcon className="h-4 w-4 text-muted-foreground" />
                      Mon profil
                    </Link>
                    <Link
                      href="/"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-sm text-foreground hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <ArrowTopRightOnSquareIcon className="h-4 w-4 text-muted-foreground" />
                      Voir le site
                    </Link>
                  </div>
                  <div className="border-t border-border py-1">
                    <button type="button"
                      onClick={() => { setMobileMenuOpen(false); handleLogout() }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      <ArrowLeftOnRectangleIcon className="h-4 w-4" />
                      Se déconnecter
                    </button>
                  </div>
                </div>
              )}
            </div>
          </header>

          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
