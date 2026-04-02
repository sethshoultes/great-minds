import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// TODO: Full spec in engineering/api-design.md Section 3.1
// Validates credentials, issues JWT access (15 min) + refresh (30 day) tokens

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = loginSchema.parse(body);

    // TODO: Verify password hash, load org/business context, issue JWT pair
    // JWT payload: { sub, org, biz, plan, iat, exp }
    // Refresh token rotation: invalidate old, issue new

    return NextResponse.json({
      data: {
        accessToken: "placeholder",
        refreshToken: "placeholder",
      },
      meta: { timestamp: new Date().toISOString() },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: {
            code: "VALIDATION_ERROR",
            message: "Invalid login data",
            details: error.errors,
          },
        },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: { code: "AUTH_FAILED", message: "Invalid credentials" } },
      { status: 401 }
    );
  }
}
