export const COOKIE_CONSENT_NAME = 'imopanorama_cookie_consent'
const COOKIE_CONSENT_STORAGE_KEY = 'imopanorama.cookieConsent'
const COOKIE_CONSENT_MAX_AGE = 60 * 60 * 24 * 365
export const COOKIE_CONSENT_EVENT = 'imopanorama:cookie-consent'

export type CookieConsentValue = 'accepted' | 'refused'

function isConsentValue(value: string | null | undefined): value is CookieConsentValue {
  return value === 'accepted' || value === 'refused'
}

export function readCookieConsent(): CookieConsentValue | null {
  if (typeof document === 'undefined') return null

  const cookie = document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${COOKIE_CONSENT_NAME}=`))
    ?.split('=')[1]

  if (isConsentValue(cookie)) return cookie

  try {
    const stored = window.localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY)
    return isConsentValue(stored) ? stored : null
  } catch {
    return null
  }
}

export function persistCookieConsent(value: CookieConsentValue) {
  if (typeof document === 'undefined') return

  const secure = window.location.protocol === 'https:' ? '; Secure' : ''
  document.cookie = [
    `${COOKIE_CONSENT_NAME}=${value}`,
    'Path=/',
    `Max-Age=${COOKIE_CONSENT_MAX_AGE}`,
    'SameSite=Lax',
    secure,
  ].join('; ')

  try {
    window.localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, value)
  } catch {
    // Storage can be blocked in private mode; the cookie remains the source.
  }

  window.dispatchEvent(new CustomEvent<CookieConsentValue>(COOKIE_CONSENT_EVENT, { detail: value }))
}
