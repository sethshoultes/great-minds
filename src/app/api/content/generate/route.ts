import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// TODO: Full spec in engineering/api-design.md Section 3.5
// Content generation endpoints — typically called internally by conversation AI,
// but exposed for direct client requests (e.g., onboarding reveal).
//
// Supports: social_post, review_response, email_campaign, website_content
// Uses Claude Sonnet 4.6 for interactive generation (tech-stack.md)

const generateSchema = z.object({
  type: z.enum([
    "social_post",
    "review_response",
    "email_campaign",
    "website_content",
  ]),
  context: z.record(z.unknown()),
  platform: z
    .enum(["instagram", "facebook", "google", "email", "sms"])
    .optional(),
  reviewId: z.string().uuid().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = generateSchema.parse(body);

    // TODO: Load business context (profile, voice, recent content, performance data)
    // TODO: Build prompt with business context + content type + platform rules
    // TODO: Call Anthropic Claude Sonnet 4.6 via @anthropic-ai/sdk
    // TODO: Store result in content_items table
    // TODO: Track tokens used for AI cost monitoring (market-fit.md: under 15%)
    // TODO: Create associated action (status: proposed) for approval flow

    return NextResponse.json(
      {
        data: {
          contentItem: {
            id: "placeholder",
            type: validated.type,
            content: {
              text: "AI-generated content placeholder",
              platform: validated.platform,
            },
            version: 1,
            approved: false,
            aiModel: "claude-sonnet-4-6",
          },
          action: {
            id: "placeholder",
            status: "proposed",
            type: validated.type,
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
            message: "Invalid generation request",
            details: error.errors,
          },
        },
        { status: 400 }
      );
    }
    return NextResponse.json(
      {
        error: {
          code: "GENERATION_FAILED",
          message: "Content generation failed",
        },
      },
      { status: 500 }
    );
  }
}
