import { NextRequest, NextResponse } from "next/server";

// TODO: Full spec in engineering/api-design.md Section 3.3
// GET /conversations/current → active conversation for authenticated business
// Returns most recent 50 messages, cursor-based pagination for older

export async function GET(request: NextRequest) {
  // TODO: Extract business_id from JWT (via auth middleware)
  // TODO: Query conversation + recent messages, ordered by created_at desc
  // TODO: Cursor-based pagination: ?before={message_id}

  const searchParams = request.nextUrl.searchParams;
  const _before = searchParams.get("before");

  return NextResponse.json({
    data: {
      conversation: {
        id: "placeholder",
        businessId: "placeholder",
        messages: [],
      },
      pagination: {
        hasMore: false,
        nextCursor: null,
      },
    },
    meta: { timestamp: new Date().toISOString() },
  });
}
