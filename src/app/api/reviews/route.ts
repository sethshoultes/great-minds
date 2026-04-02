import { NextRequest, NextResponse } from "next/server";

// TODO: Full spec in engineering/api-design.md Section 3.6
// GET /reviews — list reviews for authenticated business
// Filterable by: platform (google, yelp, facebook), responded (bool), rating, date range
// Reviews synced from Google/Yelp/Facebook via background jobs (4x/day)

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const _platform = searchParams.get("platform");
  const _responded = searchParams.get("responded");
  const _minRating = searchParams.get("minRating");

  // TODO: Query reviews table with filters, scoped by business_id from JWT
  // TODO: Include response status (responded vs pending)
  // TODO: Include AI-extracted sentiment and key_topics

  return NextResponse.json({
    data: {
      reviews: [],
      summary: {
        total: 0,
        averageRating: 0,
        pendingResponses: 0,
        sentimentBreakdown: {
          positive: 0,
          neutral: 0,
          negative: 0,
        },
      },
    },
    meta: { timestamp: new Date().toISOString() },
  });
}
