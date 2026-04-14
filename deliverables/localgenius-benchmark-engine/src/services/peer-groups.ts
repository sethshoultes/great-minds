/**
 * Peer Group Selection Service
 * Spec: REQ-009, REQ-015, REQ-028, REQ-037
 *
 * Implements curated peer group selection with:
 * - MSA (Metropolitan Statistical Area) primary grouping
 * - State-level fallback for sparse cohorts
 * - Minimum 50+ businesses per cohort (REQ-015)
 * - Statistical validity checks (REQ-037)
 * - Restaurant-only filtering via NAICS codes (REQ-007)
 */

import { db } from "@/lib/db";
import { businesses, benchmarkAggregates } from "@/db/schema";
import { eq, and, gte, sql, like, or, inArray } from "drizzle-orm";
import {
  RESTAURANT_NAICS_PREFIX,
  isRestaurantNaicsCode,
} from "./pulse-metrics";

/**
 * Minimum businesses required for a statistically valid peer group (REQ-015)
 */
export const MIN_COHORT_SIZE = 50;

/**
 * Minimum businesses for fallback (smaller threshold for state-level)
 */
export const MIN_FALLBACK_COHORT_SIZE = 10;

/**
 * Size buckets for business categorization
 */
export const SIZE_BUCKETS = {
  MICRO: { min: 1, max: 5, label: "1-5 employees" },
  SMALL: { min: 6, max: 15, label: "6-15 employees" },
  MEDIUM: { min: 16, max: 50, label: "16-50 employees" },
  LARGE: { min: 51, max: Infinity, label: "51+ employees" },
} as const;

export type SizeBucket = keyof typeof SIZE_BUCKETS;

/**
 * Peer group criteria definition
 */
export interface PeerGroupCriteria {
  /** Restaurant NAICS code prefix (722xxx) */
  naicsPrefix: string;
  /** Geographic region - MSA code or state abbreviation */
  region: string;
  /** Region type: 'msa' or 'state' */
  regionType: "msa" | "state";
  /** Business size bucket */
  sizeBucket: SizeBucket;
  /** Whether this is a fallback group (expanded geography) */
  isFallback: boolean;
}

/**
 * Peer group with member count and validity status
 */
export interface PeerGroup {
  criteria: PeerGroupCriteria;
  memberCount: number;
  isValid: boolean;
  validationMessage: string;
}

/**
 * Business location and size information for peer matching
 */
export interface BusinessProfile {
  businessId: string;
  naicsCode: string;
  msa: string | null;
  state: string;
  employeeCount: number;
}

/**
 * Determine size bucket from employee count
 */
export function getSizeBucket(employeeCount: number): SizeBucket {
  if (employeeCount <= 5) return "MICRO";
  if (employeeCount <= 15) return "SMALL";
  if (employeeCount <= 50) return "MEDIUM";
  return "LARGE";
}

/**
 * Get business profile for peer group matching
 */
export async function getBusinessProfile(
  businessId: string
): Promise<BusinessProfile | null> {
  const [business] = await db
    .select({
      id: businesses.id,
      naicsCode: businesses.naicsCode,
      msa: businesses.msa,
      state: businesses.state,
      employeeCount: businesses.employeeCount,
    })
    .from(businesses)
    .where(eq(businesses.id, businessId))
    .limit(1);

  if (!business || !business.naicsCode) return null;

  // Validate restaurant NAICS code
  if (!isRestaurantNaicsCode(business.naicsCode)) {
    return null;
  }

  return {
    businessId: business.id,
    naicsCode: business.naicsCode,
    msa: business.msa || null,
    state: business.state || "",
    employeeCount: business.employeeCount || 1,
  };
}

/**
 * Count potential peer businesses for given criteria
 */
async function countPeerBusinesses(
  criteria: PeerGroupCriteria
): Promise<number> {
  const sizeBucket = SIZE_BUCKETS[criteria.sizeBucket];

  const regionCondition =
    criteria.regionType === "msa"
      ? eq(businesses.msa, criteria.region)
      : eq(businesses.state, criteria.region);

  const [result] = await db
    .select({
      count: sql<number>`count(*)`,
    })
    .from(businesses)
    .where(
      and(
        like(businesses.naicsCode, `${criteria.naicsPrefix}%`),
        regionCondition,
        gte(businesses.employeeCount, sizeBucket.min),
        sizeBucket.max === Infinity
          ? sql`true`
          : sql`${businesses.employeeCount} <= ${sizeBucket.max}`
      )
    );

  return Number(result?.count || 0);
}

