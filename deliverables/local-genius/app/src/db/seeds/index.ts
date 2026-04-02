/**
 * Demo seed script — creates Maria's Kitchen with sample data.
 * Run: pnpm db:seed
 */

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "../schema";
import { hashPassword } from "../../lib/password";

async function seed() {
  const sql = neon(process.env.DATABASE_URL!);
  const db = drizzle(sql, { schema });

  console.log("Seeding demo data...");

  // 1. Organization
  const [org] = await db
    .insert(schema.organizations)
    .values({ name: "Maria's Kitchen" })
    .returning();
  console.log(`  Created org: ${org.id}`);

  // 2. Business — Maria's Kitchen, Austin TX
  const [biz] = await db
    .insert(schema.businesses)
    .values({
      organizationId: org.id,
      name: "Maria's Kitchen",
      vertical: "restaurant",
      city: "Austin",
      state: "TX",
      address: "1401 S Lamar Blvd, Austin, TX 78704",
      phone: "(512) 555-0142",
      employeeCount: 11,
      timezone: "America/Chicago",
      priorityFocus: "reviews",
      autonomyLevel: 0,
      onboardingCompletedAt: new Date(),
    })
    .returning();
  console.log(`  Created business: ${biz.name} (${biz.id})`);

  // 3. User — Maria Gonzalez
  const passwordHash = await hashPassword("localgenius123");
  const [user] = await db
    .insert(schema.users)
    .values({
      organizationId: org.id,
      businessId: biz.id,
      email: "maria@mariaskitchen.com",
      name: "Maria Gonzalez",
      passwordHash,
      consentAt: new Date(),
    })
    .returning();
  console.log(`  Created user: ${user.email}`);

  // 4. Conversation
  const [convo] = await db
    .insert(schema.conversations)
    .values({ businessId: biz.id, organizationId: org.id })
    .returning();

  // 5. Sample messages
  const sampleMessages = [
    { role: "system" as const, contentType: "text" as const, content: { text: "Welcome to LocalGenius, Maria! I'm here to help you manage your restaurant's online presence." } },
    { role: "owner" as const, contentType: "text" as const, content: { text: "Can you post something about our new fish tacos?" } },
    { role: "assistant" as const, contentType: "text" as const, content: { text: "Here's a post for your new fish tacos:\n\n\"Fresh fish tacos just landed at Maria's Kitchen! Crispy battered cod, house-made slaw, and our famous chipotle lime crema. Available now for lunch and dinner. Come hungry. 🌮\n\n#AustinEats #FishTacos #MariasKitchen #SouthLamar #TexMex\"\n\nWant me to post this to Instagram and Facebook?" }, aiModel: "claude-sonnet-4-6-20250514" },
    { role: "owner" as const, contentType: "text" as const, content: { text: "Looks great! Post it." } },
    { role: "assistant" as const, contentType: "text" as const, content: { text: "Done! Posted to Instagram and Facebook. I scheduled it for 11:30am — right before the lunch crowd starts searching. I'll let you know how it performs." }, aiModel: "claude-sonnet-4-6-20250514" },
  ];

  for (const msg of sampleMessages) {
    await db.insert(schema.messages).values({
      conversationId: convo.id,
      businessId: biz.id,
      organizationId: org.id,
      role: msg.role,
      contentType: msg.contentType,
      content: msg.content,
      aiModel: (msg as { aiModel?: string }).aiModel || null,
    });
  }
  console.log(`  Created ${sampleMessages.length} sample messages`);

  // 6. Sample reviews
  const sampleReviews = [
    { platform: "google", externalReviewId: "g-001", reviewerName: "Jake R.", rating: 5, reviewText: "Best fish tacos in Austin! The chipotle lime crema is incredible. Will be back weekly.", sentiment: "positive" as const, keyTopics: ["fish tacos", "chipotle lime crema"] },
    { platform: "google", externalReviewId: "g-002", reviewerName: "Sarah M.", rating: 4, reviewText: "Food was great but we waited 25 minutes for a table on a Tuesday. Worth it though.", sentiment: "positive" as const, keyTopics: ["wait time", "food quality"] },
    { platform: "google", externalReviewId: "g-003", reviewerName: "David L.", rating: 5, reviewText: "Maria's Kitchen is a South Lamar gem. Authentic Tex-Mex, friendly staff, and the margaritas are perfect.", sentiment: "positive" as const, keyTopics: ["authentic", "staff", "margaritas"] },
    { platform: "google", externalReviewId: "g-004", reviewerName: "Jennifer K.", rating: 3, reviewText: "Decent food but portion sizes were small for the price. $18 for tacos felt steep.", sentiment: "negative" as const, keyTopics: ["portion size", "pricing"] },
    { platform: "google", externalReviewId: "g-005", reviewerName: "Mike T.", rating: 5, reviewText: "This place is the real deal. We come every Friday night. The enchiladas are out of this world.", sentiment: "positive" as const, keyTopics: ["enchiladas", "regular customer"] },
    { platform: "yelp", externalReviewId: "y-001", reviewerName: "Austin Foodie", rating: 4, reviewText: "Great neighborhood spot. Love that they use fresh ingredients. The queso is addictive.", sentiment: "positive" as const, keyTopics: ["fresh ingredients", "queso"] },
    { platform: "google", externalReviewId: "g-006", reviewerName: "Lisa W.", rating: 2, reviewText: "Waited 40 minutes for our food and it came out cold. The server didn't seem to care. Disappointing.", sentiment: "negative" as const, keyTopics: ["wait time", "cold food", "service"] },
    { platform: "google", externalReviewId: "g-007", reviewerName: "Carlos P.", rating: 5, reviewText: "Maria herself came to our table to check on us. You can tell she puts her heart into this place. Amazing food.", sentiment: "positive" as const, keyTopics: ["owner interaction", "food quality"] },
  ];

  const now = new Date();
  for (let i = 0; i < sampleReviews.length; i++) {
    const r = sampleReviews[i];
    await db.insert(schema.reviews).values({
      businessId: biz.id,
      organizationId: org.id,
      platform: r.platform,
      externalReviewId: r.externalReviewId,
      reviewerName: r.reviewerName,
      rating: r.rating,
      reviewText: r.reviewText,
      reviewDate: new Date(now.getTime() - (sampleReviews.length - i) * 2 * 24 * 60 * 60 * 1000),
      sentiment: r.sentiment,
      keyTopics: r.keyTopics,
    });
  }
  console.log(`  Created ${sampleReviews.length} sample reviews`);

  // 7. Sample analytics events
  const eventTypes = ["page_view", "phone_call", "booking", "social_engagement", "review_received"];
  for (let day = 0; day < 14; day++) {
    for (const eventType of eventTypes) {
      const count = eventType === "page_view" ? 15 + Math.floor(Math.random() * 30) : 1 + Math.floor(Math.random() * 5);
      for (let j = 0; j < count; j++) {
        await db.insert(schema.analyticsEvents).values({
          businessId: biz.id,
          organizationId: org.id,
          eventType,
          source: "demo_seed",
          metadata: {},
          occurredAt: new Date(now.getTime() - day * 24 * 60 * 60 * 1000 - Math.random() * 24 * 60 * 60 * 1000),
        });
      }
    }
  }
  console.log("  Created 14 days of sample analytics events");

  // 8. Sample actions
  const sampleActions = [
    { actionType: "social_post" as const, status: "completed" as const, content: { text: "Fish tacos post", platform: "instagram" } },
    { actionType: "social_post" as const, status: "completed" as const, content: { text: "Weekend brunch special", platform: "facebook" } },
    { actionType: "review_response" as const, status: "completed" as const, content: { text: "Response to Jake R.", platform: "google" } },
    { actionType: "gbp_update" as const, status: "completed" as const, content: { text: "Updated business hours" } },
    { actionType: "seo_optimization" as const, status: "completed" as const, content: { text: "Optimized Google Business Profile description" } },
  ];

  for (const a of sampleActions) {
    await db.insert(schema.actions).values({
      businessId: biz.id,
      organizationId: org.id,
      actionType: a.actionType,
      status: a.status,
      content: a.content,
      executedAt: new Date(now.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000),
    });
  }
  console.log(`  Created ${sampleActions.length} sample actions`);

  console.log("\nSeed complete!");
  console.log(`  Login: maria@mariaskitchen.com / localgenius123`);
  console.log(`  Business: Maria's Kitchen (${biz.id})`);
  console.log(`  Org: ${org.id}`);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
