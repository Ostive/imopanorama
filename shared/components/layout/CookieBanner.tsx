'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { XMarkIcon } from '@heroicons/react/24/outline'

const STORAGE_KEY = 'imopanorama.cookieConsent'

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    try {
      if (!window.localStorage.getItem(STORAGE_KEY)) setVisible(true)
    } catch {
      setVisible(true)
    }
  }, [])

  const persist = (value: 'accepted' | 'refused') => {
    try {
      window.localStorage.setItem(STORAGE_KEY, value)
    } catch {
      // storage blocked (private mode) — silent fallback
    }
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Préférences cookies"
      className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-3xl rounded-2xl border border-gray-200 bg-white p-5 shadow-2xl dark:border-gray-700 dark:bg-gray-900 sm:inset-x-auto sm:left-6 sm:right-6"
    >
      <div className="flex items-start gap-4">
        <div className="flex-1 text-sm text-gray-700 dark:text-gray-200">
          <p className="font-bold text-gray-900 dark:text-white">On respecte votre vie privée</p>
          <p className="mt-1 leading-relaxed">
            On utilise des cookies pour faire fonctionner le site et mesurer son audience. Vous pouvez accepter ou refuser. Détails dans notre{' '}
            <Link href="/politique-confidentialite" className="font-semibold text-primary-600 hover:underline">
              politique de confidentialité
            </Link>
            .
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => persist('accepted')}
              className="rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-primary-700"
            >
              Tout accepter
            </button>
            <button
              type="button"
              onClick={() => persist('refused')}
              className="rounded-xl border border-gray-300 bg-white px-5 py-2.5 text-sm font-bold text-gray-700 transition hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
            >
              Refuser
            </button>
          </div>
        </div>
        <button
          type="button"
          onClick={() => persist('refused')}
          aria-label="Fermer"
          className="-m-1 rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}