/**
 * Find peer group with MSA -> State fallback (REQ-028)
 *
 * Algorithm:
 * 1. Try MSA + size bucket (most specific)
 * 2. If < 50 businesses, fallback to State + size bucket
 * 3. If < 10 businesses at state level, mark as insufficient
 */
export async function findPeerGroup(
  profile: BusinessProfile
): Promise<PeerGroup> {
  const sizeBucket = getSizeBucket(profile.employeeCount);

  // Step 1: Try MSA-level peer group (most specific)
  if (profile.msa) {
    const msaCriteria: PeerGroupCriteria = {
      naicsPrefix: RESTAURANT_NAICS_PREFIX,
      region: profile.msa,
      regionType: "msa",
      sizeBucket,
      isFallback: false,
    };

    const msaCount = await countPeerBusinesses(msaCriteria);

    if (msaCount >= MIN_COHORT_SIZE) {
      return {
        criteria: msaCriteria,
        memberCount: msaCount,
        isValid: true,
        validationMessage: `${msaCount} restaurants in ${profile.msa} MSA`,
      };
    }
  }

  // Step 2: Fallback to state-level (REQ-028)
  const stateCriteria: PeerGroupCriteria = {
    naicsPrefix: RESTAURANT_NAICS_PREFIX,
    region: profile.state,
    regionType: "state",
    sizeBucket,
    isFallback: true,
  };

  const stateCount = await countPeerBusinesses(stateCriteria);

  if (stateCount >= MIN_FALLBACK_COHORT_SIZE) {
    return {
      criteria: stateCriteria,
      memberCount: stateCount,
      isValid: stateCount >= MIN_COHORT_SIZE,
      validationMessage:
        stateCount >= MIN_COHORT_SIZE
          ? `${stateCount} restaurants in ${profile.state}`
          : `${stateCount} restaurants in ${profile.state} (below optimal threshold of ${MIN_COHORT_SIZE})`,
    };
  }

  // Step 3: Insufficient data for valid peer group
  return {
    criteria: stateCriteria,
    memberCount: stateCount,
    isValid: false,
    validationMessage: `Insufficient data: only ${stateCount} restaurants in ${profile.state}`,
  };
}

/**
 * Get peer business IDs for benchmark calculation
 */
export async function getPeerBusinessIds(
  criteria: PeerGroupCriteria,
  excludeBusinessId?: string
): Promise<string[]> {
  const sizeBucket = SIZE_BUCKETS[criteria.sizeBucket];

  const regionCondition =
    criteria.regionType === "msa"
      ? eq(businesses.msa, criteria.region)
      : eq(businesses.state, criteria.region);

  const conditions = [
    like(businesses.naicsCode, `${criteria.naicsPrefix}%`),
    regionCondition,
    gte(businesses.employeeCount, sizeBucket.min),
  ];

  if (sizeBucket.max !== Infinity) {
    conditions.push(sql`${businesses.employeeCount} <= ${sizeBucket.max}`);
  }

  const result = await db
    .select({
      id: businesses.id,
    })
    .from(businesses)
    .where(and(...conditions));

  const ids = result.map((r) => r.id);

  // Exclude the target business if specified
  if (excludeBusinessId) {
    return ids.filter((id) => id !== excludeBusinessId);
  }

  return ids;
}

/**
 * Validate peer group meets statistical requirements (REQ-037)
 */
export function validatePeerGroup(peerGroup: PeerGroup): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check minimum cohort size
  if (peerGroup.memberCount < MIN_FALLBACK_COHORT_SIZE) {
    errors.push(
      `Peer group has only ${peerGroup.memberCount} members (minimum: ${MIN_FALLBACK_COHORT_SIZE})`
    );
  } else if (peerGroup.memberCount < MIN_COHORT_SIZE) {
    warnings.push(
      `Peer group has ${peerGroup.memberCount} members (optimal: ${MIN_COHORT_SIZE}+)`
    );
  }

  // Check if using fallback
  if (peerGroup.criteria.isFallback) {
    warnings.push("Using state-level grouping (MSA data insufficient)");
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Format peer group criteria for display
 */
export function formatPeerGroupCriteria(criteria: PeerGroupCriteria): string {
  const sizeBucket = SIZE_BUCKETS[criteria.sizeBucket];
  const regionLabel =
    criteria.regionType === "msa"
      ? `${criteria.region} Metro Area`
      : `${criteria.region} (Statewide)`;

  return `Restaurants in ${regionLabel}, ${sizeBucket.label}`;
}
