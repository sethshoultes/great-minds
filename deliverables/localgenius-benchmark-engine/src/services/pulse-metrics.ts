/**
 * Pulse Metrics Service
 * Spec: engineering/data-model.md (Core Metrics)
 *
 * Transforms raw analytics and action events into 5 core Pulse metrics:
 * 1. Engagement Rate (%)
 * 2. Post Frequency (posts/week)
 * 3. Engagement Growth (week-over-week %)
 * 4. Response Time (hours)
 * 5. Conversion Rate (%)
 *
 * Used by nightly batch job to compute metrics for insights engine.
 *
 * Industry Focus: Restaurants only (REQ-007)
 * NAICS codes: 722xxx (Food Services and Drinking Places)
 */

import { db } from "@/lib/db";
import {
  analyticsEvents,
  attributionEvents,
  actions,
  reviews,
  reviewResponses,
  businesses,
} from "@/db/schema";
import { eq, and, gte, lte, sql, like, or } from "drizzle-orm";

/**
 * Restaurant NAICS codes (REQ-008)
 * 722xxx - Food Services and Drinking Places
 */
export const RESTAURANT_NAICS_CODES = {
  /** Full-Service Restaurants */
  FULL_SERVICE: "722511",
  /** Limited-Service Restaurants (Fast Food, Fast Casual) */
  LIMITED_SERVICE: "722513",
  /** Cafeterias, Grill Buffets, and Buffets */
  CAFETERIAS: "722514",
  /** Snack and Nonalcoholic Beverage Bars */
  SNACK_BARS: "722515",
  /** Food Service Contractors */
  CONTRACTORS: "722310",
  /** Caterers */
  CATERERS: "722320",
  /** Mobile Food Services */
  MOBILE: "722330",
  /** Drinking Places (Alcoholic Beverages) */
  BARS: "722410",
} as const;

/**
 * NAICS code prefix for all restaurant-related businesses
 */
export const RESTAURANT_NAICS_PREFIX = "722";

/**
 * Check if a NAICS code is a valid restaurant code
 */
export function isRestaurantNaicsCode(naicsCode: string | null): boolean {
  if (!naicsCode) return false;
  return naicsCode.startsWith(RESTAURANT_NAICS_PREFIX);
}

/**
 * Get all restaurant businesses for a given organization
 * Filters by NAICS code 722xxx (REQ-007, REQ-008)
 */
export async function getRestaurantBusinesses(
  organizationId?: string
): Promise<{ id: string; naicsCode: string }[]> {
  const conditions = [like(businesses.naicsCode, `${RESTAURANT_NAICS_PREFIX}%`)];

  if (organizationId) {
    conditions.push(eq(businesses.organizationId, organizationId));
  }

  const result = await db
    .select({
      id: businesses.id,
      naicsCode: businesses.naicsCode,
    })
    .from(businesses)
    .where(and(...conditions));

  return result.filter((b) => b.naicsCode !== null) as {
    id: string;
    naicsCode: string;
  }[];
}

/**
 * MetricDefinition interface for metric calculations
 */
export interface MetricDefinition {
  name: string;
  /** Calculate the metric from events */
  calculate: (events: Record<string, unknown>) => number;
  unit: string;
}

/**
 * Date range for metric calculation
 */
export interface DateRange {
  startDate: Date;
  endDate: Date;
}

/**
 * Result of metric calculations for a business
 */
export interface BusinessMetrics {
  businessId: string;
  periodStart: Date;
  periodEnd: Date;
  engagementRate: number; // %
  postFrequency: number; // posts/week
  engagementGrowth: number; // week-over-week %
  responseTime: number; // hours
  conversionRate: number; // %
  calculatedAt: Date;
}

/**
 * Calculate engagement rate: (likes + comments) / followers * 100
 * Uses engagement count from analytics as proxy for likes/comments
 *
 * Data source: analyticsEvents with eventType = 'social_engagement'
 *
 * @param events - Aggregated analytics event counts
 * @returns Engagement rate percentage
 */
function calculateEngagementRate(events: {
  socialEngagement: number;
  followers?: number;
}): number {
  // Use safe follower count (default 100 for calculation if not provided)
  const followers = events.followers || 100;
  if (followers === 0) return 0;

  // Engagement rate = (engagement events / followers) * 100
  const rate = (events.socialEngagement / followers) * 100;
  return Math.round(rate * 100) / 100;
}

/**
 * Calculate post frequency: count(social_post actions) / weeks in period
 *
 * Data source: actions table with actionType = 'social_post' and status = 'completed'
 *
 * @param events - Social post action counts and period info
 * @returns Posts per week
 */
