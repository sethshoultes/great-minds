/**
 * Pulse Benchmark Database Schema Extension
 * Spec: REQ-025
 *
 * Extends the existing LocalGenius schema with Pulse-specific tables.
 * Leverages existing benchmark_aggregates table structure per data-audit-results.md.
 */

import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  decimal,
  integer,
  text,
  index,
  unique,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

/**
 * Pulse Benchmarks Table
 *
 * Stores calculated metrics and percentile rankings for each business.
 * Updated nightly by batch job.
 */
export const pulseBenchmarks = pgTable(
  "pulse_benchmarks",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    // Business reference
    businessId: uuid("business_id").notNull(),

    // Period covered by this benchmark
    periodStart: timestamp("period_start", { withTimezone: true }).notNull(),
    periodEnd: timestamp("period_end", { withTimezone: true }).notNull(),

    // Raw metric values
    engagementRate: decimal("engagement_rate", {
      precision: 10,
      scale: 4,
    }).notNull(),
    postFrequency: decimal("post_frequency", {
      precision: 10,
      scale: 4,
    }).notNull(),
    engagementGrowth: decimal("engagement_growth", {
      precision: 10,
      scale: 4,
    }).notNull(),
    responseTime: decimal("response_time", {
      precision: 10,
      scale: 4,
    }).notNull(),
    conversionRate: decimal("conversion_rate", {
      precision: 10,
      scale: 4,
    }).notNull(),

    // Percentile rankings (0-100)
    engagementRatePercentile: integer("engagement_rate_percentile").notNull(),
    postFrequencyPercentile: integer("post_frequency_percentile").notNull(),
    engagementGrowthPercentile: integer(
      "engagement_growth_percentile"
    ).notNull(),
    responseTimePercentile: integer("response_time_percentile").notNull(),
    conversionRatePercentile: integer("conversion_rate_percentile").notNull(),

    // Composite Pulse score (average of all percentiles)
    compositePercentile: integer("composite_percentile").notNull(),

    // Peer group information
    peerGroupRegion: varchar("peer_group_region", { length: 100 }).notNull(),
    peerGroupRegionType: varchar("peer_group_region_type", {
      length: 10,
    }).notNull(), // 'msa' or 'state'
    peerGroupSizeBucket: varchar("peer_group_size_bucket", {
      length: 20,
    }).notNull(),
    peerGroupSize: integer("peer_group_size").notNull(),

    // Metadata
    calculatedAt: timestamp("calculated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    // Unique constraint: one benchmark per business per period
    businessPeriodUnique: unique().on(table.businessId, table.periodEnd),

    // Index for fast lookups
    businessIdIdx: index("pulse_benchmarks_business_id_idx").on(
      table.businessId
    ),

    // Index for finding latest benchmarks
    calculatedAtIdx: index("pulse_benchmarks_calculated_at_idx").on(
      table.calculatedAt
    ),

    // Index for peer group queries
    peerGroupIdx: index("pulse_benchmarks_peer_group_idx").on(
      table.peerGroupRegion,
      table.peerGroupSizeBucket
    ),
  })
);

/**
 * Public Benchmark Reports Table
 *
 * Stores shareable public report metadata for SEO-friendly URLs.
 */
export const pulsePublicReports = pgTable(
  "pulse_public_reports",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    // Business reference
    businessId: uuid("business_id").notNull(),

    // URL slug for public access
    slug: varchar("slug", { length: 100 }).notNull().unique(),

    // Display settings
    businessDisplayName: varchar("business_display_name", {
      length: 255,
    }).notNull(),
    isPublic: integer("is_public").default(1).notNull(), // 1 = public, 0 = private

    // Latest benchmark snapshot at time of report generation
    benchmarkSnapshotId: uuid("benchmark_snapshot_id"),

    // Timestamps
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    slugIdx: index("pulse_public_reports_slug_idx").on(table.slug),
    businessIdIdx: index("pulse_public_reports_business_id_idx").on(
      table.businessId
    ),
  })
);

/**
 * Embeddable Badge Configurations Table
 *
 * Stores configuration for embeddable badges on external sites.
 */
export const pulseBadgeConfigs = pgTable(
  "pulse_badge_configs",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    // Business reference
    businessId: uuid("business_id").notNull(),

    // Badge settings
    badgeType: varchar("badge_type", { length: 50 })
      .default("standard")
      .notNull(),
    showMetric: varchar("show_metric", { length: 50 })
      .default("composite")
      .notNull(),
    theme: varchar("theme", { length: 20 }).default("light").notNull(),

    // Embed code identifier
    embedCode: varchar("embed_code", { length: 100 }).notNull().unique(),

    // Usage tracking
    embedCount: integer("embed_count").default(0).notNull(),
    lastEmbeddedAt: timestamp("last_embedded_at", { withTimezone: true }),

    // Timestamps
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    embedCodeIdx: index("pulse_badge_configs_embed_code_idx").on(
      table.embedCode
    ),
    businessIdIdx: index("pulse_badge_configs_business_id_idx").on(
      table.businessId
    ),
  })
);

