import { NextRequest, NextResponse } from "next/server";

// TODO: Full spec in engineering/api-design.md Section 3.8
// GET /digests — list past Weekly Digests (most recent first)
// GET /digests/latest — most recent digest
// GET /digests/:id/shareable — public-shareable URL (no sensitive data)
//
// Digest generation runs as a cron job (Monday 5AM per timezone)
// Uses Claude Haiku 4.5 for batch generation (tech-stack.md)
// Structure: "Here's what happened" → "Here's what I did" → "Here's what I recommend"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const _limit = searchParams.get("limit") || "10";

  // TODO: Query weekly_digests table, ordered by period_start desc
  // TODO: Include metrics summary, actions completed, recommendations
  // TODO: Optionally include shareable URL

  return NextResponse.json({
    data: {
      digests: [],
      pagination: {
        hasMore: false,
        nextCursor: null,
      },
    },
    meta: { timestamp: new Date().toISOString() },
  });
}
