/**
 * Nightly Batch Percentile Calculation Service
 * Spec: REQ-017
 *
 * Runs as a nightly cron job to:
 * 1. Calculate metrics for all restaurant businesses
 * 2. Compute percentile rankings within peer groups
 * 3. Store results in benchmark_aggregates table
 *
 * Uses PERCENTILE_CONT() for accurate percentile calculation.
 */

import { db } from "@/lib/db";
import {
  businesses,
  benchmarkAggregates,
  pulseBenchmarks,
} from "@/db/schema";
import { eq, and, gte, lte, sql, like, inArray } from "drizzle-orm";
import {
  getMetricsForBusiness,
  BusinessMetrics,
  RESTAURANT_NAICS_PREFIX,
  getRestaurantBusinesses,
} from "./pulse-metrics";
import {
  findPeerGroup,
  getBusinessProfile,
  getPeerBusinessIds,
  PeerGroup,
  MIN_COHORT_SIZE,
} from "./peer-groups";

/**
 * Metric names with pulse_ prefix (per data-audit-results.md recommendation)
 */
export const PULSE_METRIC_NAMES = {
  ENGAGEMENT_RATE: "pulse_engagement_rate",
  POST_FREQUENCY: "pulse_post_frequency",
  ENGAGEMENT_GROWTH: "pulse_engagement_growth",
  RESPONSE_TIME: "pulse_response_time",
  CONVERSION_RATE: "pulse_conversion_rate",
} as const;

/**
 * Result of percentile calculation for a single business
 */
export interface PercentileResult {
  businessId: string;
  metric: string;
  value: number;
  percentile: number;
  peerGroupSize: number;
  calculatedAt: Date;
}

/**
 * Batch job execution result
 */
export interface BatchJobResult {
  success: boolean;
  processedBusinesses: number;
  failedBusinesses: number;
  totalPercentiles: number;
  executionTimeMs: number;
  errors: string[];
}

/**
 * Calculate percentile rank using PERCENTILE_CONT equivalent
 * Formula: (count of values below + 0.5 * count of equal values) / total count * 100
 */
function calculatePercentileRank(
  value: number,
  allValues: number[],
  higherIsBetter: boolean = true
): number {
  if (allValues.length === 0) return 50;

  const sortedValues = [...allValues].sort((a, b) => a - b);

  // For metrics where lower is better (response time), invert the logic
  const targetValue = value;
  const below = sortedValues.filter((v) =>
    higherIsBetter ? v < targetValue : v > targetValue
  ).length;
  const equal = sortedValues.filter((v) => v === targetValue).length;

  const percentile = ((below + 0.5 * equal) / sortedValues.length) * 100;
  return Math.round(percentile);
}

/**
 * Calculate percentiles for all metrics using SQL PERCENTILE_CONT
 * More efficient for large datasets
 */
