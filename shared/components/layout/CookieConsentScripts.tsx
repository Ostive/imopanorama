'use client'

import { useEffect, useState } from 'react'
import Script from 'next/script'
import {
  COOKIE_CONSENT_EVENT,
  type CookieConsentValue,
  readCookieConsent,
} from '@/shared/utils/cookieConsent'

export default function CookieConsentScripts() {
  const [consent, setConsent] = useState<CookieConsentValue | null>(null)

  useEffect(() => {
    setConsent(readCookieConsent())

    const handleConsent = (event: Event) => {
      setConsent((event as CustomEvent<CookieConsentValue>).detail)
    }

    window.addEventListener(COOKIE_CONSENT_EVENT, handleConsent)
    return () => window.removeEventListener(COOKIE_CONSENT_EVENT, handleConsent)
  }, [])

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
