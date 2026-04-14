/**
 * Notification Service (PRE-LAUNCH BLOCKER #2)
 * Spec: Board Condition #2 — Email notifications for percentile changes
 *
 * Handles:
 * - Checking notification preferences
 * - Sending emails via SendGrid
 * - Tracking notification history
 */

import { db } from "@/lib/db";
import { notificationPreferences, percentileHistory, users, businesses } from "@/db/schema";
import { eq, and, desc, gte } from "drizzle-orm";

/**
 * Notification check result
 */
export interface NotificationCheckResult {
  shouldNotify: boolean;
  reason: string;
  userId?: string;
  email?: string;
  delta?: number;
}

/**
 * Email content structure
 */
export interface PulseEmailContent {
  subject: string;
  html: string;
  text: string;
}

/**
 * Check if a notification should be sent for a percentile change
 */
export async function checkAndNotify(
  businessId: string,
  oldPercentile: number,
  newPercentile: number
): Promise<NotificationCheckResult> {
  const delta = newPercentile - oldPercentile;

  // Get notification preferences for this business
  const [prefs] = await db
    .select()
    .from(notificationPreferences)
    .where(eq(notificationPreferences.businessId, businessId))
    .limit(1);

  // If no preferences exist, don't notify
  if (!prefs) {
    return {
      shouldNotify: false,
      reason: "No notification preferences set",
    };
  }

  // Check if email notifications are enabled
  if (!prefs.emailEnabled) {
    return {
      shouldNotify: false,
      reason: "Email notifications disabled",
    };
  }

  // Check if the change meets the threshold
  const absDelta = Math.abs(delta);
  if (absDelta < prefs.threshold) {
    return {
      shouldNotify: false,
      reason: `Change (${delta}) below threshold (${prefs.threshold})`,
      delta,
    };
  }

  // Get user email
  const [user] = await db
    .select({ id: users.id, email: users.email, name: users.name })
    .from(users)
    .where(eq(users.id, prefs.userId))
    .limit(1);

  if (!user || !user.email) {
    return {
      shouldNotify: false,
      reason: "User email not found",
      delta,
    };
  }

  // Send the notification
  try {
    const content = createPulseEmail(newPercentile, delta, user.name || "there");
    await sendNotificationEmail(user.email, content);

    // Update last notified timestamp
    await db
      .update(notificationPreferences)
      .set({ lastNotifiedAt: new Date(), updatedAt: new Date() })
      .where(eq(notificationPreferences.id, prefs.id));

    return {
      shouldNotify: true,
      reason: "Notification sent successfully",
      userId: user.id,
      email: user.email,
      delta,
    };
  } catch (error) {
    return {
      shouldNotify: false,
      reason: `Failed to send email: ${error instanceof Error ? error.message : "Unknown error"}`,
      userId: user.id,
      email: user.email,
      delta,
    };
  }
}

/**
 * Create email content for a Pulse notification
 */
export function createPulseEmail(
  newPercentile: number,
  delta: number,
  userName: string
): PulseEmailContent {
  const isPositive = delta > 0;
  const direction = isPositive ? "up" : "down";
  const emoji = isPositive ? "📈" : "📉";
  const deltaDisplay = isPositive ? `+${delta}` : delta.toString();

  const subject = `${emoji} Your Pulse: ${deltaDisplay} points — Now at ${newPercentile}th percentile`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Pulse Update</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, ${isPositive ? "#f0fdf4" : "#fef2f2"} 0%, ${isPositive ? "#dcfce7" : "#fee2e2"} 100%); border-radius: 16px; padding: 32px; text-align: center; margin-bottom: 24px;">
    <h1 style="margin: 0 0 16px; font-size: 24px; color: ${isPositive ? "#166534" : "#991b1b"};">
      ${emoji} Your Pulse Update
    </h1>
    <div style="font-size: 64px; font-weight: bold; color: ${isPositive ? "#16a34a" : "#dc2626"}; margin: 16px 0;">
      ${newPercentile}<span style="font-size: 24px;">th</span>
    </div>
    <p style="font-size: 18px; color: #666; margin: 0;">
      You ${isPositive ? "moved up" : "moved down"} <strong>${Math.abs(delta)} points</strong>
    </p>
  </div>

  <p style="font-size: 16px;">Hi ${userName},</p>

  <p style="font-size: 16px;">
    ${
      isPositive
        ? `Great news! Your restaurant's performance ranking has improved. You're now outperforming ${newPercentile}% of similar restaurants in your area.`
        : `Your restaurant's performance ranking has changed. You're currently outperforming ${newPercentile}% of similar restaurants in your area.`
    }
  </p>

  <p style="font-size: 16px;">
    ${
      isPositive
        ? "Keep up the great work! Your engagement and consistency are paying off."
        : "Don't worry — fluctuations are normal. Check your dashboard to see which metrics changed and get tips for improvement."
    }
  </p>

  <div style="text-align: center; margin: 32px 0;">
    <a href="{{DASHBOARD_URL}}" style="display: inline-block; background: #2563eb; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px;">
      View Your Dashboard
    </a>
  </div>

  <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 32px 0;">

  <p style="font-size: 14px; color: #6b7280;">
    You're receiving this email because you enabled Pulse notifications.
    <a href="{{UNSUBSCRIBE_URL}}" style="color: #6b7280;">Manage notification settings</a>
  </p>

  <p style="font-size: 12px; color: #9ca3af; margin-top: 24px;">
    LocalGenius Pulse — Know where you stand.
  </p>