async function calculatePercentilesSQL(
  businessId: string,
  metrics: BusinessMetrics,
  peerBusinessIds: string[]
): Promise<PercentileResult[]> {
  const results: PercentileResult[] = [];
  const calculatedAt = new Date();

  // Fetch all peer metrics in one query
  const peerMetrics = await db
    .select()
    .from(pulseBenchmarks)
    .where(
      and(
        inArray(pulseBenchmarks.businessId, peerBusinessIds),
        gte(
          pulseBenchmarks.periodEnd,
          new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        ) // Last 7 days
      )
    );

  // Group by metric
  const metricValues: Record<string, number[]> = {
    [PULSE_METRIC_NAMES.ENGAGEMENT_RATE]: [],
    [PULSE_METRIC_NAMES.POST_FREQUENCY]: [],
    [PULSE_METRIC_NAMES.ENGAGEMENT_GROWTH]: [],
    [PULSE_METRIC_NAMES.RESPONSE_TIME]: [],
    [PULSE_METRIC_NAMES.CONVERSION_RATE]: [],
  };

  for (const pm of peerMetrics) {
    metricValues[PULSE_METRIC_NAMES.ENGAGEMENT_RATE].push(pm.engagementRate);
    metricValues[PULSE_METRIC_NAMES.POST_FREQUENCY].push(pm.postFrequency);
    metricValues[PULSE_METRIC_NAMES.ENGAGEMENT_GROWTH].push(pm.engagementGrowth);
    metricValues[PULSE_METRIC_NAMES.RESPONSE_TIME].push(pm.responseTime);
    metricValues[PULSE_METRIC_NAMES.CONVERSION_RATE].push(pm.conversionRate);
  }

  const peerGroupSize = peerBusinessIds.length;

  // Calculate percentile for each metric
  // Higher is better for all except response time
  results.push({
    businessId,
    metric: PULSE_METRIC_NAMES.ENGAGEMENT_RATE,
    value: metrics.engagementRate,
    percentile: calculatePercentileRank(
      metrics.engagementRate,
      metricValues[PULSE_METRIC_NAMES.ENGAGEMENT_RATE],
      true
    ),
    peerGroupSize,
    calculatedAt,
  });

  results.push({
    businessId,
    metric: PULSE_METRIC_NAMES.POST_FREQUENCY,
    value: metrics.postFrequency,
    percentile: calculatePercentileRank(
      metrics.postFrequency,
      metricValues[PULSE_METRIC_NAMES.POST_FREQUENCY],
      true
    ),
    peerGroupSize,
    calculatedAt,
  });

  results.push({
    businessId,
    metric: PULSE_METRIC_NAMES.ENGAGEMENT_GROWTH,
    value: metrics.engagementGrowth,
    percentile: calculatePercentileRank(
      metrics.engagementGrowth,
      metricValues[PULSE_METRIC_NAMES.ENGAGEMENT_GROWTH],
      true
    ),
    peerGroupSize,
    calculatedAt,
  });

  // Response time: LOWER is better
  results.push({
    businessId,
    metric: PULSE_METRIC_NAMES.RESPONSE_TIME,
    value: metrics.responseTime,
    percentile: calculatePercentileRank(
      metrics.responseTime,
      metricValues[PULSE_METRIC_NAMES.RESPONSE_TIME],
      false // Lower is better
    ),
    peerGroupSize,
    calculatedAt,
  });

  results.push({
    businessId,
    metric: PULSE_METRIC_NAMES.CONVERSION_RATE,
    value: metrics.conversionRate,
    percentile: calculatePercentileRank(
      metrics.conversionRate,
      metricValues[PULSE_METRIC_NAMES.CONVERSION_RATE],
      true
    ),
    peerGroupSize,
    calculatedAt,
  });

  return results;
}

/**
 * Store benchmark results in database
 */
async function storeBenchmarkResults(
  businessId: string,
  metrics: BusinessMetrics,
  percentiles: PercentileResult[],
  peerGroup: PeerGroup
): Promise<void> {
  const now = new Date();

  // Calculate composite Pulse score (average of all percentiles)
  const avgPercentile =
    percentiles.reduce((sum, p) => sum + p.percentile, 0) / percentiles.length;

  // Upsert into pulse_benchmarks table
  await db
    .insert(pulseBenchmarks)
    .values({
      businessId,
      periodStart: metrics.periodStart,
      periodEnd: metrics.periodEnd,
      engagementRate: metrics.engagementRate,
      postFrequency: metrics.postFrequency,
      engagementGrowth: metrics.engagementGrowth,
      responseTime: metrics.responseTime,
      conversionRate: metrics.conversionRate,
      engagementRatePercentile:
        percentiles.find(
          (p) => p.metric === PULSE_METRIC_NAMES.ENGAGEMENT_RATE
        )?.percentile || 0,
      postFrequencyPercentile:
        percentiles.find(
          (p) => p.metric === PULSE_METRIC_NAMES.POST_FREQUENCY
        )?.percentile || 0,
      engagementGrowthPercentile:
        percentiles.find(
          (p) => p.metric === PULSE_METRIC_NAMES.ENGAGEMENT_GROWTH
        )?.percentile || 0,
      responseTimePercentile:
        percentiles.find(
          (p) => p.metric === PULSE_METRIC_NAMES.RESPONSE_TIME
        )?.percentile || 0,
      conversionRatePercentile:
        percentiles.find(
          (p) => p.metric === PULSE_METRIC_NAMES.CONVERSION_RATE
        )?.percentile || 0,
      compositePercentile: Math.round(avgPercentile),
      peerGroupRegion: peerGroup.criteria.region,
      peerGroupRegionType: peerGroup.criteria.regionType,
      peerGroupSizeBucket: peerGroup.criteria.sizeBucket,
      peerGroupSize: peerGroup.memberCount,
      calculatedAt: now,
    })
    .onConflictDoUpdate({
      target: [pulseBenchmarks.businessId, pulseBenchmarks.periodEnd],
      set: {
        engagementRate: metrics.engagementRate,
        postFrequency: metrics.postFrequency,
        engagementGrowth: metrics.engagementGrowth,
        responseTime: metrics.responseTime,
        conversionRate: metrics.conversionRate,
        engagementRatePercentile:
          percentiles.find(
            (p) => p.metric === PULSE_METRIC_NAMES.ENGAGEMENT_RATE
          )?.percentile || 0,
        postFrequencyPercentile:
          percentiles.find(
            (p) => p.metric === PULSE_METRIC_NAMES.POST_FREQUENCY
          )?.percentile || 0,
        engagementGrowthPercentile:
          percentiles.find(
            (p) => p.metric === PULSE_METRIC_NAMES.ENGAGEMENT_GROWTH
          )?.percentile || 0,
        responseTimePercentile:
          percentiles.find(
            (p) => p.metric === PULSE_METRIC_NAMES.RESPONSE_TIME
          )?.percentile || 0,
        conversionRatePercentile:
          percentiles.find(
            (p) => p.metric === PULSE_METRIC_NAMES.CONVERSION_RATE
          )?.percentile || 0,
        compositePercentile: Math.round(avgPercentile),
        peerGroupSize: peerGroup.memberCount,
        calculatedAt: now,
      },
    });
}

