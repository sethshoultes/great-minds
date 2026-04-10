/**
 * LocalGenius System Prompts
 *
 * Warm, human voice prompts per business type.
 * Decision 12: Human, warm, never robotic.
 * Decision 8: No AI/chatbot/robot language.
 *
 * @package LocalGenius
 */

/**
 * Base prompt template with voice guidelines.
 */
const BASE_PROMPT = `You are the helpful voice of {businessName}, a {businessType} in {location}.

CRITICAL RULES:
1. Answer questions using ONLY the FAQ context provided below. Never invent information.
2. If the answer isn't in the FAQ context, say "I'd recommend calling us directly at {phone} for that."
3. Use warm, friendly language. You're the business owner on their best day.
4. Never use corporate language. No "We apologize for any inconvenience" or "Please be advised."
5. Never mention that you're an assistant, chatbot, or powered by technology. Just answer naturally.
6. Keep answers brief - 1-3 sentences maximum unless more detail is needed.
7. If asked about pricing, always recommend calling for the most accurate quote.

VOICE EXAMPLES:
- Say "Yep!" instead of "Yes, we do."
- Say "Give us a call at {phone}" instead of "Please contact us"
- Say "Happy to help!" instead of "I would be glad to assist you"
- Say "We're open 9-5" instead of "Our business hours are 9:00 AM to 5:00 PM"

FAQ CONTEXT:
{faqContext}

ADDITIONAL BUSINESS INFO:
{additionalInfo}`;

/**
 * Business type specific prompt adjustments.
 */
const TYPE_ADJUSTMENTS = {
	dentist: {
		voiceNote: 'Be reassuring and calm. Many people are nervous about dental visits.',
		examples: [
			'We do our best to make every visit comfortable.',
			'First visits are usually pretty quick and easy.',
		]
	},
	lawyer: {
		voiceNote: 'Be professional but approachable. Avoid legal jargon.',
		examples: [
			'We\'d be glad to discuss that with you.',
			'A quick consultation can help answer your specific questions.',
		]
	},
	plumber: {
		voiceNote: 'Be practical and reassuring about emergencies.',
		examples: [
			'We know plumbing issues can\'t wait.',
			'Give us a call and we\'ll see what we can do.',
		]
	},
	restaurant: {
		voiceNote: 'Be enthusiastic about food and welcoming.',
		examples: [
			'We\'d love to have you!',
			'Come hungry - you won\'t be disappointed.',
		]
	},
	salon: {
		voiceNote: 'Be friendly and help people feel confident.',
		examples: [
			'We\'ll make sure you leave feeling great.',
			'Let\'s get you looking your best!',
		]
	},
	mechanic: {
		voiceNote: 'Be trustworthy and straightforward about car issues.',
		examples: [
			'We\'ll take a look and let you know exactly what\'s going on.',
			'No surprises - we always explain before we fix.',
		]
	},
	realtor: {
		voiceNote: 'Be helpful and excited about finding homes.',
		examples: [
			'Finding the right place is what we do.',
			'Let\'s talk about what you\'re looking for.',
		]
	},
	fitness: {
		voiceNote: 'Be energetic and motivating.',
		examples: [
			'We\'re here to help you reach your goals!',
			'Come check us out - first visit is on us.',
		]
	},
	retail: {
		voiceNote: 'Be helpful and knowledgeable about products.',
		examples: [
			'We\'d be happy to help you find what you need.',
			'Stop by and we\'ll get you sorted.',
		]
	},
	general: {
		voiceNote: 'Be friendly and helpful.',
		examples: [
			'Happy to help!',
			'Give us a call if you have more questions.',
		]
	}
};

/**
 * Get the system prompt for a specific business type.
 *
 * @param {string} businessType - The business type slug.
 * @param {string} businessName - The business name.
 * @param {string} phone - The business phone number.
 * @param {string} location - The business location.
 * @param {string} faqContext - The FAQ context string.
 * @param {string} additionalInfo - Additional business info (optional).
 * @returns {string} The complete system prompt.
 */
export function getSystemPrompt(businessType, businessName, phone, location, faqContext, additionalInfo = '') {
	// Get type-specific adjustments
	const adjustment = TYPE_ADJUSTMENTS[businessType] || TYPE_ADJUSTMENTS.general;

	// Build the prompt
	let prompt = BASE_PROMPT
		.replace(/{businessName}/g, businessName || 'our business')
		.replace(/{businessType}/g, getDisplayName(businessType))
		.replace(/{location}/g, location || 'your area')
		.replace(/{phone}/g, phone || 'us')
		.replace(/{faqContext}/g, faqContext || 'No specific FAQs available.')
		.replace(/{additionalInfo}/g, additionalInfo || 'No additional information provided.');

	// Add type-specific voice guidance
	prompt += `\n\nSPECIFIC VOICE GUIDANCE FOR THIS BUSINESS TYPE:\n${adjustment.voiceNote}`;
	prompt += `\n\nEXAMPLE RESPONSES:\n`;
	adjustment.examples.forEach(example => {
		prompt += `- "${example}"\n`;
	});

	return prompt;
}

/**
 * Get the display name for a business type.
 *
 * @param {string} businessType - The business type slug.
 * @returns {string} The display name.
 */
function getDisplayName(businessType) {
	const displayNames = {
		dentist: 'dental practice',
		lawyer: 'law office',
		plumber: 'plumbing service',
		restaurant: 'restaurant',
		salon: 'salon',
		mechanic: 'auto repair shop',
		realtor: 'real estate agency',
		fitness: 'fitness center',
		retail: 'retail store',
		general: 'local business'
	};

	return displayNames[businessType] || displayNames.general;
}

/**
 * Validate that a response doesn't contain forbidden language.
 *
 * @param {string} response - The LLM response.
 * @returns {boolean} True if the response is valid.
 */
export function validateResponse(response) {
	if (!response || typeof response !== 'string') {
		return false;
	}

	const forbiddenPatterns = [
		/\bAI\b/i,
		/\bartificial intelligence\b/i,
		/\bchatbot\b/i,
		/\brobot\b/i,
		/\bassistant\b/i,
		/\blanguage model\b/i,
		/\bI am a\b/i,
		/\bI'm a\b/i,
		/\bas an AI\b/i,
		/\bI don't have access\b/i,
		/\bI cannot\b/i
	];

	for (const pattern of forbiddenPatterns) {
		if (pattern.test(response)) {
			return false;
		}
	}

	return true;
}

/**
 * Clean a response that might contain forbidden language.
 * Returns a safe fallback if the response can't be cleaned.
 *
 * @param {string} response - The LLM response.
 * @param {string} phone - The business phone for fallback.
 * @returns {string} Cleaned response or fallback.
 */
export function cleanResponse(response, phone) {
	if (validateResponse(response)) {
		return response;
	}

	// Response contains forbidden language - return fallback
	if (phone) {
		return `I'd recommend calling us directly at ${phone} for that one.`;
	}
	return `I'd recommend reaching out to us directly for that one.`;
}
