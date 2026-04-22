import { prisma } from '@/infrastructure/database/prisma';
import { DeviceType } from '@prisma/client';

export interface PageViewData {
  url: string;
  path: string;
  title?: string;
  referrer?: string;
  userId?: string;
  sessionId: string;
  ipAddress?: string;
  userAgent?: string;
  country?: string;
  city?: string;
  device?: DeviceType;
  browser?: string;
  os?: string;
  screenWidth?: number;
  duration?: number;
}

export interface EventData {
  name: string;
  category: string;
  label?: string;
  value?: number;
  metadata?: any;
  userId?: string;
  sessionId: string;
  path: string;
}

export interface SessionData {
  sessionId: string;
  userId?: string;
  ipAddress?: string;
  userAgent?: string;
  country?: string;
  city?: string;
  device?: DeviceType;
  browser?: string;
  os?: string;
  referrer?: string;
  entryPage?: string;
}

export class AnalyticsService {
  /**
   * Track a page view
   */
  static async trackPageView(data: PageViewData) {
    try {
      const pageView = await prisma.pageView.create({
        data: {
          url: data.url,
          path: data.path,
          title: data.title,
          referrer: data.referrer,
          userId: data.userId,
          sessionId: data.sessionId,
          ipAddress: data.ipAddress,
          userAgent: data.userAgent,
          country: data.country,
          city: data.city,
          device: data.device || DeviceType.DESKTOP,
          browser: data.browser,
          os: data.os,
          screenWidth: data.screenWidth,
          duration: data.duration,
        },
      });

      // Update session page views
      await this.updateSession(data.sessionId, { pageViews: 1 });

      return pageView;
    } catch (error) {
      console.error('Error tracking page view:', error);
      throw error;
    }
  }

  /**
   * Track a custom event
   */
  static async trackEvent(data: EventData) {
    try {
      const event = await prisma.event.create({
        data: {
          name: data.name,
          category: data.category,
          label: data.label,
          value: data.value,
          metadata: data.metadata || {},
          userId: data.userId,
          sessionId: data.sessionId,
          path: data.path,
        },
      });

      return event;
    } catch (error) {
      console.error('Error tracking event:', error);
      throw error;
    }
  }

  /**
   * Create or update a session
   */
  static async createOrUpdateSession(data: SessionData) {
    try {
      // Check if session exists
      const existingSession = await prisma.analyticsSession.findUnique({
        where: { sessionId: data.sessionId },
      });

      if (existingSession) {
        // Update session
        return await prisma.analyticsSession.update({
          where: { sessionId: data.sessionId },
          data: {
            lastActivityAt: new Date(),
            userId: data.userId || existingSession.userId,
          },
        });
      } else {
        // Create new session
        return await prisma.analyticsSession.create({
          data: {
            sessionId: data.sessionId,
            userId: data.userId,
            ipAddress: data.ipAddress,
            userAgent: data.userAgent,
            country: data.country,
            city: data.city,
            device: data.device || DeviceType.DESKTOP,
            browser: data.browser,
            os: data.os,
            referrer: data.referrer,
            entryPage: data.entryPage,
          },
        });
      }
    } catch (error) {
      console.error('Error creating/updating session:', error);
      throw error;
    }
  }

  /**
   * Update session data
   */
  static async updateSession(
    sessionId: string,
    data: {
      exitPage?: string;
      pageViews?: number;
      duration?: number;
      isActive?: boolean;
    }
  ) {
    try {
      const session = await prisma.analyticsSession.findUnique({
        where: { sessionId },
      });

      if (!session) return null;

      return await prisma.analyticsSession.update({
        where: { sessionId },
        data: {
          exitPage: data.exitPage || session.exitPage,
          pageViews: data.pageViews
            ? session.pageViews + data.pageViews
            : session.pageViews,
          duration: data.duration
            ? session.duration + data.duration
            : session.duration,
          isActive: data.isActive !== undefined ? data.isActive : session.isActive,
          lastActivityAt: new Date(),
          endedAt: data.isActive === false ? new Date() : session.endedAt,
        },
      });
    } catch (error) {
      console.error('Error updating session:', error);
      throw error;
    }
  }

