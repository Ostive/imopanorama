/**
 * @module api/analytics/track
 * @description Receives client-side analytics events (page views, custom
 * events, session lifecycle) and persists them via the AnalyticsService.
 *
 * | Method | Auth   | Description                              |
 * |--------|--------|------------------------------------------|
 * | POST   | Public | Track a page view, event, or session end  |
 *
 * ## Payload shape
 * ```json
 * {
 *   "type": "pageview" | "event" | "session_end",
 *   "data": { … }
 * }
 * ```
 */

import { NextRequest, NextResponse } from 'next/server';
import { AnalyticsService } from '@/features/analytics/services/analyticsService';
import { DeviceType } from '@prisma/client';
import { withErrorHandler } from '@/infrastructure/middleware/api-handler';
import { rateLimit } from '@/infrastructure/middleware/rate-limit';
import { COOKIE_CONSENT_NAME } from '@/shared/utils/cookieConsent';

// ---------------------------------------------------------------------------
// User-Agent detection helpers
// ---------------------------------------------------------------------------

/** Determine the device type from a User-Agent header value. */
function detectDevice(ua: string): DeviceType {
  const lower = ua.toLowerCase();
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(lower)) return DeviceType.TABLET;
  if (/mobile|iphone|ipod|blackberry|iemobile|opera mini/i.test(lower)) return DeviceType.MOBILE;
  return DeviceType.DESKTOP;
}

/** Extract browser name from the User-Agent string. */
function detectBrowser(ua: string): string {
  const lower = ua.toLowerCase();
  if (lower.includes('firefox')) return 'Firefox';
  if (lower.includes('chrome')) return 'Chrome';
  if (lower.includes('safari')) return 'Safari';
  if (lower.includes('edge')) return 'Edge';
  if (lower.includes('opera')) return 'Opera';
  return 'Unknown';
}

/** Extract operating system from the User-Agent string. */
function detectOS(ua: string): string {
  const lower = ua.toLowerCase();
  if (lower.includes('windows')) return 'Windows';
  if (lower.includes('mac')) return 'MacOS';
  if (lower.includes('linux')) return 'Linux';
  if (lower.includes('android')) return 'Android';
  if (lower.includes('ios') || lower.includes('iphone') || lower.includes('ipad')) return 'iOS';
  return 'Unknown';
}

/** Best-effort extraction of the originating client IP. */
function getClientIP(request: NextRequest): string | undefined {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    undefined
  );
}

// ---------------------------------------------------------------------------
// POST /api/analytics/track
// ---------------------------------------------------------------------------

export const POST = withErrorHandler(async (request: NextRequest) => {
  const limited = await rateLimit(request, { scope: 'analytics:track', limit: 120, windowMs: 60_000 });
  if (limited) return limited;

  if (request.cookies.get(COOKIE_CONSENT_NAME)?.value !== 'accepted') {
    return NextResponse.json({ success: true, skipped: true, reason: 'cookie_consent_required' });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let body: { type?: string; data?: Record<string, any> };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid JSON' }, { status: 400 });
  }
  const { type, data } = body;

  if (!data) {
    return NextResponse.json({ success: false, error: 'Missing data' }, { status: 400 });
  }

  const userAgent = request.headers.get('user-agent') || '';
  const ipAddress = getClientIP(request);
  const device = detectDevice(userAgent);
  const browser = detectBrowser(userAgent);
  const os = detectOS(userAgent);

  // Respond immediately — DB writes happen in the background so the client
  // is never blocked waiting for analytics to persist.
  switch (type) {
    case 'pageview': {
      if (data.path?.startsWith('/admin')) {
        return NextResponse.json({ success: true, skipped: true });
      }

      // Fire-and-forget
      Promise.all([
        AnalyticsService.trackPageView({
          url: data.url,
          path: data.path,
          title: data.title,
          referrer: data.referrer,
          userId: data.userId,
          sessionId: data.sessionId,
          ipAddress,
          userAgent,
          country: data.country,
          city: data.city,
          device,
          browser,
          os,
          screenWidth: data.screenWidth,
          duration: data.duration,
        }),
        AnalyticsService.createOrUpdateSession({
          sessionId: data.sessionId,
          userId: data.userId,
          ipAddress,
          userAgent,
          country: data.country,
          city: data.city,
          device,
          browser,
          os,
          referrer: data.referrer,
          entryPage: data.path,
        }),
      ]).catch(() => {/* silent */});

      return NextResponse.json({ success: true });
    }

    case 'event': {
      AnalyticsService.trackEvent({
        name: data.name,
        category: data.category,
        label: data.label,
        value: data.value,
        metadata: data.metadata,
        userId: data.userId,
        sessionId: data.sessionId,
        path: data.path,
      }).catch(() => {/* silent */});

      return NextResponse.json({ success: true });
    }

    case 'session_end': {
      AnalyticsService.updateSession(data.sessionId, {
        exitPage: data.exitPage,
        duration: data.duration,
        isActive: false,
      }).catch(() => {/* silent */});

      return NextResponse.json({ success: true });
    }

    default:
      return NextResponse.json({ success: true, skipped: true });
  }
});
