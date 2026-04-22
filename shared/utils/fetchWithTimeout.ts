/**
 * fetch() with a timeout. Uses AbortSignal.timeout() when available (Node 17+,
 * modern browsers), otherwise falls back to AbortController with an explicit
 * TimeoutError reason so the console never shows "aborted without reason".
 *
 * @param url     - URL to fetch
 * @param options - Standard RequestInit options
 * @param ms      - Timeout in milliseconds (default 5000)
 */
export async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  ms = 5000,
): Promise<Response> {
  // Prefer the native API — no timer cleanup needed
  if (typeof AbortSignal !== 'undefined' && 'timeout' in AbortSignal) {
    return fetch(url, { ...options, signal: AbortSignal.timeout(ms) })
  }

  // Fallback: manual AbortController with an explicit reason
  const controller = new AbortController()
  const timer = setTimeout(
    () => controller.abort(new DOMException(`Request to ${url} timed out after ${ms}ms`, 'TimeoutError')),
    ms,
  )
  try {
    return await fetch(url, { ...options, signal: controller.signal })
  } finally {
    clearTimeout(timer)
  }
}