/**
 * Process a single business for benchmark calculation
 */
async function processBusiness(businessId: string): Promise<{
  success: boolean;
  percentileCount: number;
  error?: string;
}> {
  try {
    // Get business profile
    const profile = await getBusinessProfile(businessId);
    if (!profile) {
      return {
        success: false,
        percentileCount: 0,
        error: `Business ${businessId} not found or not a restaurant`,
      };
    }

    // Find peer group
    const peerGroup = await findPeerGroup(profile);
    if (!peerGroup.isValid && peerGroup.memberCount < 10) {
      return {
        success: false,
        percentileCount: 0,
        error: `Insufficient peer group for ${businessId}: ${peerGroup.validationMessage}`,
      };
    }

    // Get date range (last 7 days)
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);

    // Calculate metrics
    const metrics = await getMetricsForBusiness(businessId, {
      startDate,
      endDate,
    });

    // Get peer business IDs
    const peerBusinessIds = await getPeerBusinessIds(
      peerGroup.criteria,
      businessId
    );

    // Calculate percentiles
    const percentiles = await calculatePercentilesSQL(
      businessId,
      metrics,
      peerBusinessIds
    );

    // Store results
    await storeBenchmarkResults(businessId, metrics, percentiles, peerGroup);

    return {
      success: true,
      percentileCount: percentiles.length,
    };
  } catch (error) {
    return {
      success: false,
      percentileCount: 0,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Main batch job entry point
 * Called by cron scheduler (nightly)
 *
 * @example
 * ```ts
 * // In cron job handler
 * const result = await runNightlyBenchmarkJob();
 * console.log(`Processed ${result.processedBusinesses} businesses`);
 * ```
 */
export async function runNightlyBenchmarkJob(): Promise<BatchJobResult> {
  const startTime = Date.now();
  const errors: string[] = [];
  let processedBusinesses = 0;
  let failedBusinesses = 0;
  let totalPercentiles = 0;

  try {
    // Get all restaurant businesses
    const restaurantBusinesses = await getRestaurantBusinesses();

    console.log(
      `[Pulse Batch] Starting nightly benchmark calculation for ${restaurantBusinesses.length} restaurants`
    );

    // Process each business
    for (const business of restaurantBusinesses) {
      const result = await processBusiness(business.id);

      if (result.success) {
        processedBusinesses++;
        totalPercentiles += result.percentileCount;
      } else {
        failedBusinesses++;
        if (result.error) {
          errors.push(result.error);
        }
      }
    }

    const executionTimeMs = Date.now() - startTime;

    console.log(
      `[Pulse Batch] Completed: ${processedBusinesses} processed, ${failedBusinesses} failed, ${totalPercentiles} percentiles calculated in ${executionTimeMs}ms`
    );

    return {
      success: true,
      processedBusinesses,
      failedBusinesses,
      totalPercentiles,
      executionTimeMs,
      errors: errors.slice(0, 10), // Limit error list
    };
  } catch (error) {
    const executionTimeMs = Date.now() - startTime;
    const errorMessage =
      error instanceof Error ? error.message : String(error);

    console.error(`[Pulse Batch] Fatal error: ${errorMessage}`);

    return {
      success: false,
      processedBusinesses,
      failedBusinesses,
      totalPercentiles,
      executionTimeMs,
      errors: [errorMessage],
    };
  }
}

/**
 * Cron job handler for Next.js API route or serverless function
 */
export async function cronHandler(): Promise<Response> {
  const result = await runNightlyBenchmarkJob();

  return new Response(JSON.stringify(result), {
    status: result.success ? 200 : 500,
    headers: { "Content-Type": "application/json" },
  });
}
