/**
 * Pulse Benchmarks API Endpoint
 * Spec: REQ-018
 *
 * GET /api/pulse/benchmarks/:customerId
 *
 * Returns benchmark data and percentile rankings for a customer's business.
 * Includes peer group information and metric breakdowns.
 */

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { pulseBenchmarks, pulsePublicReports, businesses } from "@/db/schema";
import { eq, and, desc, gte } from "drizzle-orm";
import {
  getBusinessProfile,
  findPeerGroup,
  formatPeerGroupCriteria,
  validatePeerGroup,
  MIN_COHORT_SIZE,
} from "@/services/peer-groups";
import { getMetricsForBusiness } from "@/services/pulse-metrics";

/**
 * API Response Types
 */
interface BenchmarkMetric {
  name: string;
  displayName: string;
  value: number;
  unit: string;
  percentile: number;
  interpretation: string;
}

interface PeerGroupInfo {
  description: string;
  memberCount: number;
  regionType: "msa" | "state";
  region: string;
  sizeBucket: string;
  isOptimal: boolean;
  warnings: string[];
}

interface BenchmarkResponse {
  businessId: string;
  businessName: string;
  pulseScore: number;
  calculatedAt: string;
  periodStart: string;
  periodEnd: string;
  metrics: BenchmarkMetric[];
  peerGroup: PeerGroupInfo;
  insufficientData: boolean;
  insufficientDataMessage?: string;
}

interface ErrorResponse {
  error: string;
  code: string;
  details?: string;
}

/**
 * Interpret percentile for user-friendly messaging
 */
function interpretPercentile(
  percentile: number,
  metricName: string
): string {
  if (percentile >= 90) return `Top 10% of restaurants for ${metricName}`;
  if (percentile >= 75) return `Above average for ${metricName}`;
  if (percentile >= 50) return `Average for ${metricName}`;
  if (percentile >= 25) return `Below average for ${metricName}`;
  return `Needs improvement in ${metricName}`;
}

/**
 * Format metric name for display
 */
function formatMetricName(metric: string): string {
  const names: Record<string, string> = {
    engagementRate: "Engagement Rate",
    postFrequency: "Posting Frequency",
    engagementGrowth: "Engagement Growth",
    responseTime: "Response Time",
    conversionRate: "Conversion Rate",
  };
  return names[metric] || metric;
}

/**
 * Format metric unit
 */
function formatMetricUnit(metric: string): string {
  const units: Record<string, string> = {
    engagementRate: "%",
    postFrequency: "posts/week",
    engagementGrowth: "% week-over-week",
    responseTime: "hours",
    conversionRate: "%",
  };
  return units[metric] || "";
}