  /**
   * Get analytics overview for a date range
   */
  static async getOverview(startDate: Date, endDate: Date) {
    try {
      const [totalPageViews, uniqueVisitors, totalSessions, avgSessionDuration] =
        await Promise.all([
          // Total page views
          prisma.pageView.count({
            where: {
              createdAt: { gte: startDate, lte: endDate },
            },
          }),

          // Unique visitors (based on unique sessionIds)
          prisma.analyticsSession.count({
            where: {
              startedAt: { gte: startDate, lte: endDate },
            },
          }),

          // Total sessions
          prisma.analyticsSession.count({
            where: {
              startedAt: { gte: startDate, lte: endDate },
            },
          }),

          // Average session duration (cap at 30 min = 1800s to exclude idle tabs)
          prisma.analyticsSession.aggregate({
            where: {
              startedAt: { gte: startDate, lte: endDate },
              duration: { gt: 0, lte: 1800 },
            },
            _avg: { duration: true },
          }),
        ]);

      // Calculate bounce rate (sessions with only 1 page view)
      const singlePageSessions = await prisma.analyticsSession.count({
        where: {
          startedAt: { gte: startDate, lte: endDate },
          pageViews: { lte: 1 },
        },
      });

      const bounceRate = totalSessions > 0 ? (singlePageSessions / totalSessions) * 100 : 0;

      return {
        totalPageViews: totalPageViews || 0,
        uniqueVisitors: uniqueVisitors || 0,
        bounceRate: Math.round(bounceRate * 10) / 10,
        avgSessionDuration: Math.round(avgSessionDuration._avg.duration || 0),
      };
    } catch (error) {
      console.error('Error getting analytics overview:', error);
      // Return empty data instead of throwing
      return {
        totalPageViews: 0,
        uniqueVisitors: 0,
        bounceRate: 0,
        avgSessionDuration: 0,
      };
    }
  }

  /**
   * Get top pages
   */
  static async getTopPages(startDate: Date, endDate: Date, limit: number = 10) {
    try {
      const pageViews = await prisma.pageView.groupBy({
        by: ['path', 'title'],
        where: {
          createdAt: { gte: startDate, lte: endDate },
        },
        _count: {
          id: true,
        },
        orderBy: {
          _count: {
            id: 'desc',
          },
        },
        take: limit,
      });

      return pageViews.map((pv: { path: string; title: string | null; _count: { id: number } }) => ({
        page: pv.path,
        title: pv.title || pv.path,
        views: pv._count.id,
      }));
    } catch (error) {
      console.error('Error getting top pages:', error);
      return [];
    }
  }

  /**
   * Get traffic sources
   */
  static async getTrafficSources(startDate: Date, endDate: Date) {
    try {
      const sessions = await prisma.analyticsSession.findMany({
        where: {
          startedAt: { gte: startDate, lte: endDate },
        },
        select: {
          referrer: true,
        },
      });

      const total = sessions.length;
      if (total === 0) {
        return { organic: 0, direct: 0, social: 0, referral: 0 };
      }

      let organic = 0;
      let direct = 0;
      let social = 0;
      let referral = 0;

      sessions.forEach((session: { referrer: string | null }) => {
        const ref = session.referrer?.toLowerCase() || '';

        if (!ref || ref === '') {
          direct++;
        } else if (
          ref.includes('google') ||
          ref.includes('bing') ||
          ref.includes('yahoo') ||
          ref.includes('duckduckgo')
        ) {
          organic++;
        } else if (
          ref.includes('facebook') ||
          ref.includes('twitter') ||
          ref.includes('instagram') ||
          ref.includes('linkedin') ||
          ref.includes('tiktok')
        ) {
          social++;
        } else {
          referral++;
        }
      });

      return {
        organic: Math.round((organic / total) * 100),
        direct: Math.round((direct / total) * 100),
        social: Math.round((social / total) * 100),
        referral: Math.round((referral / total) * 100),
      };
    } catch (error) {
      console.error('Error getting traffic sources:', error);
      return { organic: 0, direct: 0, social: 0, referral: 0 };
    }
  }

  /**
   * Get device breakdown
   */
  static async getDeviceBreakdown(startDate: Date, endDate: Date) {
    try {
      const sessions = await prisma.analyticsSession.groupBy({
        by: ['device'],
        where: {
          startedAt: { gte: startDate, lte: endDate },
        },
        _count: {
          id: true,
        },
      });

      const total = sessions.reduce((sum: number, s: { device: DeviceType; _count: { id: number } }) => sum + s._count.id, 0);
      if (total === 0) {
        return { mobile: 0, desktop: 0, tablet: 0 };
      }

      const deviceCounts = {
        mobile: 0,
        desktop: 0,
        tablet: 0,
      };

      sessions.forEach((s: { device: DeviceType; _count: { id: number } }) => {
        const device = s.device.toLowerCase() as keyof typeof deviceCounts;
        deviceCounts[device] = Math.round((s._count.id / total) * 100);
      });

      return deviceCounts;
    } catch (error) {
      console.error('Error getting device breakdown:', error);
      return { mobile: 0, desktop: 0, tablet: 0 };
    }
  }

