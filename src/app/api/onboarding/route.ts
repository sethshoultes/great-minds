import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// TODO: Full spec in engineering/api-design.md Section 3.2
// Onboarding is a resumable multi-step sequence (product-design.md Steps 1-5):
//   POST /start → create org + business + conversation, trigger discovery
//   GET  /discovery → poll discovery results (Google/Yelp/Meta)
//   POST /confirm → confirm discovered data
//   POST /photos → upload photos (multipart)
//   POST /priority → set priority focus (found_online, reviews, social)
//   POST /complete → finalize, trigger website gen + first social post + GBP

const startSchema = z.object({
  businessName: z.string().min(1),
  businessType: z.enum([
    "restaurant",
    "salon",
    "dental",
    "medical",
    "home_services",
    "fitness",
    "retail",
    "other",
  ]),
  city: z.string().min(1),
  state: z.string().min(2).max(2),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = startSchema.parse(body);

    // TODO: Create organization, business, user, conversation
    // TODO: Enqueue discovery jobs (Google, Yelp, Meta) via BullMQ
    // Each step is idempotent — client tracks completed steps locally

    return NextResponse.json(
      {
        data: {
          organizationId: "placeholder",
          businessId: "placeholder",
          conversationId: "placeholder",
          discoveryStatus: "pending",
          business: {
            name: validated.businessName,
            type: validated.businessType,
            city: validated.city,
            state: validated.state,
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
            message: "Invalid onboarding data",
            details: error.errors,
          },
        },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "Onboarding failed" } },
      { status: 500 }
    );
  }
}

export async function GET() {
  // TODO: Return current onboarding state for the authenticated business
  // Allows client to resume from the exact step they left off

  return NextResponse.json({
    data: {
      step: "start",
      completed: [],
      discoveryResults: null,
    },
    meta: { timestamp: new Date().toISOString() },
  });
}