function calculatePostFrequency(events: {
  socialPostCount: number;
  weeksInPeriod: number;
}): number {
  if (events.weeksInPeriod === 0) return 0;

  // Post frequency = total social posts / weeks in period
  const frequency = events.socialPostCount / events.weeksInPeriod;
  return Math.round(frequency * 100) / 100;
}

/**
 * Calculate engagement growth: week-over-week engagement change %
 *
 * Proxy for follower growth. Compares engagement between current and previous week.
 *
 * Data source: analyticsEvents with eventType = 'social_engagement'
 *
 * @param events - Current and previous week engagement counts
 * @returns Week-over-week % change
 */
function calculateEngagementGrowth(events: {
  currentWeekEngagement: number;
  previousWeekEngagement: number;
}): number {
  const { currentWeekEngagement, previousWeekEngagement } = events;

  // Handle edge case: no previous week data
  if (previousWeekEngagement === 0) {
    return currentWeekEngagement > 0 ? 100 : 0;
  }

  // Growth % = ((current - previous) / previous) * 100
  const growth =
    ((currentWeekEngagement - previousWeekEngagement) /
      previousWeekEngagement) *
    100;
  return Math.round(growth * 100) / 100;
}

/**
 * Calculate response time: avg(review_response.postedAt - review.reviewDate) in hours
 *
 * Data source: reviews and review_responses tables
 *
 * @param events - Response time data in hours
 * @returns Average response time in hours
 */
function calculateResponseTime(events: {
  avgResponseTimeHours: number;
  respondedCount: number;
}): number {
  if (events.respondedCount === 0) return 0;

  // Already in hours from aggregation
  return Math.round(events.avgResponseTimeHours * 100) / 100;
}

/**
 * Calculate conversion rate: attributed_conversions / total_impressions * 100
 *
 * Uses attribution events for conversions and page_view events as proxy for impressions.
 *
 * Data source: attributionEvents (conversions) and analyticsEvents (impressions)
 *
 * @param events - Conversion and impression counts
 * @returns Conversion rate percentage
 */
function calculateConversionRate(events: {
  conversions: number;
  impressions: number;
}): number {
  if (events.impressions === 0) return 0;

  // Conversion rate = (attributed conversions / impressions) * 100
  const rate = (events.conversions / events.impressions) * 100;
  return Math.round(rate * 100) / 100;
}

/**
 * Aggregate analytics events for a business over a date range
 *
 * @internal
 */
async function getAnalyticsAggregates(
  businessId: string,
  startDate: Date,
  endDate: Date
): Promise<Record<string, number>> {
  const [agg] = await db
    .select({
      pageViews: sql<number>`count(*) filter (where ${analyticsEvents.eventType} = 'page_view')`,
      socialEngagement: sql<number>`count(*) filter (where ${analyticsEvents.eventType} = 'social_engagement')`,
      bookings: sql<number>`count(*) filter (where ${analyticsEvents.eventType} = 'booking')`,
      phoneCalls: sql<number>`count(*) filter (where ${analyticsEvents.eventType} = 'phone_call')`,
    })
    .from(analyticsEvents)
    .where(
      and(
        eq(analyticsEvents.businessId, businessId),
        gte(analyticsEvents.occurredAt, startDate),
        lte(analyticsEvents.occurredAt, endDate)
      )
    );

  return {
    pageViews: Number(agg?.pageViews || 0),
    socialEngagement: Number(agg?.socialEngagement || 0),
    bookings: Number(agg?.bookings || 0),
    phoneCalls: Number(agg?.phoneCalls || 0),
  };
}

/**
 * Count completed social posts for a business over a date range
 *
 * @internal
 */
async function getSocialPostCount(
  businessId: string,
  startDate: Date,
  endDate: Date
): Promise<number> {
  const [result] = await db
    .select({
      count: sql<number>`count(*)`,
    })
    .from(actions)
    .where(
      and(
        eq(actions.businessId, businessId),
        eq(actions.actionType, "social_post"),
        eq(actions.status, "completed"),
        gte(actions.executedAt, startDate),
        lte(actions.executedAt, endDate)
      )
    );

  return Number(result?.count || 0);
}

/**
 * Get previous week's engagement count for growth calculation
 *
 * @internal
 */
async function getPreviousWeekEngagement(
  businessId: string,
  currentStartDate: Date
): Promise<number> {
  // Previous week: 14-7 days before current week
  const previousWeekEnd = new Date(currentStartDate);
  previousWeekEnd.setDate(previousWeekEnd.getDate() - 1);

  const previousWeekStart = new Date(previousWeekEnd);
  previousWeekStart.setDate(previousWeekStart.getDate() - 7);

  const [agg] = await db
    .select({
      engagement: sql<number>`count(*) filter (where ${analyticsEvents.eventType} = 'social_engagement')`,
    })
    .from(analyticsEvents)
    .where(
      and(
        eq(analyticsEvents.businessId, businessId),
        gte(analyticsEvents.occurredAt, previousWeekStart),
        lte(analyticsEvents.occurredAt, previousWeekEnd)
      )
    );

  return Number(agg?.engagement || 0);
}

