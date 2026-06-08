'use client'

import { useState, useRef, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import {
  XMarkIcon,
  ChevronDownIcon,
  HomeIcon,
  UserCircleIcon,
  ArrowLeftOnRectangleIcon,
  ArrowTopRightOnSquareIcon,
} from '@heroicons/react/24/outline'

export interface MenuItem {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  count?: number
  submenu?: MenuItem[]
}

interface SidebarProps {
  user: {
    firstName?: string | null
    lastName?: string | null
    email?: string | null
  }
  menuItems: MenuItem[]
  open: boolean
  onClose: () => void
  onLogout: () => void
}

function NavItem({ item, pathname, depth = 0 }: { item: MenuItem; pathname: string; depth?: number }) {
  const isActive = item.href === '/admin'
    ? pathname === '/admin'
    : pathname === item.href || (depth === 0 && !item.submenu && pathname.startsWith(item.href))

  const isParentActive = item.submenu?.some(
    (sub) => pathname === sub.href || pathname.startsWith(sub.href)
  )

  const [open, setOpen] = useState(() => !!isParentActive)

  if (item.submenu) {
    return (
      <div>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
            isParentActive
              ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
              : 'text-foreground hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
        >
          <div className="flex items-center gap-3">
            <item.icon className="h-5 w-5 shrink-0" />
            <span>{item.name}</span>
          </div>
          <ChevronDownIcon className={`h-4 w-4 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>
        {open && (
          <div className="mt-1 ml-4 pl-3 border-l border-border space-y-0.5">
            {item.submenu.map((sub) => (
              <NavItem key={sub.href} item={sub} pathname={pathname} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <Link
      href={item.href}
      className={`flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
        isActive
          ? 'bg-primary-100 dark:bg-primary-900/40 text-primary-900 dark:text-primary-200 border-r-2 border-primary-600'
          : depth > 0
          ? 'text-muted-foreground hover:bg-gray-50 dark:hover:bg-gray-800/50'
          : 'text-foreground hover:bg-gray-100 dark:hover:bg-gray-800'
      }`}
    >
      <div className="flex items-center gap-3">
        <item.icon className={`shrink-0 ${depth > 0 ? 'h-4 w-4' : 'h-5 w-5'}`} />
        <span>{item.name}</span>
      </div>
      {!!item.count && (
        <span className="bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-300 text-xs font-semibold px-2 py-0.5 rounded-full">
          {item.count}
        </span>
      )}
    </Link>
  )
}

function UserDropdown({ user, onLogout }: { user: SidebarProps['user']; onLogout: () => void }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const initials = [user?.firstName?.charAt(0), user?.lastName?.charAt(0)].filter(Boolean).join('')

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 w-full px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        title={`${user?.firstName} ${user?.lastName}`}
      >
        <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/40 text-primary-800 dark:text-primary-200 flex items-center justify-center font-semibold text-sm shrink-0">
          {initials || '?'}
        </div>
        <div className="flex-1 min-w-0 text-left">
          <p className="text-sm font-semibold text-foreground truncate">{user?.firstName} {user?.lastName}</p>
          <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
        </div>
        <ChevronDownIcon className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute bottom-full left-0 right-0 mb-1 bg-card border border-border rounded-xl shadow-xl py-1 z-50">
          {/* Identity */}
          <div className="px-3 py-2.5 border-b border-border">
            <p className="text-sm font-semibold text-foreground truncate">{user?.firstName} {user?.lastName}</p>
            <p className="text-xs text-muted-foreground truncate mt-0.5">{user?.email}</p>
          </div>

          {/* Actions */}
          <div className="py-1">
            <Link
              href="/admin/profile"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 text-sm text-foreground hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <UserCircleIcon className="h-4 w-4 text-muted-foreground" />
              Mon profil
            </Link>
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 text-sm text-foreground hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <ArrowTopRightOnSquareIcon className="h-4 w-4 text-muted-foreground" />
              Voir le site
            </Link>
          </div>

          <div className="border-t border-border py-1">
            <button type="button"
              onClick={() => { setOpen(false); onLogout() }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <ArrowLeftOnRectangleIcon className="h-4 w-4" />
              Se déconnecter
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export function Sidebar({ user, menuItems, open, onClose, onLogout }: SidebarProps) {
  const pathname = usePathname()

  return (
    <div
      className={`fixed inset-y-0 left-0 z-30 w-64 bg-card shadow-lg flex flex-col transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static ${
        open ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      {/* Logo */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-border shrink-0">
        <Link href="/" className="flex items-center">
          <Image
            src="/images/brand/logo.png"
            alt="Logo"
            width={140}
            height={48}
            className="object-contain h-10 w-auto"
            priority
          />
        </Link>
        <button type="button"
          onClick={onClose}
          className="lg:hidden p-1.5 rounded-lg text-muted-foreground hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-gray-200 dark:[&::-webkit-scrollbar-thumb]:bg-gray-700 [&::-webkit-scrollbar-thumb]:rounded-full">
        {menuItems.map((item) => (
          <NavItem key={item.href} item={item} pathname={pathname} />
        ))}
      </nav>

      {/* User dropdown */}
      <div className="px-3 py-3 border-t border-border shrink-0">
        <UserDropdown user={user} onLogout={onLogout} />
      </div>
    </div>
  )
}