  /**
   * Get geographic data
   */
  static async getGeographicData(startDate: Date, endDate: Date, limit: number = 10) {
    try {
      const locations = await prisma.analyticsSession.groupBy({
        by: ['country'],
        where: {
          startedAt: { gte: startDate, lte: endDate },
          country: { not: null },
        },
        _count: {
          id: true,
        },
        orderBy: {
          _count: {
            id: 'desc',
          },
        },
        take: limit,
      });

      const total = locations.reduce((sum: number, l: { country: string | null; _count: { id: number } }) => sum + l._count.id, 0);

      return locations.map((loc: { country: string | null; _count: { id: number } }) => ({
        country: loc.country || 'Unknown',
        visitors: loc._count.id,
        percentage: Math.round((loc._count.id / total) * 100),
      }));
    } catch (error) {
      console.error('Error getting geographic data:', error);
      return [];
    }
  }

  /**
   * Get recent activity
   */
  static async getRecentActivity(limit: number = 10) {
    try {
      const recentEvents = await prisma.event.findMany({
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
        select: {
          name: true,
          category: true,
          label: true,
          path: true,
          createdAt: true,
          metadata: true,
        },
      });

      const recentPageViews = await prisma.pageView.findMany({
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
        select: {
          path: true,
          title: true,
          city: true,
          createdAt: true,
        },
      });

      // Merge and sort by time
      const combined = [
        ...recentEvents.map((e: { name: string; label: string | null; createdAt: Date; metadata: any }) => ({
          time: e.createdAt,
          action: this.formatEventName(e.name, e.label ?? undefined),
          location: (e.metadata as any)?.city || 'Unknown',
        })),
        ...recentPageViews.map((pv: { path: string; title: string | null; city: string | null; createdAt: Date }) => ({
          time: pv.createdAt,
          action: `Page consultée: ${pv.title || pv.path}`,
          location: pv.city || 'Unknown',
        })),
      ]
        .sort((a, b) => b.time.getTime() - a.time.getTime())
        .slice(0, limit);

      return combined.map((item) => ({
        time: item.time.toLocaleTimeString('fr-FR', {
          hour: '2-digit',
          minute: '2-digit',
        }),
        action: item.action,
        location: item.location,
      }));
    } catch (error) {
      console.error('Error getting recent activity:', error);
      return [];
    }
  }

  /**
   * Format event name for display
   */
  private static formatEventName(name: string, label?: string): string {
    const eventNames: Record<string, string> = {
      terrain_view: 'Terrain consulté',
      contact_submit: 'Formulaire de contact soumis',
      favorite_add: 'Terrain ajouté aux favoris',
      favorite_remove: 'Terrain retiré des favoris',
      search: 'Recherche effectuée',
      user_register: 'Nouvel utilisateur inscrit',
      user_login: 'Connexion utilisateur',
      quote_request: 'Demande de devis',
    };

    const formatted = eventNames[name] || name;
    return label ? `${formatted}: ${label}` : formatted;
  }

