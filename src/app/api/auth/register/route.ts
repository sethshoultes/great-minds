import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// TODO: Full spec in engineering/api-design.md Section 3.1
// Creates account, org, issues JWT access + refresh tokens

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = registerSchema.parse(body);

    // TODO: Hash password, create org + user, issue JWT pair
    // See api-design.md Section 2.1 for JWT payload spec:
    // { sub: user_uuid, org: organization_uuid, biz: business_uuid, plan: "base" }

    return NextResponse.json(
      {
        data: {
          user: {
            id: "placeholder",
            email: validated.email,
            name: validated.name,
          },
          accessToken: "placeholder",
          refreshToken: "placeholder",
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
            message: "Invalid registration data",
            details: error.errors,
          },
        },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "Registration failed" } },
      { status: 500 }
    );
  }
}
