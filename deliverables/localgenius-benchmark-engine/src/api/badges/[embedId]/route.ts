/**
 * Badge Data API Endpoint
 * Spec: REQ-026
 *
 * GET /api/badges/:embedId
 *
 * Returns badge data for embedding on external sites.
 * Used by badge-embed.js script.
 */

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { pulseBenchmarks, pulseBadgeConfigs, businesses } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

/**
 * Badge response data
 */
interface BadgeData {
  businessId: string;
  businessName: string;
  percentile: number;
  calculatedAt: string;
  reportUrl: string;
  insufficientData: boolean;
}

/**
 * GET /api/badges/:embedId
 *
 * Returns badge data for embed script.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { embedId: string } }
): Promise<NextResponse<BadgeData | { error: string }>> {
  try {
    const { embedId } = params;

    // Try to find badge config by embed code
    let businessId = embedId;

    const [badgeConfig] = await db
      .select()
      .from(pulseBadgeConfigs)
      .where(eq(pulseBadgeConfigs.embedCode, embedId))
      .limit(1);

    if (badgeConfig) {
      businessId = badgeConfig.businessId;

      // Update embed count
      await db
        .update(pulseBadgeConfigs)
        .set({
          embedCount: badgeConfig.embedCount + 1,
          lastEmbeddedAt: new Date(),
        })
        .where(eq(pulseBadgeConfigs.id, badgeConfig.id));
    }

    // Get business info
    const [business] = await db
      .select({ id: businesses.id, name: businesses.name })
      .from(businesses)
      .where(eq(businesses.id, businessId))
      .limit(1);

    if (!business) {
      return NextResponse.json(
        { error: "Badge not found" },
        { status: 404 }
      );
    }

    // Get latest benchmark
    const [benchmark] = await db
      .select()
      .from(pulseBenchmarks)
      .where(eq(pulseBenchmarks.businessId, businessId))
      .orderBy(desc(pulseBenchmarks.calculatedAt))
      .limit(1);

    if (!benchmark) {
      return NextResponse.json({
        businessId,
        businessName: business.name || "Restaurant",
        percentile: 0,
        calculatedAt: new Date().toISOString(),
        reportUrl: `https://pulse.localgenius.com/reports/${businessId}`,
        insufficientData: true,
      });
    }

    return NextResponse.json({
      businessId,
      businessName: business.name || "Restaurant",
      percentile: benchmark.compositePercentile,
      calculatedAt: benchmark.calculatedAt.toISOString(),
      reportUrl: `https://pulse.localgenius.com/reports/${businessId}`,
      insufficientData: false,
    });
  } catch (error) {
    console.error("[Badge API] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