  /**
   * Get business metrics (properties, contacts, favorites, conversions)
   */
  static async getBusinessMetrics(startDate: Date, endDate: Date) {
    try {
      // Current period
      const periodDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      const prevStart = new Date(startDate);
      prevStart.setDate(prevStart.getDate() - periodDays);
      const prevEnd = new Date(startDate);

      const [
        totalProperties,
        availableProperties,
        soldProperties,
        reservedProperties,
        propertyContacts,
        prevPropertyContacts,
        contacts,
        prevContacts,
        favorites,
        prevFavorites,
        batiQuotes,
        prevBatiQuotes,
        newUsers,
        prevNewUsers,
        totalUsers,
        propertyViews,
        prevPropertyViews,
        topViewedProperties,
        recentContacts,
      ] = await Promise.all([
        prisma.property.count(),
        prisma.property.count({ where: { status: 'AVAILABLE' } }),
        prisma.property.count({ where: { status: 'SOLD' } }),
        prisma.property.count({ where: { status: 'RESERVED' } }),
        prisma.propertyContact.count({ where: { createdAt: { gte: startDate, lte: endDate } } }),
        prisma.propertyContact.count({ where: { createdAt: { gte: prevStart, lte: prevEnd } } }),
        prisma.contact.count({ where: { createdAt: { gte: startDate, lte: endDate } } }),
        prisma.contact.count({ where: { createdAt: { gte: prevStart, lte: prevEnd } } }),
        prisma.propertyFavorite.count({ where: { createdAt: { gte: startDate, lte: endDate } } }),
        prisma.propertyFavorite.count({ where: { createdAt: { gte: prevStart, lte: prevEnd } } }),
        prisma.batiQuote.count({ where: { createdAt: { gte: startDate, lte: endDate } } }),
        prisma.batiQuote.count({ where: { createdAt: { gte: prevStart, lte: prevEnd } } }),
        prisma.user.count({ where: { createdAt: { gte: startDate, lte: endDate } } }),
        prisma.user.count({ where: { createdAt: { gte: prevStart, lte: prevEnd } } }),
        prisma.user.count(),
        prisma.event.count({ where: { name: 'property_view', createdAt: { gte: startDate, lte: endDate } } }),
        prisma.event.count({ where: { name: 'property_view', createdAt: { gte: prevStart, lte: prevEnd } } }),
        prisma.event.findMany({
          where: { name: 'property_view', createdAt: { gte: startDate, lte: endDate } },
          select: { label: true },
        }),
        prisma.propertyContact.findMany({
          take: 5,
          orderBy: { createdAt: 'desc' },
          select: {
            firstName: true,
            lastName: true,
            email: true,
            isRead: true,
            createdAt: true,
            property: { select: { title: true } },
          },
        }),
      ]);

      // Count top viewed properties
      const propertyViewCounts: Record<string, number> = {};
      topViewedProperties.forEach((e: { label: string | null }) => {
        const label = e.label || 'Unknown';
        propertyViewCounts[label] = (propertyViewCounts[label] || 0) + 1;
      });
      const topProperties = Object.entries(propertyViewCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([title, views]) => ({ title, views }));

      // Unread counts
      const [unreadContacts, unreadPropertyContacts, unreadQuotes] = await Promise.all([
        prisma.contact.count({ where: { isRead: false } }),
        prisma.propertyContact.count({ where: { isRead: false } }),
        prisma.batiQuote.count({ where: { isRead: false } }),
      ]);

      return {
        properties: {
          total: totalProperties,
          available: availableProperties,
          sold: soldProperties,
          reserved: reservedProperties,
        },
        conversions: {
          propertyContacts: { current: propertyContacts, previous: prevPropertyContacts },
          contacts: { current: contacts, previous: prevContacts },
          favorites: { current: favorites, previous: prevFavorites },
          batiQuotes: { current: batiQuotes, previous: prevBatiQuotes },
          newUsers: { current: newUsers, previous: prevNewUsers },
          propertyViews: { current: propertyViews, previous: prevPropertyViews },
        },
        totals: { totalUsers },
        unread: {
          contacts: unreadContacts,
          propertyContacts: unreadPropertyContacts,
          quotes: unreadQuotes,
          total: unreadContacts + unreadPropertyContacts + unreadQuotes,
        },
        topViewedProperties: topProperties,
        recentContacts: recentContacts.map((c: { firstName: string; lastName: string; email: string; isRead: boolean; createdAt: Date; property: { title: string } }) => ({
          name: `${c.firstName} ${c.lastName}`,
          email: c.email,
          property: c.property.title,
          isRead: c.isRead,
          date: c.createdAt.toISOString(),
        })),
      };
    } catch (error) {
      console.error('Error getting business metrics:', error);
      return {
        properties: { total: 0, available: 0, sold: 0, reserved: 0 },
        conversions: {
          propertyContacts: { current: 0, previous: 0 },
          contacts: { current: 0, previous: 0 },
          favorites: { current: 0, previous: 0 },
          batiQuotes: { current: 0, previous: 0 },
          newUsers: { current: 0, previous: 0 },
          propertyViews: { current: 0, previous: 0 },
        },
        totals: { totalUsers: 0 },
        unread: { contacts: 0, propertyContacts: 0, quotes: 0, total: 0 },
        topViewedProperties: [],
        recentContacts: [],
      };
    }
  }

  /**
   * Get trend percentage between current and previous period
   */
  static calculateTrend(current: number, previous: number): { value: number; direction: 'up' | 'down' | 'neutral' } {
    if (previous === 0 && current === 0) return { value: 0, direction: 'neutral' };
    if (previous === 0) return { value: 0, direction: 'neutral' }; // No comparison possible
    const change = ((current - previous) / previous) * 100;
    return {
      value: Math.abs(Math.round(change * 10) / 10),
      direction: change > 0 ? 'up' : change < 0 ? 'down' : 'neutral',
    };
  }

  /**
   * Clean up old analytics data (older than specified days)
   */
  static async cleanupOldData(daysToKeep: number = 90) {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

      const [deletedPageViews, deletedEvents, deletedSessions] = await Promise.all([
        prisma.pageView.deleteMany({
          where: {
            createdAt: { lt: cutoffDate },
          },
        }),
        prisma.event.deleteMany({
          where: {
            createdAt: { lt: cutoffDate },
          },
        }),
        prisma.analyticsSession.deleteMany({
          where: {
            startedAt: { lt: cutoffDate },
          },
        }),
      ]);

      return {
        deletedPageViews: deletedPageViews.count,
        deletedEvents: deletedEvents.count,
        deletedSessions: deletedSessions.count,
      };
    } catch (error) {
      console.error('Error cleaning up old data:', error);
      throw error;
    }
  }
}
