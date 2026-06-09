'use client'

import React, { useState, useEffect } from 'react'
import { m, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import {
  Bars3Icon,
  XMarkIcon,
  UserIcon,
  Cog6ToothIcon,
  ArrowRightStartOnRectangleIcon,
  BuildingOffice2Icon,
  MagnifyingGlassIcon,
  EnvelopeIcon,
  SunIcon,
  MoonIcon,
  HomeIcon,
  NewspaperIcon,
  KeyIcon,
  TagIcon,
} from '@heroicons/react/24/outline'
import {
  UserCircleIcon,
  HeartIcon as HeartIconSolid,
  EnvelopeIcon as EnvelopeSolidIcon,
} from '@heroicons/react/24/solid'
import { HeartIcon } from '@heroicons/react/24/outline'
import { useAuth } from '@/features/auth/context/AuthContext'
import { useTheme } from '@/shared/theme/ThemeContext'
import { useFavorites } from '@/features/favorites/context/FavoritesContext'
import { useContacts } from '@/features/contacts/context/ContactsContext'

const navigation = [
  { name: 'Acheter', href: '/proprietes?view=grid&transactionType=SALE&sort=date_desc', icon: HomeIcon },
  { name: 'Louer', href: '/proprietes?view=grid&transactionType=RENT&sort=date_desc', icon: KeyIcon },
  { name: 'Vendre', href: '/vendre', icon: TagIcon },
  { name: 'Construction', href: '/batipanorama', icon: BuildingOffice2Icon },
  { name: 'Actualités', href: '/actualites', icon: NewspaperIcon },
]

function Header() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearchExpanded, setIsSearchExpanded] = useState(false)
  const { user, isAuthenticated, logout, hasRole } = useAuth()
  const { favoritesCount } = useFavorites()
  const { contactsCount } = useContacts()
  const { themeMode, toggleThemeMode } = useTheme()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/proprietes?search=${encodeURIComponent(searchQuery)}`)
      setIsSearchExpanded(false)
      setSearchQuery('')
    }
  }

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close menus on route change
  useEffect(() => {
    setIsMenuOpen(false)
    setIsUserMenuOpen(false)
  }, [pathname])

  const handleLogout = async () => {
    try {
      await logout()
      setIsUserMenuOpen(false)
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error)
    }
  }

  const isActive = (href: string) => {
    const [hrefPath, hrefQuery] = href.split('?')
    // For /proprietes, match on transactionType so Acheter / Louer stay distinct
    if (hrefPath === '/proprietes') {
      if (!pathname.startsWith('/proprietes')) return false
      const hrefTx = new URLSearchParams(hrefQuery || '').get('transactionType')
      const currentTx = searchParams?.get('transactionType')
      return hrefTx === currentTx
    }
    return pathname.startsWith(hrefPath)
  }

  return (
    <m.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-lg shadow-black/5'
          : 'bg-card shadow-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">

          {/* Left: Mobile burger + Logo */}
          <div className="flex items-center gap-2">
            <button type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-muted-foreground hover:bg-muted transition-colors"
              aria-label="Menu"
            >
              <AnimatePresence mode="wait" initial={false}>
                {isMenuOpen ? (
                  <m.span
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </m.span>
                ) : (
                  <m.span
                    key="open"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Bars3Icon className="h-6 w-6" />
                  </m.span>
                )}
              </AnimatePresence>
            </button>

            <Link href="/" className="flex items-center shrink-0">
              <m.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Image
                  src="/images/brand/logo.png"
                  alt="ImoPanorama Madagascar"
                  width={320}
                  height={96}
                  className="h-10 sm:h-12 w-auto object-contain"
                  priority
                />
              </m.div>
            </Link>
          </div>

          {/* Center: Nav links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {navigation.map((item) => {
              const active = isActive(item.href)
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`relative px-3 py-2 text-sm font-semibold rounded-xl transition-colors duration-200 ${
                    active
                      ? 'text-primary-600 dark:text-primary-400'
                      : 'text-muted-foreground hover:text-gray-900 dark:hover:text-gray-100 hover:bg-muted'
                  }`}
                >
                  {active && (
                    <m.span
                      layoutId="nav-pill"
                      className="absolute inset-0 bg-primary-50 dark:bg-primary-900/20 rounded-xl"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative">{item.name}</span>
                </Link>
              )
            })}
          </nav>

          {/* Center: Search (Desktop) */}
          <div className="hidden xl:flex items-center flex-1 max-w-xs xl:max-w-sm">
            <AnimatePresence mode="wait">
              {!isSearchExpanded ? (
                <m.button
                  key="compact"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsSearchExpanded(true)}
                  className="flex items-center gap-2 px-4 py-2 w-full bg-muted rounded-xl text-sm text-muted-foreground hover:bg-muted transition-colors"
                >
                  <MagnifyingGlassIcon className="h-4 w-4 shrink-0" />
                  <span>Rechercher...</span>
                </m.button>
              ) : (
                <m.form
                  key="expanded"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSearch}
                  className="relative w-full"
                >
                  <input
                    aria-label="Rechercher une propriété"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onBlur={() => { if (!searchQuery) setIsSearchExpanded(false) }}
                    placeholder="Rechercher une propriété..."
                    className="w-full pl-10 pr-4 py-2.5 text-sm border-2 border-primary-500 rounded-xl bg-card text-foreground placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30"
                  />
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary-500" />
                </m.form>
              )}
            </AnimatePresence>
          </div>

          {/* Right: Actions + Auth */}
          <div className="flex items-center gap-1 shrink-0">

            {/* Dark mode toggle */}
            <m.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={toggleThemeMode}
              className="p-2 rounded-xl text-muted-foreground hover:bg-muted transition-colors"
              aria-label="Basculer le mode sombre"
            >
              <AnimatePresence mode="wait" initial={false}>
                {themeMode === 'dark' ? (
                  <m.span
                    key="sun"
                    initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                    animate={{ rotate: 0, opacity: 1, scale: 1 }}
                    exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <SunIcon className="h-5 w-5" />
                  </m.span>
                ) : (
                  <m.span
                    key="moon"
                    initial={{ rotate: 90, opacity: 0, scale: 0.5 }}
                    animate={{ rotate: 0, opacity: 1, scale: 1 }}
                    exit={{ rotate: -90, opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <MoonIcon className="h-5 w-5" />
                  </m.span>
                )}
              </AnimatePresence>
            </m.button>

            {/* Mobile Search */}
            <m.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => router.push('/proprietes')}
              className="lg:hidden p-2 rounded-xl text-muted-foreground hover:bg-muted transition-colors"
            >
              <MagnifyingGlassIcon className="h-5 w-5" />
            </m.button>

            {/* Favorites */}
            <m.div whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }} className="relative">
              <Link
                href="/favoris"
                className="relative p-2 rounded-xl text-muted-foreground hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors inline-flex items-center justify-center group"
              >
                <HeartIcon className="h-5 w-5 group-hover:hidden" />
                <HeartIconSolid className="h-5 w-5 hidden group-hover:block text-red-500" />
                {favoritesCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[9px] font-bold rounded-full h-4 w-4 flex items-center justify-center shadow">
                    {favoritesCount > 9 ? '9+' : favoritesCount}
                  </span>
                )}
              </Link>
            </m.div>

            {/* Contacts (authenticated, desktop) */}
            {isAuthenticated && (
              <m.div whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }} className="relative hidden lg:block">
                <Link
                  href="/mes-demandes"
                  className="relative p-2 rounded-xl text-muted-foreground hover:text-primary-500 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors inline-flex items-center justify-center group"
                  title="Mes demandes"
                >
                  <EnvelopeIcon className="h-5 w-5 group-hover:hidden" />
                  <EnvelopeSolidIcon className="h-5 w-5 hidden group-hover:block text-primary-500" />
                  {contactsCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 bg-primary-500 text-white text-[9px] font-bold rounded-full h-4 w-4 flex items-center justify-center shadow">
                      {contactsCount > 9 ? '9+' : contactsCount}
                    </span>
                  )}
                </Link>
              </m.div>
            )}

            {/* Mobile: User icon */}
            <m.div whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }} className="lg:hidden">
              <Link
                href={isAuthenticated ? '/profile' : '/login'}
                className="p-2 rounded-xl text-muted-foreground hover:bg-muted transition-colors inline-flex"
              >
                <UserIcon className="h-5 w-5" />
              </Link>
            </m.div>

            {/* Desktop Auth */}
            <div className="hidden lg:flex items-center gap-2 ml-1">
              {isAuthenticated ? (
                <div className="relative">
                  <m.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-muted transition-colors"
                  >
                    <div className="h-8 w-8 rounded-full bg-linear-to-br from-primary-500 to-primary-500 flex items-center justify-center text-white text-sm font-bold shadow">
                      {user?.firstName?.[0]?.toUpperCase() ?? <UserCircleIcon className="h-5 w-5" />}
                    </div>
                    <span className="text-sm font-semibold text-foreground">
                      {user?.firstName}
                    </span>
                    <m.svg
                      animate={{ rotate: isUserMenuOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="h-4 w-4 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </m.svg>
                  </m.button>

                  <AnimatePresence>
                    {isUserMenuOpen && (
                      <m.div
                        initial={{ opacity: 0, scale: 0.95, y: -8 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -8 }}
                        transition={{ duration: 0.15, ease: 'easeOut' }}
                        className="absolute right-0 mt-2 w-60 bg-card rounded-2xl shadow-xl border border-border overflow-hidden z-50"
                      >
                        {/* User info header */}
                        <div className="px-4 py-3 bg-linear-to-r from-primary-50 to-primary-50 dark:from-gray-700/60 dark:to-gray-700/60">
                          <p className="text-sm font-bold text-foreground">
                            {user?.firstName} {user?.lastName}
                          </p>
                          <p className="text-xs text-muted-foreground truncate mt-0.5">{user?.email}</p>
                        </div>

                        <div className="p-1.5 space-y-0.5">
                          {hasRole('admin') && (
                            <a
                              href="/admin"
                              onClick={(e) => { e.preventDefault(); setIsUserMenuOpen(false); window.location.href = '/admin' }}
                              className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-foreground hover:bg-primary-50 dark:hover:bg-gray-700 transition-colors"
                            >
                              <span className="w-7 h-7 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center shrink-0">
                                <Cog6ToothIcon className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                              </span>
                              Administration
                            </a>
                          )}
                          <a
                            href="/profile"
                            onClick={(e) => { e.preventDefault(); setIsUserMenuOpen(false); window.location.href = '/profile' }}
                            className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-foreground hover:bg-muted transition-colors"
                          >
                            <span className="w-7 h-7 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center shrink-0">
                              <UserIcon className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                            </span>
                            Mon profil
                          </a>
                        </div>

                        <div className="p-1.5 border-t border-border">
                          <button type="button"
                            onClick={handleLogout}
                            className="flex items-center gap-3 w-full px-3 py-2 rounded-xl text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                          >
                            <span className="w-7 h-7 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center shrink-0">
                              <ArrowRightStartOnRectangleIcon className="h-4 w-4 text-red-600 dark:text-red-400" />
                            </span>
                            Se déconnecter
                          </button>
                        </div>
                      </m.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <m.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                    <Link
                      href="/login"
                      className="px-4 py-2 text-sm font-semibold text-foreground hover:text-primary-600 dark:hover:text-primary-400 rounded-xl hover:bg-muted transition-colors"
                    >
                      Connexion
                    </Link>
                  </m.div>
                  <m.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                    <Link
                      href="/register"
                      className="px-4 py-2 text-sm font-semibold bg-linear-to-r from-primary-600 to-primary-600 hover:from-primary-700 hover:to-primary-700 text-white rounded-xl shadow-md hover:shadow-lg transition-all"
                    >
                      S'inscrire
                    </Link>
                  </m.div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <m.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="lg:hidden absolute top-full inset-x-0 overflow-hidden border-t border-border shadow-xl"
          >
            <div className="px-4 py-4 space-y-1 bg-card max-h-[calc(100vh-4rem)] overflow-y-auto">

              {/* Nav links */}
              {navigation.map((item, i) => {
                const active = isActive(item.href)
                const Icon = item.icon
                return (
                  <m.a
                    key={item.name}
                    href={item.href}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={(e) => { e.preventDefault(); setIsMenuOpen(false); window.location.href = item.href }}
                    className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold transition-colors ${
                      active
                        ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                        : 'text-foreground hover:bg-muted'
                    }`}
                  >
                    <Icon className="h-5 w-5 shrink-0" />
                    {item.name}
                    {active && (
                      <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary-500" />
                    )}
                  </m.a>
                )
              })}

              {/* Favorites */}
              <m.div
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: navigation.length * 0.05 }}
              >
                <Link
                  href="/favoris"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold text-foreground hover:bg-muted transition-colors"
                >
                  <HeartIcon className="h-5 w-5 shrink-0" />
                  Mes favoris
                  {favoritesCount > 0 && (
                    <span className="ml-auto bg-red-500 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {favoritesCount > 9 ? '9+' : favoritesCount}
                    </span>
                  )}
                </Link>
              </m.div>

              {/* Contacts (authenticated) */}
              {isAuthenticated && (
                <m.div
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: (navigation.length + 1) * 0.05 }}
                >
                  <Link
                    href="/mes-demandes"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold text-foreground hover:bg-muted transition-colors"
                  >
                    <EnvelopeIcon className="h-5 w-5 shrink-0" />
                    Mes demandes
                    {contactsCount > 0 && (
                      <span className="ml-auto bg-primary-500 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center">
                        {contactsCount > 9 ? '9+' : contactsCount}
                      </span>
                    )}
                  </Link>
                </m.div>
              )}

              {/* Divider + Auth */}
              <div className="pt-3 border-t border-border">
                {isAuthenticated ? (
                  <div className="space-y-1">
                    <div className="flex items-center gap-3 px-3 py-2">
                      <div className="h-9 w-9 rounded-full bg-linear-to-br from-primary-500 to-primary-500 flex items-center justify-center text-white text-sm font-bold shadow shrink-0">
                        {user?.firstName?.[0]?.toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-foreground truncate">
                          {user?.firstName} {user?.lastName}
                        </p>
                        <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                      </div>
                    </div>
                    {hasRole('admin') && (
                      <a
                        href="/admin"
                        onClick={(e) => { e.preventDefault(); setIsMenuOpen(false); window.location.href = '/admin' }}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-foreground hover:bg-muted transition-colors"
                      >
                        <Cog6ToothIcon className="h-5 w-5 text-primary-500" />
                        Administration
                      </a>
                    )}
                    <a
                      href="/profile"
                      onClick={(e) => { e.preventDefault(); setIsMenuOpen(false); window.location.href = '/profile' }}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-foreground hover:bg-muted transition-colors"
                    >
                      <UserIcon className="h-5 w-5" />
                      Mon profil
                    </a>
                    <button type="button"
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      <ArrowRightStartOnRectangleIcon className="h-5 w-5" />
                      Se déconnecter
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Link
                      href="/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center justify-center gap-2 py-2.5 px-4 text-sm font-semibold text-foreground rounded-xl border-2 border-border hover:border-primary-300 hover:text-primary-600 dark:hover:text-primary-400 transition-all"
                    >
                      <UserIcon className="h-5 w-5" />
                      Connexion
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center justify-center gap-2 py-2.5 px-4 bg-linear-to-r from-primary-600 to-primary-600 hover:from-primary-700 hover:to-primary-700 text-white text-sm font-semibold rounded-xl shadow-md transition-all"
                    >
                      S'inscrire
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </m.header>
  )
}

export default React.memo(Header)
