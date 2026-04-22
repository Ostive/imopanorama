/**
 * @module api/analytics/data
 * @description Returns aggregated analytics data for the admin dashboard.
 * Compares the selected time range against the previous period to compute trends.
 *
 * | Method | Auth   | Description                                          |
 * |--------|--------|------------------------------------------------------|
 * | GET    | Admin  | Fetch overview, traffic, pages, devices, geo, etc.   |
 */

import { NextRequest, NextResponse } from 'next/server';
import { AnalyticsService } from '@/features/analytics/services/analyticsService';
import { requireAdmin } from '@/infrastructure/auth/auth-guard';
import { withErrorHandler } from '@/infrastructure/middleware/api-handler';

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

/** Maps query-param values to the number of days for each time range. */
const TIME_RANGE_DAYS: Record<string, number> = {
  '24h': 1,
  '7d': 7,
  '30d': 30,
  '90d': 90,
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Compute the [start, end] date window for a given time range key. */
function computeDateRange(timeRange: string): { start: Date; end: Date } {
  const end = new Date();
  const start = new Date();
  const days = TIME_RANGE_DAYS[timeRange] ?? 7;

  if (timeRange === '24h') {
    start.setHours(start.getHours() - 24);
  } else {
    start.setDate(start.getDate() - days);
  }

  return { start, end };
}

/** Compute the previous comparison window of the same length as [start, end]. */
function computePreviousRange(start: Date, timeRange: string): { prevStart: Date; prevEnd: Date } {
  const prevEnd = new Date(start);
  const prevStart = new Date(start);
  const days = TIME_RANGE_DAYS[timeRange] ?? 7;

  if (timeRange === '24h') {
    prevStart.setHours(prevStart.getHours() - 24);
  } else {
    prevStart.setDate(prevStart.getDate() - days);
  }

  return { prevStart, prevEnd };
}

// ---------------------------------------------------------------------------
// GET /api/analytics/data  (admin only)
// ---------------------------------------------------------------------------

export const GET = withErrorHandler(async (request: NextRequest) => {
  const { authorized, errorResponse } = await requireAdmin(request);
  if (!authorized) return errorResponse!;

  const timeRange = request.nextUrl.searchParams.get('timeRange') || '7d';
  const { start: startDate, end: endDate } = computeDateRange(timeRange);
  const { prevStart, prevEnd } = computePreviousRange(startDate, timeRange);

  // Fire all queries in parallel for maximum throughput
  const [
    overview, prevOverview, topPages,
    trafficSources, deviceBreakdown, geographicData,
    recentActivity, businessMetrics,
  ] = await Promise.all([
    AnalyticsService.getOverview(startDate, endDate),
    AnalyticsService.getOverview(prevStart, prevEnd),
    AnalyticsService.getTopPages(startDate, endDate, 10),
    AnalyticsService.getTrafficSources(startDate, endDate),
    AnalyticsService.getDeviceBreakdown(startDate, endDate),
    AnalyticsService.getGeographicData(startDate, endDate, 10),
    AnalyticsService.getRecentActivity(15),
    AnalyticsService.getBusinessMetrics(startDate, endDate),
  ]);

  // Format session duration into a human-readable string
  const minutes = Math.floor(overview.avgSessionDuration / 60);
  const seconds = overview.avgSessionDuration % 60;

  // Calculate period-over-period trends
  const visitorsTrend = AnalyticsService.calculateTrend(overview.uniqueVisitors, prevOverview.uniqueVisitors);
  const pageViewsTrend = AnalyticsService.calculateTrend(overview.totalPageViews, prevOverview.totalPageViews);
  const durationTrend = AnalyticsService.calculateTrend(overview.avgSessionDuration, prevOverview.avgSessionDuration);

  // For bounce rate, a decrease is positive (invert direction)
  const bounceRateTrend = AnalyticsService.calculateTrend(overview.bounceRate, prevOverview.bounceRate);
  bounceRateTrend.direction =
    bounceRateTrend.direction === 'up' ? 'down' :
    bounceRateTrend.direction === 'down' ? 'up' : 'neutral';

  return NextResponse.json({
    overview: {
      visitors: overview.uniqueVisitors,
      pageViews: overview.totalPageViews,
      bounceRate: overview.bounceRate,
      avgSessionDuration: `${minutes}m ${seconds}s`,
      trends: { visitors: visitorsTrend, pageViews: pageViewsTrend, bounceRate: bounceRateTrend, avgSessionDuration: durationTrend },
    },
    traffic: trafficSources,
    topPages,
    devices: deviceBreakdown,
    locations: geographicData,
    recentActivity,
    business: businessMetrics,
  });
});
