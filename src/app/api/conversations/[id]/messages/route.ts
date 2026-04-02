import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// TODO: Full spec in engineering/api-design.md Section 3.3
// POST: Send owner message → triggers AI response generation (async)
// GET:  Get messages for conversation (paginated)
//
// AI Response Flow (critical path):
// 1. Client sends POST with owner message
// 2. Server returns 201 with owner message + placeholder assistant message (status: "generating")
// 3. Server enqueues AI generation job (BullMQ)
// 4. Client connects to SSE stream OR polls for completion
// 5. When done, assistant message updated with content + proposed actions

const sendMessageSchema = z.object({
  content: z.string().min(1).max(10000),
  contentType: z.enum(["text", "voice_transcript"]).default("text"),
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: conversationId } = await params;
    const body = await request.json();
    const validated = sendMessageSchema.parse(body);

    // TODO: Verify conversation belongs to authenticated business (RLS handles this)
    // TODO: Create owner message in messages table
    // TODO: Create placeholder assistant message (status: generating)
    // TODO: Enqueue AI generation job with conversation context
    // TODO: Return both messages — client renders owner message immediately,
    //       polls/streams for assistant response

    return NextResponse.json(
      {
        data: {
          ownerMessage: {
            id: "placeholder",
            conversationId,
            role: "owner",
            contentType: validated.contentType,
            content: { text: validated.content },
            createdAt: new Date().toISOString(),
          },
          assistantMessage: {
            id: "placeholder-assistant",
            conversationId,
            role: "assistant",
            contentType: "text",
            content: { status: "generating" },
            createdAt: new Date().toISOString(),
          },
        },
        meta: { timestamp: new Date().toISOString() },
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: {
            code: "VALIDATION_ERROR",
            message: "Invalid message",
            details: error.errors,
          },
        },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "Failed to send message" } },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: _conversationId } = await params;
  const searchParams = request.nextUrl.searchParams;
  const _before = searchParams.get("before");
  const _limit = searchParams.get("limit") || "50";

  // TODO: Query messages for conversation, cursor-based pagination
  // TODO: RLS ensures only messages for authenticated org are returned

  return NextResponse.json({
    data: {
      messages: [],
      pagination: {
        hasMore: false,
        nextCursor: null,
      },
    },
    meta: { timestamp: new Date().toISOString() },
  });
}