/**
 * GET /api/pulse/benchmarks/:customerId
 *
 * Retrieves benchmark data for a customer.
 *
 * @param customerId - The business/customer ID
 *
 * @returns BenchmarkResponse on success
 * @returns ErrorResponse on error (401, 403, 404, 500)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { customerId: string } }
): Promise<NextResponse<BenchmarkResponse | ErrorResponse>> {
  try {
    const { customerId } = params;

    // Validate customerId format (UUID)
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(customerId)) {
      return NextResponse.json(
        {
          error: "Invalid customer ID format",
          code: "INVALID_ID",
        },
        { status: 400 }
      );
    }

    // Get business information
    const [business] = await db
      .select({
        id: businesses.id,
        name: businesses.name,
        naicsCode: businesses.naicsCode,
      })
      .from(businesses)
      .where(eq(businesses.id, customerId))
      .limit(1);

    if (!business) {
      return NextResponse.json(
        {
          error: "Business not found",
          code: "NOT_FOUND",
        },
        { status: 404 }
      );
    }

    // Check if business is a restaurant (NAICS 722xxx)
    if (!business.naicsCode?.startsWith("722")) {
      return NextResponse.json(
        {
          error: "Pulse benchmarks are currently only available for restaurants",
          code: "UNSUPPORTED_INDUSTRY",
          details: "Only businesses with NAICS code 722xxx are supported",
        },
        { status: 400 }
      );
    }

    // Get latest benchmark from database
    const [benchmark] = await db
      .select()
      .from(pulseBenchmarks)
      .where(eq(pulseBenchmarks.businessId, customerId))
      .orderBy(desc(pulseBenchmarks.calculatedAt))
      .limit(1);

    // If no pre-calculated benchmark, calculate on-demand
    if (!benchmark) {
      // Get business profile for peer group
      const profile = await getBusinessProfile(customerId);

      if (!profile) {
        return NextResponse.json(
          {
            error: "Unable to determine business profile for benchmarking",
            code: "PROFILE_ERROR",
          },
          { status: 400 }
        );
      }

      // Find peer group
      const peerGroup = await findPeerGroup(profile);
      const validation = validatePeerGroup(peerGroup);

      // Check for insufficient data (REQ-036)
      if (!peerGroup.isValid && peerGroup.memberCount < 10) {
        return NextResponse.json(
          {
            businessId: customerId,
            businessName: business.name || "Unknown",
            pulseScore: 0,
            calculatedAt: new Date().toISOString(),
            periodStart: new Date(
              Date.now() - 7 * 24 * 60 * 60 * 1000
            ).toISOString(),
            periodEnd: new Date().toISOString(),
            metrics: [],
            peerGroup: {
              description: formatPeerGroupCriteria(peerGroup.criteria),
              memberCount: peerGroup.memberCount,
              regionType: peerGroup.criteria.regionType,
              region: peerGroup.criteria.region,
              sizeBucket: peerGroup.criteria.sizeBucket,
              isOptimal: false,
              warnings: validation.warnings,
            },
            insufficientData: true,
            insufficientDataMessage:
              "We don't have enough data from similar restaurants in your area yet. Check back soon!",
          },
          { status: 200 }
        );
      }

      // Calculate metrics on-demand
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 7);

      const metrics = await getMetricsForBusiness(customerId, {
        startDate,
        endDate,
      });

      // Return on-demand calculated response (without percentiles - those require batch)
      return NextResponse.json({
        businessId: customerId,
        businessName: business.name || "Unknown",
        pulseScore: 50, // Default until batch runs
        calculatedAt: new Date().toISOString(),
        periodStart: startDate.toISOString(),
        periodEnd: endDate.toISOString(),
        metrics: [
          {
            name: "engagementRate",
            displayName: "Engagement Rate",
            value: metrics.engagementRate,
            unit: "%",
            percentile: 50,
            interpretation: "Benchmarks calculating... check back tomorrow",
          },
          {
            name: "postFrequency",
            displayName: "Posting Frequency",
            value: metrics.postFrequency,
            unit: "posts/week",
            percentile: 50,
            interpretation: "Benchmarks calculating... check back tomorrow",
          },
          {
            name: "engagementGrowth",
            displayName: "Engagement Growth",
            value: metrics.engagementGrowth,
            unit: "% week-over-week",
            percentile: 50,
            interpretation: "Benchmarks calculating... check back tomorrow",
          },
          {
            name: "responseTime",
            displayName: "Response Time",
            value: metrics.responseTime,
            unit: "hours",
            percentile: 50,
            interpretation: "Benchmarks calculating... check back tomorrow",
          },
          {
            name: "conversionRate",
            displayName: "Conversion Rate",
            value: metrics.conversionRate,
            unit: "%",
            percentile: 50,
            interpretation: "Benchmarks calculating... check back tomorrow",
          },
        ],
        peerGroup: {
          description: formatPeerGroupCriteria(peerGroup.criteria),
          memberCount: peerGroup.memberCount,
          regionType: peerGroup.criteria.regionType,
          region: peerGroup.criteria.region,
          sizeBucket: peerGroup.criteria.sizeBucket,
          isOptimal: peerGroup.memberCount >= MIN_COHORT_SIZE,
          warnings: validation.warnings,
        },
        insufficientData: false,
      });
    }

    // Return pre-calculated benchmark data
    const metrics: BenchmarkMetric[] = [
      {
        name: "engagementRate",
        displayName: "Engagement Rate",
        value: Number(benchmark.engagementRate),
        unit: "%",
        percentile: benchmark.engagementRatePercentile,
        interpretation: interpretPercentile(
          benchmark.engagementRatePercentile,
          "engagement"
        ),
      },
      {
        name: "postFrequency",
        displayName: "Posting Frequency",
        value: Number(benchmark.postFrequency),
        unit: "posts/week",
        percentile: benchmark.postFrequencyPercentile,
        interpretation: interpretPercentile(
          benchmark.postFrequencyPercentile,
          "posting frequency"
        ),
      },
      {
        name: "engagementGrowth",
        displayName: "Engagement Growth",
        value: Number(benchmark.engagementGrowth),
        unit: "% week-over-week",
        percentile: benchmark.engagementGrowthPercentile,
        interpretation: interpretPercentile(
          benchmark.engagementGrowthPercentile,
          "growth"
        ),
      },
      {
        name: "responseTime",
        displayName: "Response Time",
        value: Number(benchmark.responseTime),
        unit: "hours",
        percentile: benchmark.responseTimePercentile,
        interpretation: interpretPercentile(
          benchmark.responseTimePercentile,
          "response time"
        ),
      },
      {
        name: "conversionRate",
        displayName: "Conversion Rate",
        value: Number(benchmark.conversionRate),
        unit: "%",
        percentile: benchmark.conversionRatePercentile,
        interpretation: interpretPercentile(
          benchmark.conversionRatePercentile,
          "conversions"
        ),
      },
    ];

    const response: BenchmarkResponse = {
      businessId: customerId,
      businessName: business.name || "Unknown",
      pulseScore: benchmark.compositePercentile,
      calculatedAt: benchmark.calculatedAt.toISOString(),
      periodStart: benchmark.periodStart.toISOString(),
      periodEnd: benchmark.periodEnd.toISOString(),
      metrics,
      peerGroup: {
        description: `Restaurants in ${
          benchmark.peerGroupRegionType === "msa"
            ? `${benchmark.peerGroupRegion} Metro Area`
            : `${benchmark.peerGroupRegion} (Statewide)`
        }`,
        memberCount: benchmark.peerGroupSize,
        regionType: benchmark.peerGroupRegionType as "msa" | "state",
        region: benchmark.peerGroupRegion,
        sizeBucket: benchmark.peerGroupSizeBucket,
        isOptimal: benchmark.peerGroupSize >= MIN_COHORT_SIZE,
        warnings:
          benchmark.peerGroupSize < MIN_COHORT_SIZE
            ? [
                `Peer group has ${benchmark.peerGroupSize} restaurants (optimal: ${MIN_COHORT_SIZE}+)`,
              ]
            : [],
      },
      insufficientData: false,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("[Pulse API] Error fetching benchmarks:", error);

    return NextResponse.json(
      {
        error: "Internal server error",
        code: "INTERNAL_ERROR",
        details:
          process.env.NODE_ENV === "development"
            ? String(error)
            : undefined,
      },
      { status: 500 }
    );
  }
}