</body>
</html>
  `.trim();

  const text = `
Your Pulse Update: ${deltaDisplay} points — Now at ${newPercentile}th percentile

Hi ${userName},

${
  isPositive
    ? `Great news! Your restaurant's performance ranking has improved. You're now outperforming ${newPercentile}% of similar restaurants in your area.`
    : `Your restaurant's performance ranking has changed. You're currently outperforming ${newPercentile}% of similar restaurants in your area.`
}

${
  isPositive
    ? "Keep up the great work! Your engagement and consistency are paying off."
    : "Don't worry — fluctuations are normal. Check your dashboard to see which metrics changed and get tips for improvement."
}

View your dashboard: {{DASHBOARD_URL}}

---
You're receiving this email because you enabled Pulse notifications.
Manage notification settings: {{UNSUBSCRIBE_URL}}

LocalGenius Pulse — Know where you stand.
  `.trim();

  return { subject, html, text };
}

/**
 * Send notification email via SendGrid
 *
 * NOTE: Requires SENDGRID_API_KEY environment variable
 */
export async function sendNotificationEmail(
  to: string,
  content: PulseEmailContent
): Promise<void> {
  const apiKey = process.env.SENDGRID_API_KEY;

  if (!apiKey) {
    // In development, log instead of sending
    if (process.env.NODE_ENV === "development") {
      console.log("[Pulse Notification] Would send email:", {
        to,
        subject: content.subject,
      });
      return;
    }
    throw new Error("SENDGRID_API_KEY not configured");
  }

  const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      personalizations: [{ to: [{ email: to }] }],
      from: {
        email: process.env.SENDGRID_FROM_EMAIL || "pulse@localgenius.app",
        name: "LocalGenius Pulse",
      },
      subject: content.subject,
      content: [
        { type: "text/plain", value: content.text },
        { type: "text/html", value: content.html },
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`SendGrid error: ${response.status} - ${errorText}`);
  }
}

/**
 * Get notification preferences for a user/business
 */
export async function getNotificationPreferences(
  userId: string,
  businessId: string
): Promise<{
  emailEnabled: boolean;
  threshold: number;
  weeklyDigest: boolean;
} | null> {
  const [prefs] = await db
    .select()
    .from(notificationPreferences)
    .where(
      and(
        eq(notificationPreferences.userId, userId),
        eq(notificationPreferences.businessId, businessId)
      )
    )
    .limit(1);

  if (!prefs) return null;

  return {
    emailEnabled: prefs.emailEnabled === 1,
    threshold: prefs.threshold,
    weeklyDigest: prefs.weeklyDigest === 1,
  };
}

/**
 * Update notification preferences
 */
export async function updateNotificationPreferences(
  userId: string,
  businessId: string,
  updates: {
    emailEnabled?: boolean;
    threshold?: number;
    weeklyDigest?: boolean;
  }
): Promise<void> {
  const existingPrefs = await getNotificationPreferences(userId, businessId);

  const values = {
    emailEnabled: updates.emailEnabled !== undefined ? (updates.emailEnabled ? 1 : 0) : undefined,
    threshold: updates.threshold,
    weeklyDigest: updates.weeklyDigest !== undefined ? (updates.weeklyDigest ? 1 : 0) : undefined,
    updatedAt: new Date(),
  };

  // Remove undefined values
  const cleanValues = Object.fromEntries(
    Object.entries(values).filter(([_, v]) => v !== undefined)
  );

  if (existingPrefs) {
    // Update existing
    await db
      .update(notificationPreferences)
      .set(cleanValues)
      .where(
        and(
          eq(notificationPreferences.userId, userId),
          eq(notificationPreferences.businessId, businessId)
        )
      );
  } else {
    // Insert new
    await db.insert(notificationPreferences).values({
      userId,
      businessId,
      emailEnabled: updates.emailEnabled !== undefined ? (updates.emailEnabled ? 1 : 0) : 1,
      threshold: updates.threshold ?? 5,
      weeklyDigest: updates.weeklyDigest !== undefined ? (updates.weeklyDigest ? 1 : 0) : 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
}

/**
 * Record a percentile snapshot for history
 */
export async function recordPercentileHistory(
  businessId: string,
  percentileRank: number,
  peerCount: number
): Promise<void> {
  await db.insert(percentileHistory).values({
    businessId,
    percentileRank,
    peerCount,
    calculatedAt: new Date(),
  });
}

/**
 * Get percentile history for a business
 */
export async function getPercentileHistory(
  businessId: string,
  daysBack: number = 30
): Promise<Array<{ date: string; percentile: number; peerCount: number }>> {
  const since = new Date(Date.now() - daysBack * 24 * 60 * 60 * 1000);

  const history = await db
    .select({
      percentileRank: percentileHistory.percentileRank,
      peerCount: percentileHistory.peerCount,
      calculatedAt: percentileHistory.calculatedAt,
    })
    .from(percentileHistory)
    .where(
      and(
        eq(percentileHistory.businessId, businessId),
        gte(percentileHistory.calculatedAt, since)
      )
    )
    .orderBy(desc(percentileHistory.calculatedAt));

  return history.map((h) => ({
    date: h.calculatedAt.toISOString(),
    percentile: h.percentileRank,
    peerCount: h.peerCount,
  }));
}
