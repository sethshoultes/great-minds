/**
 * Slug Generation and Validation Utilities
 *
 * Handles URL-safe slug generation for subdomain creation, validation, and uniqueness checking.
 * Slugs are used in subdomain URLs like {slug}.localgenius.site
 *
 * Slug Rules:
 * - 3-50 characters
 * - Lowercase alphanumeric + hyphens only
 * - No leading or trailing hyphens
 * - Must be unique in D1 database
 *
 * @example
 * ```typescript
 * const slug = generateSlug("Maria's Kitchen", "Austin");
 * // → "marias-kitchen-austin"
 *
 * if (validateSlug(slug)) {
 *   const isUnique = await isSlugUnique(slug);
 *   if (isUnique) {
 *     // Safe to use for subdomain
 *   }
 * }
 * ```
 */

import { d1Query } from './cloudflare-api';

/**
 * Generate a URL-safe slug from a business name and city.
 *
 * Handles special characters, apostrophes, and spacing automatically.
 * If the result exceeds 50 characters, intelligently truncates while
 * avoiding mid-word cuts and trailing hyphens.
 *
 * @param businessName - Business name (e.g., "Maria's Kitchen & Café")
 * @param city - City name (e.g., "Austin, TX")
 * @returns URL-safe slug (3-50 chars)
 *
 * @example
 * ```typescript
 * generateSlug("McDonald's", "New York") → "mcdonalds-new-york"
 * generateSlug("AT&T Services", "Los Angeles") → "att-services-los-angeles"
 * generateSlug("José's Tacos", "San Francisco") → "joses-tacos-san-francisco"
 * ```
 */
export function generateSlug(businessName: string, city: string): string {
  if (!businessName || !city) {
    throw new Error('Business name and city are required for slug generation');
  }

  // Combine name and city
  const combined = `${businessName} ${city}`;

  // Normalize: lowercase, remove accents
  const normalized = combined
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, ''); // Remove diacritical marks

  // Remove apostrophes and special characters, keep hyphens and alphanumerics
  const cleaned = normalized
    .replace(/['']/g, '') // Apostrophes → removed
    .replace(/[&]/g, 'and') // & → 'and'
    .replace(/[^a-z0-9\s-]/g, ''); // Remove all other special chars

  // Replace spaces with hyphens
  let slug = cleaned
    .replace(/\s+/g, '-') // Multiple spaces → single hyphen
    .replace(/-+/g, '-') // Multiple hyphens → single hyphen
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens

  // Enforce 50 character max
  if (slug.length > 50) {
    // Truncate to 50, but avoid cutting in the middle of a word
    slug = slug.substring(0, 50);

    // If we cut mid-word (last char is not hyphen), find last hyphen and cut there
    if (slug[slug.length - 1] !== '-') {
      const lastHyphenIndex = slug.lastIndexOf('-');
      if (lastHyphenIndex > 2) {
        // Keep at least 3 chars
        slug = slug.substring(0, lastHyphenIndex);
      }
    }

    // Clean trailing hyphens
    slug = slug.replace(/-+$/, '');
  }

  // Ensure minimum length (3 characters)
  if (slug.length < 3) {
    throw new Error(
      `Generated slug is too short (${slug.length} chars). Business name and city combination must be at least 3 characters.`
    );
  }

  return slug;
}

/**
 * Validate slug format and rules.
 *
 * Checks:
 * - Length: 3-50 characters
 * - Characters: lowercase alphanumeric + hyphens only
 * - No leading or trailing hyphens
 * - Does NOT check uniqueness (use isSlugUnique for that)
 *
 * @param slug - Slug to validate
 * @returns true if valid, false otherwise
 *
 * @example
 * ```typescript
 * validateSlug("valid-slug") → true
 * validateSlug("in") → false (too short)
 * validateSlug("Invalid_Slug") → false (contains underscore)
 * validateSlug("-invalid") → false (leading hyphen)
 * ```
 */
