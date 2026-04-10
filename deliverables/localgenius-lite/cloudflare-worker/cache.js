/**
 * LocalGenius Cache Module
 *
 * Question normalization and KV-based caching.
 * Decision 6: Cache before LLM - always. 24h TTL.
 * Target: 80% cache hit rate.
 *
 * @package LocalGenius
 */

/**
 * Normalize a question for cache key generation.
 * Collapses variations to canonical forms.
 *
 * @param {string} question - The user's question.
 * @returns {string} Normalized question.
 */
export function normalizeQuestion(question) {
	if (!question || typeof question !== 'string') {
		return '';
	}

	let normalized = question
		.toLowerCase()
		.trim()
		// Remove punctuation except apostrophes
		.replace(/[^\w\s']/g, '')
		// Collapse multiple spaces
		.replace(/\s+/g, ' ');

	// Map common variations to canonical questions
	normalized = mapToCanonical(normalized);

	return normalized;
}

/**
 * Map question variations to canonical forms.
 * This dramatically improves cache hit rates.
 *
 * @param {string} question - Normalized question.
 * @returns {string} Canonical question.
 */
function mapToCanonical(question) {
	// Hours variations
	const hoursPatterns = [
		'hours',
		'when open',
		'when are you open',
		'what time',
		'are you open',
		'open today',
		'open now',
		'what are your hours',
		'whats your hours',
		'operating hours',
		'business hours',
		'store hours',
		'office hours'
	];
	for (const pattern of hoursPatterns) {
		if (question.includes(pattern)) {
			return 'what are your hours';
		}
	}

	// Location variations
	const locationPatterns = [
		'where are you',
		'where is',
		'address',
		'directions',
		'how to find',
		'located',
		'location',
		'find you',
		'where you at'
	];
	for (const pattern of locationPatterns) {
		if (question.includes(pattern)) {
			return 'where are you located';
		}
	}

	// Contact variations
	const contactPatterns = [
		'phone',
		'call',
		'contact',
		'reach',
		'number',
		'phone number',
		'get in touch',
		'email',
		'contact you'
	];
	for (const pattern of contactPatterns) {
		if (question.includes(pattern)) {
			return 'how can i contact you';
		}
	}

	// Parking variations
	const parkingPatterns = [
		'parking',
		'where to park',
		'park my car',
		'parking lot',
		'parking available'
	];
	for (const pattern of parkingPatterns) {
		if (question.includes(pattern)) {
			return 'do you have parking';
		}
	}

	// Appointment variations
	const appointmentPatterns = [
		'appointment',
		'schedule',
		'book',
		'booking',
		'reservation',
		'reserve'
	];
	for (const pattern of appointmentPatterns) {
		if (question.includes(pattern)) {
			return 'do you take appointments';
		}
	}

	// Payment variations
	const paymentPatterns = [
		'payment',
		'pay',
		'credit card',
		'cash',
		'accept',
		'payment methods',
		'how can i pay'
	];
	for (const pattern of paymentPatterns) {
		if (question.includes(pattern)) {
			return 'what payment methods do you accept';
		}
	}

	return question;
}

/**
 * Generate a hash for the cache key.
 * Uses Web Crypto API for SHA-256.
 *
 * @param {string} normalized - Normalized question.
 * @returns {Promise<string>} Hash string.
 */
export async function hashQuestion(normalized) {
	const encoder = new TextEncoder();
	const data = encoder.encode(normalized);
	const hashBuffer = await crypto.subtle.digest('SHA-256', data);
	const hashArray = Array.from(new Uint8Array(hashBuffer));
	const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
	return hashHex.substring(0, 16); // Use first 16 chars for brevity
}

/**
 * Build the cache key.
 *
 * @param {string} siteId - The site identifier.
 * @param {string} questionHash - The hashed question.
 * @returns {string} Cache key.
 */
export function buildCacheKey(siteId, questionHash) {
	return `answer:${siteId}:${questionHash}`;
}

/**
 * Get cached response from KV.
 *
 * @param {Object} env - Worker environment with CACHE binding.
 * @param {string} siteId - The site identifier.
 * @param {string} questionHash - The hashed question.
 * @returns {Promise<Object|null>} Cached response or null.
 */
export async function getCached(env, siteId, questionHash) {
	try {
		const key = buildCacheKey(siteId, questionHash);
		const cached = await env.CACHE.get(key, { type: 'json' });

		if (cached) {
			// Log cache hit for metrics
			await logCacheMetric(env, siteId, true);
			return cached;
		}

		return null;
	} catch (error) {
		// Fail open - if cache fails, proceed to LLM
		return null;
	}
}

/**
 * Store response in cache with TTL.
 *
 * @param {Object} env - Worker environment with CACHE binding.
 * @param {string} siteId - The site identifier.
 * @param {string} questionHash - The hashed question.
 * @param {Object} response - The response to cache.
 * @returns {Promise<void>}
 */
export async function setCached(env, siteId, questionHash, response) {
	try {
		const key = buildCacheKey(siteId, questionHash);
		const ttl = parseInt(env.CACHE_TTL_SECONDS || '86400', 10);

		await env.CACHE.put(key, JSON.stringify(response), {
			expirationTtl: ttl
		});
	} catch (error) {
		// Fail silently - cache write failure shouldn't break the response
	}
}

/**
 * Log cache metrics for monitoring.
 *
 * @param {Object} env - Worker environment.
 * @param {string} siteId - The site identifier.
 * @param {boolean} hit - Whether this was a cache hit.
 * @returns {Promise<void>}
 */
async function logCacheMetric(env, siteId, hit) {
	// Simple metrics logging - can be extended for analytics
	const now = new Date();
	const monthKey = `metrics:${siteId}:${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

	try {
		const metrics = await env.CACHE.get(monthKey, { type: 'json' }) || {
			hits: 0,
			misses: 0,
			total: 0
		};

		if (hit) {
			metrics.hits++;
		} else {
			metrics.misses++;
		}
		metrics.total++;

		await env.CACHE.put(monthKey, JSON.stringify(metrics), {
			expirationTtl: 2678400 // 31 days
		});
	} catch (error) {
		// Metrics are non-critical
	}
}
