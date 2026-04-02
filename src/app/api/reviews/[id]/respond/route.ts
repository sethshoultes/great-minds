import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// TODO: Full spec in engineering/api-design.md Section 3.6
// POST /reviews/:id/respond — approve AI draft or provide custom response
// Posts to platform (Google, Facebook) or provides deep link (Yelp — no API for responses)

const respondSchema = z.object({
  responseText: z.string().min(1).max(2000),
  useAiDraft: z.boolean().default(true),
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: reviewId } = await params;
    const body = await request.json();
    const validated = respondSchema.parse(body);

    // TODO: Load review from reviews table (verify business ownership via RLS)
    // TODO: Create review_response record
    // TODO: Create action (type: review_response, status: approved)
    // TODO: Enqueue posting job — Google: updateReply API, Facebook: comments API
    // TODO: Yelp: no API — return deep link for manual posting
    // TODO: Create attribution_event (direct confidence)

    return NextResponse.json({
      data: {
        response: {
          id: "placeholder",
          reviewId,
          responseText: validated.responseText,
          postedToPlatform: false,
          status: "posting",
        },
      },
      meta: { timestamp: new Date().toISOString() },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: {
            code: "VALIDATION_ERROR",
            message: "Invalid response data",
            details: error.errors,
          },
        },
        { status: 400 }
      );
    }
    return NextResponse.json(
      {
        error: { code: "INTERNAL_ERROR", message: "Failed to post response" },
      },
      { status: 500 }
    );
  }
}
