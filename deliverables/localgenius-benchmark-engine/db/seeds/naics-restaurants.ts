/**
 * NAICS Restaurant Industry Codes Seed
 *
 * Spec: Phase 1 Plan, Task 1
 * Decision 6: Single Industry First — Restaurants
 * Decision 7: NAICS Codes for Industry Categorization
 *
 * Seeds the naics_industries table with restaurant subcategories.
 * These codes are used for peer group matching in Pulse benchmarks.
 *
 * Source: US Census Bureau NAICS 2022 (Section 72: Accommodation and Food Services)
 * https://www.census.gov/naics/?input=722&year=2022&details=722
 */

import { db } from "@/lib/db";
import { naicsIndustries } from "@/db/schema";

interface NaicsCode {
  code: string;
  title: string;
  description: string;
  parentCode: string | null;
}

/**
 * Restaurant NAICS codes (722xxx)
 * Comprehensive coverage of food service establishments.
 */
const RESTAURANT_NAICS_CODES: NaicsCode[] = [
  // Full-Service Restaurants
  {
    code: "722511",
    title: "Full-Service Restaurants",
    description:
      "Establishments primarily engaged in providing food services to patrons who order and are served while seated and pay after eating.",
    parentCode: "7225",
  },
  // Limited-Service Eating Places
  {
    code: "722513",
    title: "Limited-Service Restaurants",
    description:
      "Establishments primarily engaged in providing food services where patrons generally order or select items and pay before eating.",
    parentCode: "7225",
  },
  {
    code: "722514",
    title: "Cafeterias, Grill Buffets, and Buffets",
    description:
      "Establishments primarily engaged in preparing and serving meals for immediate consumption using cafeteria-style serving equipment.",
    parentCode: "7225",
  },
  {
    code: "722515",
    title: "Snack and Nonalcoholic Beverage Bars",
    description:
      "Establishments primarily engaged in preparing and serving specialty snacks and nonalcoholic beverages for immediate consumption.",
    parentCode: "7225",
  },
  // Food Service Contractors
  {
    code: "722310",
    title: "Food Service Contractors",
    description:
      "Establishments primarily engaged in providing food services at institutional, governmental, commercial, or industrial locations.",
    parentCode: "7223",
  },
  // Caterers
  {
    code: "722320",
    title: "Caterers",
    description:
      "Establishments primarily engaged in providing single event-based food services.",
    parentCode: "7223",
  },
  // Mobile Food Services
  {
    code: "722330",
    title: "Mobile Food Services",
    description:
      "Establishments primarily engaged in preparing and serving meals from motorized vehicles or nonmotorized carts.",
    parentCode: "7223",
  },
  // Drinking Places
  {
    code: "722410",
    title: "Drinking Places (Alcoholic Beverages)",
    description:
      "Establishments known as bars, taverns, nightclubs, or drinking places primarily engaged in preparing and serving alcoholic beverages for immediate consumption.",
    parentCode: "7224",
  },
];

/**
 * Seed the naics_industries table with restaurant codes.
 * Idempotent: uses ON CONFLICT DO NOTHING to avoid duplicates.
 */
export async function seedRestaurantNaicsCodes(): Promise<void> {
  console.log("[naics-seed] Starting restaurant NAICS codes seed...");

  const values = RESTAURANT_NAICS_CODES.map((code) => ({
    code: code.code,
    title: code.title,
    description: code.description,
    parentCode: code.parentCode,
    vertical: "restaurant" as const,
    isActive: true,
  }));

  try {
    // Upsert: insert if not exists, update if exists
    for (const value of values) {
      await db
        .insert(naicsIndustries)
        .values(value)
        .onConflictDoNothing({ target: naicsIndustries.code });
    }

    console.log(
      `[naics-seed] Successfully seeded ${values.length} restaurant NAICS codes`
    );
  } catch (error) {
    console.error("[naics-seed] Failed to seed NAICS codes:", error);
    throw error;
  }
}

/**
 * Get the default NAICS code for a vertical.
 * For restaurants, returns 722511 (Full-Service Restaurants).
 */
export function getDefaultNaicsCode(vertical: string): string {
  const defaults: Record<string, string> = {
    restaurant: "722511", // Full-Service Restaurants (most common)
    "full-service": "722511",
    "quick-service": "722513",
    "fast-food": "722513",
    "fast-casual": "722513",
    cafeteria: "722514",
    cafe: "722515",
    "coffee-shop": "722515",
    bar: "722410",
    "food-truck": "722330",
    catering: "722320",
  };

  return defaults[vertical.toLowerCase()] || "722511";
}

/**
 * Validate that a NAICS code is a valid restaurant code.
 */
export function isValidRestaurantNaics(code: string): boolean {
  return RESTAURANT_NAICS_CODES.some((c) => c.code === code);
}

/**
 * Get all restaurant NAICS codes for querying.
 */
export function getAllRestaurantNaicsCodes(): string[] {
  return RESTAURANT_NAICS_CODES.map((c) => c.code);
}

// Export for direct use
export { RESTAURANT_NAICS_CODES };
