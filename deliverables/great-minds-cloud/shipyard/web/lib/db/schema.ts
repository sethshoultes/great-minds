import {
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
  integer,
  jsonb,
  boolean,
  pgEnum,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const projectStatusEnum = pgEnum('project_status', [
  'draft',
  'pending_payment',
  'queued',
  'processing',
  'debate',
  'building',
  'review',
  'completed',
  'failed',
]);

export const projectTierEnum = pgEnum('project_tier', [
  'starter',
  'standard',
  'enterprise',
]);

export const agentRoleEnum = pgEnum('agent_role', [
  'steve_jobs',
  'elon_musk',
  'designer',
  'copywriter',
  'brand_strategist',
  'market_analyst',
  'growth_strategist',
  'team_architect',
  'developer',
  'reviewer',
  'orchestrator',
]);

// Users table
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }),
  emailVerified: timestamp('email_verified'),
  image: text('image'),
  stripeCustomerId: varchar('stripe_customer_id', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Projects table
export const projects = pgTable('projects', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  prdContent: text('prd_content').notNull(),
  tier: projectTierEnum('tier').notNull().default('starter'),
  status: projectStatusEnum('status').notNull().default('draft'),
  priceInCents: integer('price_in_cents').notNull(),
  stripePaymentIntentId: varchar('stripe_payment_intent_id', { length: 255 }),
  deliverableUrl: text('deliverable_url'),
  estimatedCompletion: timestamp('estimated_completion'),
  startedAt: timestamp('started_at'),
  completedAt: timestamp('completed_at'),
  metadata: jsonb('metadata').$type<Record<string, unknown>>(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Agent activity log - for debate visualization
export const agentActivities = pgTable('agent_activities', {
  id: uuid('id').primaryKey().defaultRandom(),
  projectId: uuid('project_id')
    .notNull()
    .references(() => projects.id, { onDelete: 'cascade' }),
  agentRole: agentRoleEnum('agent_role').notNull(),
  agentName: varchar('agent_name', { length: 100 }).notNull(),
  action: varchar('action', { length: 100 }).notNull(),
  content: text('content').notNull(),
  thinking: text('thinking'),
  replyTo: uuid('reply_to'),
  sequenceNumber: integer('sequence_number').notNull(),
  durationMs: integer('duration_ms'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Deliverables - files produced by agents
export const deliverables = pgTable('deliverables', {
  id: uuid('id').primaryKey().defaultRandom(),
  projectId: uuid('project_id')
    .notNull()
    .references(() => projects.id, { onDelete: 'cascade' }),
  filename: varchar('filename', { length: 255 }).notNull(),
  mimeType: varchar('mime_type', { length: 100 }).notNull(),
  sizeBytes: integer('size_bytes').notNull(),
  s3Key: varchar('s3_key', { length: 500 }).notNull(),
  downloadUrl: text('download_url'),
  category: varchar('category', { length: 50 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Email notifications
export const emailNotifications = pgTable('email_notifications', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  projectId: uuid('project_id').references(() => projects.id, { onDelete: 'set null' }),
  type: varchar('type', { length: 50 }).notNull(),
  subject: varchar('subject', { length: 255 }).notNull(),
  sentAt: timestamp('sent_at'),
  failedAt: timestamp('failed_at'),
  errorMessage: text('error_message'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Sessions (for NextAuth)
export const sessions = pgTable('sessions', {
  id: uuid('id').primaryKey().defaultRandom(),
  sessionToken: text('session_token').notNull().unique(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expires: timestamp('expires').notNull(),
});

// Accounts (for NextAuth OAuth)
export const accounts = pgTable('accounts', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  type: varchar('type', { length: 255 }).notNull(),
  provider: varchar('provider', { length: 255 }).notNull(),
  providerAccountId: varchar('provider_account_id', { length: 255 }).notNull(),
  refresh_token: text('refresh_token'),
  access_token: text('access_token'),
  expires_at: integer('expires_at'),
  token_type: varchar('token_type', { length: 255 }),
  scope: varchar('scope', { length: 255 }),
  id_token: text('id_token'),
  session_state: varchar('session_state', { length: 255 }),
});

// Verification tokens (for NextAuth email)
export const verificationTokens = pgTable('verification_tokens', {
  identifier: varchar('identifier', { length: 255 }).notNull(),
  token: text('token').notNull().unique(),
  expires: timestamp('expires').notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  projects: many(projects),
  sessions: many(sessions),
  accounts: many(accounts),
  emailNotifications: many(emailNotifications),
}));

export const projectsRelations = relations(projects, ({ one, many }) => ({
  user: one(users, {
    fields: [projects.userId],
    references: [users.id],
  }),
  activities: many(agentActivities),
  deliverables: many(deliverables),
}));

export const agentActivitiesRelations = relations(agentActivities, ({ one }) => ({
  project: one(projects, {
    fields: [agentActivities.projectId],
    references: [projects.id],
  }),
}));

export const deliverablesRelations = relations(deliverables, ({ one }) => ({
  project: one(projects, {
    fields: [deliverables.projectId],
    references: [projects.id],
  }),
}));

// Type exports
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;
export type AgentActivity = typeof agentActivities.$inferSelect;
export type NewAgentActivity = typeof agentActivities.$inferInsert;
export type Deliverable = typeof deliverables.$inferSelect;
export type NewDeliverable = typeof deliverables.$inferInsert;
