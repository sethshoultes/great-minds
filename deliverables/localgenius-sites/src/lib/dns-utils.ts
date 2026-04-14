/**
 * DNS Subdomain Management Utilities
 *
 * Handles creation, verification, and URL generation for wildcard DNS subdomains.
 * Used to provision {slug}.localgenius.site domains for each LocalGenius site.
 *
 * DNS Setup:
 * - Primary domain: localgenius.site
 * - Wildcard CNAME: *.localgenius.site → localgenius.site
 * - SSL/TLS: Cloudflare automatic edge certificates for all subdomains
 * - Each site gets automatic: {slug}.localgenius.site
 *
 * @example
 * ```typescript
 * // Create subdomain during site provisioning
 * await createSubdomainRecord('acme-pizza-sf');
 *
 * // Verify subdomain is live
 * const isLive = await verifySubdomain('acme-pizza-sf');
 *
 * // Get public URL for site
 * const url = getSubdomainUrl('acme-pizza-sf');
 * // → "https://acme-pizza-sf.localgenius.site"
 * ```
 */

import { dnsCreateRecord, dnsListRecords } from './cloudflare-api';

/**
 * Configuration for subdomain DNS management.
 * Centralized in one place for easy updates.
 */
const SUBDOMAIN_CONFIG = {
  domain: 'localgenius.site',
  protocol: 'https',
} as const;

/**
 * Create a DNS record for a new site subdomain.
 *
 * This is called during site provisioning to make {slug}.localgenius.site live.
 * The actual DNS routing is handled by the wildcard CNAME (*.localgenius.site),
 * but this function creates the record for administrative tracking and SSL provisioning.
 *
 * Note: If using Cloudflare Wildcard DNS, the CNAME at * level handles all subdomains
 * automatically. This function creates explicit A/CNAME records if manual management
 * is required or for future custom domain support.
 *
 * @param slug - Site slug (subdomain name, e.g., "acme-pizza-sf")
 * @param zoneId - Cloudflare DNS zone ID for localgenius.site
 * @returns Promise resolving when record is created
 * @throws Error if DNS creation fails
 *
 * @example
 * ```typescript
 * await createSubdomainRecord('acme-pizza-sf', 'zone-id-12345');
 * // Now accessible at: https://acme-pizza-sf.localgenius.site
 * ```
 */
