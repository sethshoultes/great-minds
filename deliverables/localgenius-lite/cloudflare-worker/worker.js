/**
 * LocalGenius Cloudflare Worker
 *
 * Main entry point for the LocalGenius chat API.
 * Decision 2: Single LLM path - Llama 3.1 8B only via Workers AI.
 * Decision 6: Cache before LLM - always.
 *
 * @package LocalGenius
 */

import { normalizeQuestion, hashQuestion, getCached, setCached } from './cache.js';
import { getSystemPrompt, cleanResponse } from './prompts.js';

/**
 * Main fetch handler.
 */
export default {
	async fetch(request, env, ctx) {
		// Handle CORS preflight
		if (request.method === 'OPTIONS') {
			return handleCORS();
		}

		// Only accept POST to /api/chat
		const url = new URL(request.url);
		if (request.method !== 'POST' || !url.pathname.endsWith('/api/chat')) {
			return new Response('Not Found', { status: 404 });
		}

		// Parse request body
		let body;
		try {
			body = await request.json();
		} catch (error) {
			return jsonResponse({ error: 'Invalid JSON' }, 400);
		}

		// Validate required fields
		const { question, businessType, location, siteId, businessName, phone, faqContext, additionalInfo } = body;

		if (!question || typeof question !== 'string' || question.length > 500) {
			return jsonResponse({ error: 'Invalid question' }, 400);
		}

		if (!siteId) {
			return jsonResponse({ error: 'Site ID required' }, 400);
		}

		// Check rate limits
		const rateLimitResult = await checkRateLimit(env, siteId, request);
		if (!rateLimitResult.allowed) {
			return jsonResponse({
				answer: rateLimitResult.message,
				source: 'rate_limit',
				timestamp: new Date().toISOString()
			}, 429, {
				'X-RateLimit-Limit': rateLimitResult.limit,
				'X-RateLimit-Remaining': '0'
			});
		}

		// Normalize question and check cache
		const normalized = normalizeQuestion(question);
		const questionHash = await hashQuestion(normalized);

		const cached = await getCached(env, siteId, questionHash);
		if (cached) {
			return jsonResponse({
				answer: cached.answer,
				source: 'cached',
				timestamp: new Date().toISOString()
			}, 200, {
				'X-RateLimit-Limit': rateLimitResult.limit,
				'X-RateLimit-Remaining': String(rateLimitResult.remaining)
			});
		}

		// Cache miss - call LLM
		try {
			const answer = await callLLM(env, {
				question,
				businessType: businessType || 'general',
				location: location || '',
				businessName: businessName || '',
				phone: phone || '',
				faqContext: faqContext || '',
				additionalInfo: additionalInfo || ''
			});

			// Clean and validate the response
			const cleanedAnswer = cleanResponse(answer, phone);

			// Cache the response
			await setCached(env, siteId, questionHash, { answer: cleanedAnswer });

			// Increment rate limit counter
			await incrementRateLimit(env, siteId);

			return jsonResponse({
				answer: cleanedAnswer,
				source: 'llm',
				timestamp: new Date().toISOString()
			}, 200, {
				'X-RateLimit-Limit': rateLimitResult.limit,
				'X-RateLimit-Remaining': String(rateLimitResult.remaining - 1)
			});

		} catch (error) {
			// LLM failed - return graceful fallback
			const fallbackMessage = phone
				? `I'd recommend calling us directly at ${phone} for this one.`
				: `I'd recommend reaching out to us directly for this one.`;

			return jsonResponse({
				answer: fallbackMessage,
				source: 'fallback',
				timestamp: new Date().toISOString()
			}, 200, {
				'X-RateLimit-Limit': rateLimitResult.limit,
				'X-RateLimit-Remaining': String(rateLimitResult.remaining)
			});
		}
	}
};

/**
 * Call Llama 3.1 8B via Workers AI with timeout.
 *
 * @param {Object} env - Worker environment.
 * @param {Object} params - Request parameters.
 * @returns {Promise<string>} The LLM response.
 */
