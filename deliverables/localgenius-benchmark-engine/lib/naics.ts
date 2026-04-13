/**
 * NAICS Code Mapping Utilities
 *
 * Spec: Phase 1 Plan, Task 1
 * Decision 7: NAICS Codes for Industry Categorization
 *
 * Maps LocalGenius verticals to NAICS codes for peer group matching.
 * V1 focuses on restaurants only (722xxx codes).
 */

/**
 * Valid restaurant NAICS codes (6-digit codes from NAICS 2022)
 */
export const RESTAURANT_NAICS_CODES = [
  "722511", // Full-Service Restaurants
  "722513", // Limited-Service Restaurants
  "722514", // Cafeterias, Grill Buffets, and Buffets
  "722515", // Snack and Nonalcoholic Beverage Bars
  "722310", // Food Service Contractors
  "722320", // Caterers
  "722330", // Mobile Food Services
  "722410", // Drinking Places (Alcoholic Beverages)
] as const;

export type RestaurantNaicsCode = (typeof RESTAURANT_NAICS_CODES)[number];

/**
 * Mapping from LocalGenius vertical to default NAICS code.
 * These are the most common mappings for v1 (restaurants only).
 */
const VERTICAL_TO_NAICS: Record<string, string> = {
  // Primary restaurant verticals
  restaurant: "722511", // Full-Service Restaurants (default)
  "full-service-restaurant": "722511",
  "full-service": "722511",
  "fine-dining": "722511",
  "casual-dining": "722511",

  // Quick service / Fast food
  "quick-service-restaurant": "722513",
  "quick-service": "722513",
  "fast-food": "722513",
  "fast-casual": "722513",
  qsr: "722513",

  // Cafes and coffee shops
  cafe: "722515",
  "coffee-shop": "722515",
  "coffee shop": "722515",
  bakery: "722515",
  "juice-bar": "722515",
  "smoothie-bar": "722515",

  // Cafeterias and buffets
  cafeteria: "722514",
  buffet: "722514",
  "grill-buffet": "722514",

  // Mobile and catering
  "food-truck": "722330",
  "food truck": "722330",
  foodtruck: "722330",
  "mobile-food": "722330",

  // Catering
  catering: "722320",
  caterer: "722320",
  "event-catering": "722320",

  // Contract food service
  "food-service-contractor": "722310",
  "institutional-food": "722310",
  "corporate-dining": "722310",

  // Bars and nightlife
  bar: "722410",
  pub: "722410",
  tavern: "722410",
  nightclub: "722410",
  "sports-bar": "722410",
  "wine-bar": "722410",
  brewery: "722410",
  "craft-beer": "722410",
};

/**
 * Human-readable names for NAICS codes.
 * Used in UI for peer group display.
 */
const NAICS_NAMES: Record<string, string> = {
  "722511": "Full-Service Restaurants",
  "722513": "Limited-Service Restaurants",
  "722514": "Cafeterias, Buffets",
  "722515": "Snack & Beverage Bars",
  "722310": "Food Service Contractors",
  "722320": "Caterers",
  "722330": "Mobile Food Services",
  "722410": "Bars & Drinking Places",
};

/**
 * Get the NAICS code for a LocalGenius vertical.
 * Returns the default restaurant code (722511) if no mapping exists.
 *
 * @param vertical - The LocalGenius vertical (e.g., "restaurant", "cafe")
 * @returns 6-digit NAICS code
 */
export function getNaicsCode(vertical: string): string {
  const normalized = vertical.toLowerCase().trim();
  return VERTICAL_TO_NAICS[normalized] || "722511";
}

/**
 * Get the human-readable name for a NAICS code.
 *
 * @param code - 6-digit NAICS code
 * @returns Human-readable industry name
 */
export function getNaicsName(code: string): string {
  return NAICS_NAMES[code] || "Restaurant";
}

/**
 * Check if a NAICS code is a valid restaurant code.
 *
 * @param code - NAICS code to validate
 * @returns true if the code is a valid restaurant NAICS
 */