/**
 * Calculate average response time for reviews
 *
 * @internal
 */
async function getAverageResponseTime(
  businessId: string,
  startDate: Date,
  endDate: Date
): Promise<{ avgHours: number; respondedCount: number }> {
  // Query reviews and their responses to calculate response time
  const [result] = await db
    .select({
      avgHours: sql<number>`
        coalesce(
          avg(extract(epoch from (${reviewResponses.postedAt} - ${reviews.reviewDate})) / 3600),
          0
        )
      `,
      count: sql<number>`count(${reviewResponses.id})`,
    })
    .from(reviews)
    .innerJoin(
      reviewResponses,
      and(
        eq(reviews.id, reviewResponses.reviewId),
        eq(reviews.businessId, businessId),
        gte(reviews.reviewDate, startDate),
        lte(reviews.reviewDate, endDate)
      )
    )
    .where(
      and(
        eq(reviews.businessId, businessId),
        gte(reviews.reviewDate, startDate),
        lte(reviews.reviewDate, endDate)
      )
    );

  return {
    avgHours: Number(result?.avgHours || 0),
    respondedCount: Number(result?.count || 0),
  };
}

/**
 * Get attribution conversion count (proxy for conversions)
 *
 * @internal
 */
async function getAttributedConversions(
  businessId: string,
  startDate: Date,
  endDate: Date
): Promise<number> {
  // Count attribution events with booking or conversion-like event types
  const [result] = await db
    .select({
      count: sql<number>`count(*)`,
    })
    .from(attributionEvents)
    .where(
      and(
        eq(attributionEvents.businessId, businessId),
        gte(attributionEvents.occurredAt, startDate),
        lte(attributionEvents.occurredAt, endDate)
      )
    );

  return Number(result?.count || 0);
}

/**
 * Main function to compute all metrics for a business
 *
 * Aggregates analytics events, actions, and attribution data over a date range
 * and computes the 5 core Pulse metrics.
 *
 * @param businessId - The business to compute metrics for
 * @param dateRange - The period to compute metrics over
 * @returns Calculated metrics
 *
 * @example
 * ```ts
 * const metrics = await getMetricsForBusiness('biz-123', {
 *   startDate: new Date('2024-01-01'),
 *   endDate: new Date('2024-01-08')
 * });
 *
 * console.log(`Engagement rate: ${metrics.engagementRate}%`);
 * console.log(`Post frequency: ${metrics.postFrequency} posts/week`);
 * ```
 */
export async function getMetricsForBusiness(
  businessId: string,
  dateRange: DateRange
): Promise<BusinessMetrics> {
  const { startDate, endDate } = dateRange;

  // Calculate weeks in period
  const weeksInPeriod = Math.max(
    1,
    Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (7 * 24 * 60 * 60 * 1000)
    )
  );

  // Fetch all aggregated data in parallel
  const [
    analyticsAgg,
    socialPostCount,
    previousEngagement,
    responseTimeData,
    attributedConversions,
  ] = await Promise.all([
    getAnalyticsAggregates(businessId, startDate, endDate),
    getSocialPostCount(businessId, startDate, endDate),
    getPreviousWeekEngagement(businessId, startDate),
    getAverageResponseTime(businessId, startDate, endDate),
    getAttributedConversions(businessId, startDate, endDate),
  ]);

  // Calculate individual metrics using the helper functions
  const engagementRate = calculateEngagementRate({
    socialEngagement: analyticsAgg.socialEngagement,
    followers: 100, // Default proxy value
  });

  const postFrequency = calculatePostFrequency({
    socialPostCount,
    weeksInPeriod,
  });

  const currentWeekEngagement = analyticsAgg.socialEngagement;
  const engagementGrowth = calculateEngagementGrowth({
    currentWeekEngagement,
    previousWeekEngagement: previousEngagement,
  });

  const responseTime = calculateResponseTime({
    avgResponseTimeHours: responseTimeData.avgHours,
    respondedCount: responseTimeData.respondedCount,
  });

  const conversionRate = calculateConversionRate({
    conversions: attributedConversions,
    impressions: analyticsAgg.pageViews,
  });

  return {
    businessId,
    periodStart: startDate,
    periodEnd: endDate,
    engagementRate,
    postFrequency,
    engagementGrowth,
    responseTime,
    conversionRate,
    calculatedAt: new Date(),
  };
}
