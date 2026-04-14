/**
 * LocalGenius Site Provisions Schema — Drizzle ORM
 *
 * Provisioning state machine for site creation lifecycle.
 * Requirement: REQ-026 — Neon hosts state machine for site provisioning
 *
 * States: pending → generating → uploading → dns_configuring → provisioned → failed
 *
 * Multi-tenant: every provision has organization_id + business_id for RLS enforcement
 */

import {
  pgTable,
  uuid,
  text,
  integer,
  timestamp,
  index,
  pgEnum,
} from "drizzle-orm/pg-core";

// ─── Enums ────────────────────────────────────────────────────────────────────

/**
 * Site Provision Status Enum
 * Represents the current state in the provisioning lifecycle.
 */
export const siteProvisionStatusEnum = pgEnum("site_provision_status", [
  "pending",        // Provision created, awaiting processing
  "generating",     // Static HTML generation in progress
  "uploading",      // Uploading assets to R2 in progress
  "dns_configuring", // DNS records and Worker routing in progress
  "provisioned",    // Complete and live
  "failed",         // Encountered error, requires retry or manual intervention
]);

// ─── 1. Site Provisions ────────────────────────────────────────────────────────
// Central state machine table for tracking site provisioning lifecycle.
// Every site creation flows through this state machine.

export const siteProvisions = pgTable(
  "site_provisions",
  {
    // Primary Keys
    id: uuid("id").primaryKey().defaultRandom(),

    // Foreign Keys (Multi-tenant RLS)
    siteId: text("site_id").notNull(),
    organizationId: uuid("organization_id").notNull(),
    businessId: uuid("business_id").notNull(),

    // State Machine
    status: siteProvisionStatusEnum("status")
      .notNull()
      .default("pending"),
    currentStep: text("current_step"),

    // Error Handling & Retry Logic
    errorMessage: text("error_message"),
    retryCount: integer("retry_count").notNull().default(0),
    lastRetryAt: timestamp("last_retry_at", { withTimezone: true }),

    // Timestamps
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    // Queue queries: find all pending/failed provisions to process
    index("idx_site_provisions_status").on(table.status),

    // Business scoping: find all provisions for a business
    index("idx_site_provisions_business").on(table.businessId),

    // Organization scoping: find all provisions for an organization
    index("idx_site_provisions_org").on(table.organizationId),

    // Combined lookup for retry candidates
    index("idx_site_provisions_retry").on(table.status, table.lastRetryAt),
  ]
);