export function validateSlug(slug: string): boolean {
  if (!slug || typeof slug !== 'string') {
    return false;
  }

  // Check length: 3-50 characters
  if (slug.length < 3 || slug.length > 50) {
    return false;
  }

  // Check characters: lowercase alphanumeric + hyphens only
  if (!/^[a-z0-9-]+$/.test(slug)) {
    return false;
  }

  // Check no leading/trailing hyphens
  if (slug.startsWith('-') || slug.endsWith('-')) {
    return false;
  }

  // Check no double hyphens
  if (slug.includes('--')) {
    return false;
  }

  return true;
}

/**
 * Check if a slug is unique in the D1 database.
 *
 * Queries the sites table to ensure no other site uses this slug.
 * This is essential before provisioning a new site.
 *
 * @param slug - Slug to check
 * @returns true if unique, false if already taken
 * @throws Error if database query fails
 *
 * @example
 * ```typescript
 * const slug = "acme-pizza-sf";
 * if (await isSlugUnique(slug)) {
 *   // Safe to create site with this slug
 * } else {
 *   // Slug already exists, suggest alternative
 * }
 * ```
 */
export async function isSlugUnique(slug: string): Promise<boolean> {
  try {
    const result = await d1Query('SELECT COUNT(*) as count FROM sites WHERE site_id = ?', [
      slug,
    ]);

    if (!result.success || !result.results || result.results.length === 0) {
      throw new Error('Failed to check slug uniqueness');
    }

    const count = (result.results[0] as Record<string, unknown>)?.count || 0;
    return count === 0;
  } catch (error) {
    throw new Error(
      `Slug uniqueness check failed: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * Generate a unique slug with retry logic.
 *
 * If the generated slug already exists, appends a numeric suffix (e.g., "-1", "-2")
 * and checks again. Useful for handling name collisions.
 *
 * @param businessName - Business name
 * @param city - City name
 * @param maxRetries - Maximum retry attempts (default: 10)
 * @returns Guaranteed-unique slug, or throws after max retries
 * @throws Error if unable to generate unique slug after max retries
 *
 * @example
 * ```typescript
 * // First attempt: "marias-kitchen-austin"
 * // If taken, tries: "marias-kitchen-austin-1", "marias-kitchen-austin-2", etc.
 * const slug = await generateUniqueSlug("Maria's Kitchen", "Austin");
 * ```
 */
export async function generateUniqueSlug(
  businessName: string,
  city: string,
  maxRetries: number = 10
): Promise<string> {
  // Generate base slug
  let slug = generateSlug(businessName, city);

  // Check if it's unique
  if (await isSlugUnique(slug)) {
    return slug;
  }

  // Retry with numeric suffixes
  for (let i = 1; i <= maxRetries; i++) {
    // Preserve up to 45 chars of base slug, add "-{i}"
    const basePart = slug.substring(0, Math.min(45, slug.length));
    const candidateSlug = `${basePart}-${i}`;

    if (validateSlug(candidateSlug) && (await isSlugUnique(candidateSlug))) {
      return candidateSlug;
    }
  }

  throw new Error(
    `Unable to generate unique slug for "${businessName}" in "${city}" after ${maxRetries} attempts. All candidates already exist.`
  );
}

/**
 * Suggest alternative slugs if the primary is taken.
 *
 * Returns a list of alternative slugs with numeric suffixes.
 * Useful for UI feedback when slug collision occurs.
 *
 * @param baseSlug - Base slug that's already taken
 * @param count - Number of suggestions (default: 3)
 * @returns Array of alternative slug suggestions
 *
 * @example
 * ```typescript
 * const alternatives = suggestAlternateSlug("acme-pizza", 3);
 * // → ["acme-pizza-1", "acme-pizza-2", "acme-pizza-3"]
 * ```
 */
export function suggestAlternateSlug(baseSlug: string, count: number = 3): string[] {
  const suggestions: string[] = [];
  const basePart = baseSlug.substring(0, Math.min(45, baseSlug.length));

  for (let i = 1; i <= count; i++) {
    const candidate = `${basePart}-${i}`;
    if (validateSlug(candidate)) {
      suggestions.push(candidate);
    }
  }

  return suggestions;
}

export default {
  generateSlug,
  validateSlug,
  isSlugUnique,
  generateUniqueSlug,
  suggestAlternateSlug,
};