export function isValidRestaurantNaics(code: string): boolean {
  return (RESTAURANT_NAICS_CODES as readonly string[]).includes(code);
}

/**
 * Get all restaurant NAICS codes for database queries.
 */
export function getAllRestaurantNaicsCodes(): string[] {
  return [...RESTAURANT_NAICS_CODES];
}

/**
 * Attempt to infer NAICS code from business metadata.
 * Looks at various fields to make the best guess.
 *
 * @param business - Business object with potential metadata
 * @returns Inferred NAICS code or default
 */
export function inferNaicsCode(business: {
  vertical?: string | null;
  type?: string | null;
  category?: string | null;
  tags?: string[] | null;
  metadata?: Record<string, unknown> | null;
}): string {
  // Try direct vertical mapping first
  if (business.vertical) {
    const code = VERTICAL_TO_NAICS[business.vertical.toLowerCase().trim()];
    if (code) return code;
  }

  // Try type field
  if (business.type) {
    const code = VERTICAL_TO_NAICS[business.type.toLowerCase().trim()];
    if (code) return code;
  }

  // Try category field
  if (business.category) {
    const code = VERTICAL_TO_NAICS[business.category.toLowerCase().trim()];
    if (code) return code;
  }

  // Try tags
  if (business.tags && Array.isArray(business.tags)) {
    for (const tag of business.tags) {
      const code = VERTICAL_TO_NAICS[tag.toLowerCase().trim()];
      if (code) return code;
    }
  }

  // Check metadata for clues
  if (business.metadata && typeof business.metadata === "object") {
    const meta = business.metadata as Record<string, unknown>;

    // Check for explicit NAICS code in metadata
    if (typeof meta.naics_code === "string" && isValidRestaurantNaics(meta.naics_code)) {
      return meta.naics_code;
    }

    // Check for business_type
    if (typeof meta.business_type === "string") {
      const code = VERTICAL_TO_NAICS[meta.business_type.toLowerCase().trim()];
      if (code) return code;
    }

    // Check for cuisine type (may indicate full vs limited service)
    if (typeof meta.cuisine === "string") {
      const cuisine = meta.cuisine.toLowerCase();
      if (cuisine.includes("fast") || cuisine.includes("quick")) {
        return "722513";
      }
    }

    // Check for service style
    if (typeof meta.service_style === "string") {
      const style = meta.service_style.toLowerCase();
      if (style.includes("full") || style.includes("table")) {
        return "722511";
      }
      if (style.includes("counter") || style.includes("quick")) {
        return "722513";
      }
    }
  }

  // Default to Full-Service Restaurants
  return "722511";
}

/**
 * Get suggested NAICS codes based on partial input.
 * Used for typeahead/autocomplete in admin interfaces.
 *
 * @param query - Partial input to match against
 * @returns Array of matching codes with names
 */
export function suggestNaicsCodes(
  query: string
): Array<{ code: string; name: string }> {
  const normalized = query.toLowerCase().trim();

  if (!normalized) {
    // Return all restaurant codes if no query
    return RESTAURANT_NAICS_CODES.map((code) => ({
      code,
      name: NAICS_NAMES[code],
    }));
  }

  const results: Array<{ code: string; name: string }> = [];

  // Check if query matches code prefix
  for (const code of RESTAURANT_NAICS_CODES) {
    if (code.startsWith(normalized)) {
      results.push({ code, name: NAICS_NAMES[code] });
    }
  }

  // Check if query matches name
  for (const [code, name] of Object.entries(NAICS_NAMES)) {
    if (
      name.toLowerCase().includes(normalized) &&
      !results.some((r) => r.code === code)
    ) {
      results.push({ code, name });
    }
  }

  // Check vertical mappings
  for (const [vertical, code] of Object.entries(VERTICAL_TO_NAICS)) {
    if (
      vertical.includes(normalized) &&
      !results.some((r) => r.code === code)
    ) {
      results.push({ code, name: NAICS_NAMES[code] });
    }
  }

  return results;
}
