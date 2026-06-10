'use client'

import { useSyncExternalStore } from 'react'
import Script from 'next/script'
import {
  COOKIE_CONSENT_EVENT,
  type CookieConsentValue,
  readCookieConsent,
} from '@/shared/utils/cookieConsent'

export default function CookieConsentScripts() {
  const consent = useSyncExternalStore(
    (onStoreChange) => {
      window.addEventListener(COOKIE_CONSENT_EVENT, onStoreChange)
      window.addEventListener('storage', onStoreChange)
      return () => {
        window.removeEventListener(COOKIE_CONSENT_EVENT, onStoreChange)
        window.removeEventListener('storage', onStoreChange)
      }
    },
    readCookieConsent,
    () => null
  )

  if (
    consent !== 'accepted' ||
    process.env.NODE_ENV !== 'production' ||
    !process.env.NEXT_PUBLIC_UMAMI_URL ||
    !process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID
  ) {
    return null
  }

  return (
    <Script
      id="umami-analytics"
      defer
      src={`${process.env.NEXT_PUBLIC_UMAMI_URL}/custom-analytics`}
      data-website-id={process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID}
      strategy="afterInteractive"
    />
  )
}