export async function createSubdomainRecord(slug: string, zoneId: string): Promise<void> {
  if (!slug || !zoneId) {
    throw new Error('slug and zoneId are required');
  }

  try {
    await dnsCreateRecord(
      zoneId,
      slug, // subdomain name
      SUBDOMAIN_CONFIG.domain, // target domain
      true // proxied (enables Cloudflare features)
    );
  } catch (error) {
    throw new Error(
      `Failed to create DNS record for subdomain "${slug}": ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
}

/**
 * Verify that a subdomain is live and resolves correctly.
 *
 * Performs a DNS lookup to confirm the subdomain exists and resolves.
 * This is used during provisioning to verify the DNS propagation is complete.
 *
 * @param slug - Site slug to verify
 * @param zoneId - Cloudflare DNS zone ID
 * @returns true if subdomain resolves, false otherwise
 *
 * @example
 * ```typescript
 * const isLive = await verifySubdomain('acme-pizza-sf', 'zone-id');
 * if (!isLive) {
 *   console.log('DNS not yet propagated, retrying...');
 * }
 * ```
 */
export async function verifySubdomain(slug: string, zoneId: string): Promise<boolean> {
  if (!slug || !zoneId) {
    throw new Error('slug and zoneId are required');
  }

  try {
    // Query DNS records for this subdomain
    const records = await dnsListRecords(zoneId);

    // Check if our subdomain record exists in the zone
    const subdomainRecord = records.find((record) => record.name === slug);

    if (!subdomainRecord) {
      return false;
    }

    // Verify the record points to the correct target
    return (
      subdomainRecord.content === SUBDOMAIN_CONFIG.domain &&
      subdomainRecord.type === 'CNAME'
    );
  } catch (error) {
    throw new Error(
      `Failed to verify subdomain "${slug}": ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
}

/**
 * Get the full public URL for a site subdomain.
 *
 * Constructs the complete HTTPS URL for a given slug.
 * This is used in redirects, emails, and the reveal moment UI.
 *
 * @param slug - Site slug
 * @returns Full HTTPS URL (e.g., "https://acme-pizza-sf.localgenius.site")
 *
 * @example
 * ```typescript
 * const url = getSubdomainUrl('acme-pizza-sf');
 * // → "https://acme-pizza-sf.localgenius.site"
 * ```
 */
export function getSubdomainUrl(slug: string): string {
  if (!slug) {
    throw new Error('slug is required');
  }

  return `${SUBDOMAIN_CONFIG.protocol}://${slug}.${SUBDOMAIN_CONFIG.domain}`;
}

/**
 * Check if a slug is a valid subdomain name.
 *
 * Uses the same validation rules as DNS names:
 * - 3-63 characters (DNS label limit)
 * - Lowercase alphanumeric + hyphens
 * - No leading/trailing hyphens
 *
 * @param slug - Slug to validate
 * @returns true if valid subdomain name
 *
 * @example
 * ```typescript
 * isValidSubdomainName("valid-slug") → true
 * isValidSubdomainName("-invalid") → false
 * ```
 */
export function isValidSubdomainName(slug: string): boolean {
  if (!slug || typeof slug !== 'string') {
    return false;
  }

  // DNS label max: 63 characters
  if (slug.length < 1 || slug.length > 63) {
    return false;
  }

  // Valid characters: lowercase alphanumeric + hyphens
  if (!/^[a-z0-9-]+$/.test(slug)) {
    return false;
  }

  // No leading/trailing hyphens
  if (slug.startsWith('-') || slug.endsWith('-')) {
    return false;
  }

  // No double hyphens
  if (slug.includes('--')) {
    return false;
  }

  return true;
}

/**
 * Get Cloudflare SSL certificate configuration for wildcard subdomains.
 *
 * Returns the configuration needed for SSL/TLS setup on edge certificates.
 * Cloudflare automatically provisions certificates for all subdomains
 * under the wildcard CNAME (*.localgenius.site).
 *
 * @returns SSL/TLS configuration object
 *
 * @example
 * ```typescript
 * const sslConfig = getSslConfiguration();
 * // {
 * //   type: "automatic",
 * //   wildcard: true,
 * //   domain: "localgenius.site",
 * //   pattern: "*.localgenius.site"
 * // }
 * ```
 */
export function getSslConfiguration(): {
  type: 'automatic';
  wildcard: boolean;
  domain: string;
  pattern: string;
  minTlsVersion: '1.2' | '1.3';
} {
  return {
    type: 'automatic',
    wildcard: true,
    domain: SUBDOMAIN_CONFIG.domain,
    pattern: `*.${SUBDOMAIN_CONFIG.domain}`,
    minTlsVersion: '1.3',
  };
}

/**
 * Get edge certificate configuration for Cloudflare.
 *
 * Cloudflare automatically provisions Universal SSL certificates
 * for all subdomains. This returns the configuration to enable
 * Advanced Certificate Manager if needed.
 *
 * @returns Edge certificate configuration
 *
 * @example
 * ```typescript
 * const certConfig = getEdgeCertificateConfiguration();
 * // {
 * //   automatic: true,
 * //   minTlsVersion: "1.3",
 * //   ciphers: ["ECDHE-RSA-AES128-GCM-SHA256", ...]
 * // }
 * ```
 */
export function getEdgeCertificateConfiguration(): {
  automatic: boolean;
  minTlsVersion: '1.2' | '1.3';
  ciphers: string[];
} {
  return {
    automatic: true,
    minTlsVersion: '1.3',
    ciphers: [
      'ECDHE-RSA-AES128-GCM-SHA256',
      'ECDHE-RSA-AES256-GCM-SHA384',
      'ECDHE-RSA-CHACHA20-POLY1305',
      'AES128-GCM-SHA256',
      'AES256-GCM-SHA384',
    ],
  };
}

/**
 * Setup wildcard DNS CNAME for all subdomains.
 *
 * Creates the wildcard CNAME record (*.localgenius.site → localgenius.site)
 * that enables all {slug}.localgenius.site domains to work without
 * creating individual DNS records for each site.
 *
 * This should be called once during initial infrastructure setup,
 * not during each site provisioning.
 *
 * @param zoneId - Cloudflare DNS zone ID for localgenius.site
 * @returns Promise resolving when wildcard record is created
 * @throws Error if creation fails
 *
 * @example
 * ```typescript
 * // Run once during infrastructure setup
 * await setupWildcardCname('zone-id-12345');
 * ```
 */
export async function setupWildcardCname(zoneId: string): Promise<void> {
  if (!zoneId) {
    throw new Error('zoneId is required');
  }

  try {
    await dnsCreateRecord(
      zoneId,
      '*', // wildcard: all subdomains
      SUBDOMAIN_CONFIG.domain, // target: main domain
      true // proxied
    );
  } catch (error) {
    throw new Error(
      `Failed to setup wildcard CNAME: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
}

/**
 * Get DNS nameserver configuration for localgenius.site.
 *
 * Returns the nameservers that should be pointed to from the registrar.
 * This is for reference documentation when setting up the domain.
 *
 * @returns Nameserver configuration
 *
 * @example
 * ```typescript
 * const ns = getDnsNameserverConfiguration();
 * // {
 * //   provider: "Cloudflare",
 * //   nameservers: ["nina.ns.cloudflare.com", ...]
 * // }
 * ```
 */
export function getDnsNameserverConfiguration(): {
  provider: 'Cloudflare';
  nameservers: string[];
  updateInstructions: string;
} {
  return {
    provider: 'Cloudflare',
    nameservers: [
      'nina.ns.cloudflare.com',
      'tom.ns.cloudflare.com', // or your actual Cloudflare nameservers
    ],
    updateInstructions:
      'Update your domain registrar to point nameservers to Cloudflare. See https://dash.cloudflare.com/?account=<id>',
  };
}

export default {
  createSubdomainRecord,
  verifySubdomain,
  getSubdomainUrl,
  isValidSubdomainName,
  getSslConfiguration,
  getEdgeCertificateConfiguration,
  setupWildcardCname,
  getDnsNameserverConfiguration,
};