async function callLLM(env, params) {
	const { question, businessType, location, businessName, phone, faqContext, additionalInfo } = params;

	// Build system prompt
	const systemPrompt = getSystemPrompt(
		businessType,
		businessName,
		phone,
		location,
		faqContext,
		additionalInfo
	);

	// Race LLM call against timeout (3 seconds per Decision)
	const llmPromise = env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
		messages: [
			{ role: 'system', content: systemPrompt },
			{ role: 'user', content: question }
		],
		max_tokens: 256,
		temperature: 0.7
	});

	const timeoutPromise = new Promise((_, reject) => {
		setTimeout(() => reject(new Error('LLM timeout')), 3000);
	});

	const result = await Promise.race([llmPromise, timeoutPromise]);

	if (!result || !result.response) {
		throw new Error('Invalid LLM response');
	}

	return result.response;
}

/**
 * Check rate limits for a site and IP.
 *
 * @param {Object} env - Worker environment.
 * @param {string} siteId - The site identifier.
 * @param {Request} request - The incoming request.
 * @returns {Promise<Object>} Rate limit status.
 */
async function checkRateLimit(env, siteId, request) {
	const limit = parseInt(env.MONTHLY_QUESTION_LIMIT || '100', 10);
	const now = new Date();
	const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

	// Check per-site monthly limit
	const siteKey = `ratelimit:${siteId}:${month}`;
	let count = 0;

	try {
		const stored = await env.CACHE.get(siteKey);
		count = stored ? parseInt(stored, 10) : 0;
	} catch (error) {
		// Fail open on cache errors
	}

	if (count >= limit) {
		return {
			allowed: false,
			message: "We've reached our monthly limit for questions. Please call us directly or check back next month!",
			limit: String(limit),
			remaining: 0
		};
	}

	// Check IP-based throttling (1 request per 2 seconds)
	const clientIP = request.headers.get('CF-Connecting-IP') || 'unknown';
	const ipKey = `ip:${clientIP}`;

	try {
		const lastRequest = await env.CACHE.get(ipKey);
		if (lastRequest) {
			const elapsed = Date.now() - parseInt(lastRequest, 10);
			if (elapsed < 2000) {
				return {
					allowed: false,
					message: 'Please wait a moment before asking another question.',
					limit: String(limit),
					remaining: limit - count
				};
			}
		}

		// Update IP timestamp
		await env.CACHE.put(ipKey, String(Date.now()), { expirationTtl: 10 });
	} catch (error) {
		// Fail open on cache errors
	}

	return {
		allowed: true,
		limit: String(limit),
		remaining: limit - count
	};
}

/**
 * Increment the rate limit counter for a site.
 *
 * @param {Object} env - Worker environment.
 * @param {string} siteId - The site identifier.
 * @returns {Promise<void>}
 */
async function incrementRateLimit(env, siteId) {
	const now = new Date();
	const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
	const siteKey = `ratelimit:${siteId}:${month}`;

	try {
		const stored = await env.CACHE.get(siteKey);
		const count = stored ? parseInt(stored, 10) + 1 : 1;

		// 32-day TTL ensures cleanup after month ends
		await env.CACHE.put(siteKey, String(count), { expirationTtl: 2764800 });
	} catch (error) {
		// Non-critical - continue even if counter fails
	}
}

/**
 * Handle CORS preflight requests.
 *
 * @returns {Response} CORS preflight response.
 */
function handleCORS() {
	return new Response(null, {
		status: 204,
		headers: {
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Methods': 'POST, OPTIONS',
			'Access-Control-Allow-Headers': 'Content-Type, X-WP-Nonce',
			'Access-Control-Max-Age': '86400'
		}
	});
}

/**
 * Create a JSON response with CORS headers.
 *
 * @param {Object} data - Response data.
 * @param {number} status - HTTP status code.
 * @param {Object} additionalHeaders - Additional headers.
 * @returns {Response} JSON response.
 */
function jsonResponse(data, status = 200, additionalHeaders = {}) {
	return new Response(JSON.stringify(data), {
		status,
		headers: {
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Methods': 'POST, OPTIONS',
			'Access-Control-Allow-Headers': 'Content-Type, X-WP-Nonce',
			...additionalHeaders
		}
	});
}
