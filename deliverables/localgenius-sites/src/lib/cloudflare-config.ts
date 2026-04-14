/**
 * Cloudflare Configuration Module
 *
 * Centralized configuration for all Cloudflare API interactions (D1, R2, Workers, DNS).
 * Supports multi-account federation at 10K+ sites via parameterized accountId.
 *
 * Federation Strategy:
 * - Phase 1 (v1): Single account, parameterized for extensibility
 * - Phase 2 (10K+ sites): Terraform-managed federation, routing table by site_id
 * - All account IDs injected at deployment time via environment variables
 *
 * @see docs/federation-strategy.md
 */

/**
 * Validates and returns Cloudflare configuration.
 * Throws if required environment variables are missing.
 */
function validateCloudflareConfig() {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID?.trim();
  const apiToken = process.env.CLOUDFLARE_API_TOKEN?.trim();
  const d1DatabaseId = process.env.CLOUDFLARE_D1_DATABASE_ID?.trim();
  const r2BucketName = process.env.CLOUDFLARE_R2_BUCKET_NAME?.trim();

  const errors: string[] = [];

  if (!accountId) {
    errors.push(
      'CLOUDFLARE_ACCOUNT_ID is required. ' +
      'Set in .env or deploy environment. ' +
      'Get from Cloudflare dashboard: https://dash.cloudflare.com/?account=<id>'
    );
  }

  if (!apiToken) {
    errors.push(
      'CLOUDFLARE_API_TOKEN is required. ' +
      'Create a token with D1/R2/Workers/DNS permissions at ' +
      'https://dash.cloudflare.com/profile/api-tokens'
    );
  }

  if (!d1DatabaseId) {
    errors.push(
      'CLOUDFLARE_D1_DATABASE_ID is required. ' +
      'Database ID for multi-tenant site data. ' +
      'Create via: wrangler d1 create localgenius-sites'
    );
  }

  if (!r2BucketName) {
    errors.push(
      'CLOUDFLARE_R2_BUCKET_NAME is required. ' +
      'Defaults to "localgenius-sites". ' +
      'Create via: wrangler r2 bucket create localgenius-sites'
    );
  }

  if (errors.length > 0) {
    throw new Error(
      `Cloudflare configuration validation failed:\n\n${errors.join('\n\n')}`
    );
  }

  return {
    accountId,
    apiToken,
    d1DatabaseId,
    r2BucketName,
  };
}

/**
 * Cloudflare configuration object.
 * Validated at import time to fail fast if environment is misconfigured.
 */
export const cloudflareConfig = validateCloudflareConfig();

/**
 * Cloudflare API base URL for REST endpoints.
 * Used for provisioning: DNS records, D1 databases, R2 buckets, Workers.
 */
export const CLOUDFLARE_API_BASE_URL = 'https://api.cloudflare.com/client/v4';

/**
 * Returns the full URL for a Cloudflare API endpoint.
 *
 * @param path - API path (e.g., "/zones" or "/accounts/{accountId}/d1/database/{databaseId}")
 * @returns Full URL ready for fetch()
 */
export function getCloudflareApiUrl(path: string): string {
  return `${CLOUDFLARE_API_BASE_URL}${path}`;
}

/**
 * Returns standard headers for Cloudflare API requests.
 * Includes authorization and content-type.
 */
export function getCloudflareHeaders(): HeadersInit {
  return {
    'Authorization': `Bearer ${cloudflareConfig.apiToken}`,
    'Content-Type': 'application/json',
  };
}

/**
 * Type definitions for Cloudflare API responses.
 */
export interface CloudflareApiResponse<T> {
  success: boolean;
  errors: Array<{ code: number; message: string }>;
  messages: string[];
  result: T;
}

/**
 * Wrapper for Cloudflare API calls with error handling.
 *
 * @param endpoint - Full API endpoint URL
 * @param options - Fetch options (method, body, headers)
 * @returns Parsed API response with validation
 * @throws Error if API call fails or response indicates error
 */
export async function callCloudflareApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<CloudflareApiResponse<T>> {
  const response = await fetch(endpoint, {
    ...options,
    headers: {
      ...getCloudflareHeaders(),
      ...options.headers,
    },
  });

  const data: CloudflareApiResponse<T> = await response.json();

  if (!data.success) {
    const errorMessages = data.errors
      .map((e) => `[${e.code}] ${e.message}`)
      .join('; ');
    throw new Error(
      `Cloudflare API error: ${errorMessages || 'Unknown error'}`
    );
  }

  return data;
}

/**
 * Export configuration for use in API calls.
 * Example:
 *
 * ```typescript
 * import { cloudflareConfig, getCloudflareApiUrl, callCloudflareApi } from '@/lib/cloudflare-config';
 *
 * // Provision a D1 database
 * const response = await callCloudflareApi(
 *   getCloudflareApiUrl(`/accounts/${cloudflareConfig.accountId}/d1/database`),
 *   { method: 'POST', body: JSON.stringify({ name: 'sites-db' }) }
 * );
 * ```
 */
export default cloudflareConfig;