/**
 * Relations for Drizzle ORM
 */
export const pulseBenchmarksRelations = relations(
  pulseBenchmarks,
  ({ one }) => ({
    // Add relation to businesses table when integrated with main schema
  })
);

export const pulsePublicReportsRelations = relations(
  pulsePublicReports,
  ({ one }) => ({
    benchmark: one(pulseBenchmarks, {
      fields: [pulsePublicReports.benchmarkSnapshotId],
      references: [pulseBenchmarks.id],
    }),
  })
);

/**
 * Percentile History Table (PRE-LAUNCH BLOCKER: Progress Tracking)
 *
 * Stores daily percentile snapshots for progress tracking.
 * Enables "Last Week vs. This Week" comparison (Board Condition #1).
 */
export const percentileHistory = pgTable(
  "percentile_history",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    // Business reference
    businessId: uuid("business_id").notNull(),

    // Percentile at this point in time
    percentileRank: integer("percentile_rank").notNull(),

    // Peer group size at calculation time
    peerCount: integer("peer_count").notNull(),

    // When this snapshot was taken
    calculatedAt: timestamp("calculated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    // Unique constraint: one entry per business per day
    businessDateUnique: unique().on(table.businessId, table.calculatedAt),

    // Index for efficient history lookups
    historyLookupIdx: index("percentile_history_lookup_idx").on(
      table.businessId,
      table.calculatedAt
    ),
  })
);

/**
 * Notification Preferences Table (PRE-LAUNCH BLOCKER: Notification System)
 *
 * Stores user preferences for Pulse notifications.
 * Enables email alerts for percentile changes (Board Condition #2).
 */
export const notificationPreferences = pgTable(
  "notification_preferences",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    // User and business references
    userId: uuid("user_id").notNull(),
    businessId: uuid("business_id").notNull(),

    // Notification settings
    emailEnabled: integer("email_enabled").default(1).notNull(), // 1 = enabled
    threshold: integer("threshold").default(5).notNull(), // Points change to trigger notification
    weeklyDigest: integer("weekly_digest").default(1).notNull(), // 1 = receive weekly summary

    // Tracking
    lastNotifiedAt: timestamp("last_notified_at", { withTimezone: true }),

    // Timestamps
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    // Unique constraint: one preference set per user per business
    userBusinessUnique: unique().on(table.userId, table.businessId),

    // Index for lookups
    businessIdIdx: index("notification_preferences_business_id_idx").on(
      table.businessId
    ),
    userIdIdx: index("notification_preferences_user_id_idx").on(table.userId),
  })
);

/**
 * Pulse Badges Table (Embeddable Achievement Badges)
 *
 * Stores earned badges for businesses.
 * Tiers: Gold (top 10%), Silver (top 25%), Bronze (top 50%)
 */
export const pulseBadges = pgTable(
  "pulse_badges",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    // Business reference
    businessId: uuid("business_id").notNull(),

    // Badge details
    tier: varchar("tier", { length: 20 }).notNull(), // 'gold', 'silver', 'bronze'
    embedId: varchar("embed_id", { length: 100 }).notNull().unique(),
    calculationDate: timestamp("calculation_date", { withTimezone: true })
      .notNull(),
    verificationCode: varchar("verification_code", { length: 50 }).notNull(),

    // Timestamps
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    // Index for embed lookups
    embedIdIdx: index("pulse_badges_embed_id_idx").on(table.embedId),
    businessIdIdx: index("pulse_badges_business_id_idx").on(table.businessId),
  })
);

/**
 * Type exports for TypeScript
 */
export type PulseBenchmark = typeof pulseBenchmarks.$inferSelect;
export type NewPulseBenchmark = typeof pulseBenchmarks.$inferInsert;

export type PulsePublicReport = typeof pulsePublicReports.$inferSelect;
export type NewPulsePublicReport = typeof pulsePublicReports.$inferInsert;

export type PulseBadgeConfig = typeof pulseBadgeConfigs.$inferSelect;
export type NewPulseBadgeConfig = typeof pulseBadgeConfigs.$inferInsert;

export type PercentileHistory = typeof percentileHistory.$inferSelect;
export type NewPercentileHistory = typeof percentileHistory.$inferInsert;

export type NotificationPreference = typeof notificationPreferences.$inferSelect;
export type NewNotificationPreference = typeof notificationPreferences.$inferInsert;

export type PulseBadge = typeof pulseBadges.$inferSelect;
export type NewPulseBadge = typeof pulseBadges.$inferInsert;
