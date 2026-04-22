export interface AnalyticsOverview {
    visitors: number;
    pageViews: number;
    bounceRate: number;
    avgSessionDuration: string;
}

export interface TrafficSource {
    organic: number;
    direct: number;
    social: number;
    referral: number;
}

export interface TopPage {
    page: string;
    title: string;
    views: number;
}

export interface DeviceBreakdown {
    mobile: number;
    desktop: number;
    tablet: number;
}

export interface Location {
    country: string;
    visitors: number;
    percentage: number;
}

export interface RecentActivity {
    time: string;
    action: string;
    location: string;
}

export interface AnalyticsData {
    overview: AnalyticsOverview;
    traffic: TrafficSource;
    topPages: TopPage[];
    devices: DeviceBreakdown;
    locations: Location[];
    recentActivity: RecentActivity[];
}

export type TimeRange = '24h' | '7d' | '30d' | '90d';

export interface EventData {
    name: string;
    category: string;
    label?: string;
    value?: number;
    metadata?: any;
}
