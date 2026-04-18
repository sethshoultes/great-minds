/**
 * Compass Event Tracker for Pinned
 *
 * Client-side event tracking library.
 * Sends events to Compass ingestion endpoint.
 *
 * Features:
 * - SHA-256 user hashing (no PII)
 * - Async POST (non-blocking)
 * - Opt-out mechanism
 * - <5ms overhead
 * - Silent failure (never breaks host app)
 *
 * Usage:
 *   import CompassTracker from './tracker.js';
 *   const tracker = new CompassTracker('pinned', 'https://yoursite.com/compass/src/ingest.php');
 *   tracker.trackEvent('note_created', { note_id: '123', word_count: 45 });
 */

class CompassTracker {
    /**
     * Initialize tracker
     * @param {string} product - Product identifier (e.g., 'pinned')
     * @param {string} ingestUrl - Compass ingestion endpoint URL
     * @param {object} options - Configuration options
     */
    constructor(product, ingestUrl, options = {}) {
        this.product = product;
        this.ingestUrl = ingestUrl;
        this.options = {
            enabled: true,
            debug: false,
            userIdKey: 'compass_user_id',
            optOutKey: 'compass_opt_out',
            sessionKey: 'compass_session_today',
            ...options
        };

        // Check opt-out status
        if (this.hasOptedOut()) {
            this.options.enabled = false;
            this.log('Tracking disabled: user opted out');
        }
    }

    /**
     * Check if user has opted out
     */
    hasOptedOut() {
        if (typeof localStorage === 'undefined') return false;
        return localStorage.getItem(this.options.optOutKey) === 'true';
    }

    /**
     * Allow user to opt out of tracking
     */
    optOut() {
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem(this.options.optOutKey, 'true');
        }
        this.options.enabled = false;
        this.log('User opted out of tracking');
    }

    /**
     * Allow user to opt back in
     */
    optIn() {
        if (typeof localStorage !== 'undefined') {
            localStorage.removeItem(this.options.optOutKey);
        }
        this.options.enabled = true;
        this.log('User opted in to tracking');
    }

    /**
     * Get or create user hash (SHA-256)
     */
    async getUserHash() {
        if (typeof localStorage === 'undefined') {
            return this.generateTempHash();
        }

        // Check for existing user ID
        let userId = localStorage.getItem(this.options.userIdKey);

        if (!userId) {
            // Generate new random user ID
            userId = this.generateUserId();
            localStorage.setItem(this.options.userIdKey, userId);
        }

        // Hash the user ID
        return await this.sha256(userId);
    }

    /**
     * Generate random user ID
     */
    generateUserId() {
        return 'user_' + Date.now() + '_' + Math.random().toString(36).substring(2, 15);
    }

    /**
     * Generate temporary hash for environments without localStorage
     */
    generateTempHash() {
        // Use session-based identifier
        const tempId = 'temp_' + Date.now() + '_' + Math.random().toString(36).substring(2, 15);
        return this.sha256Simple(tempId);
    }

    /**
     * SHA-256 hash function
     */
    async sha256(str) {
        // Use Web Crypto API if available
        if (typeof crypto !== 'undefined' && crypto.subtle) {
            const buffer = new TextEncoder().encode(str);
            const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        }

        // Fallback to simple hash (not cryptographically secure but good enough for analytics)
        return this.sha256Simple(str);
    }

    /**
     * Simple hash fallback (not cryptographically secure)
     */
    sha256Simple(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        // Pad to 64 characters to mimic SHA-256 length
        return Math.abs(hash).toString(16).padStart(64, '0');
    }

    /**
     * Track an event
     * @param {string} event - Event name (must match events.json)
     * @param {object} properties - Event properties (no PII!)
     * @param {number} revenueCents - Revenue in cents (optional)
     */
    async trackEvent(event, properties = {}, revenueCents = 0) {
        if (!this.options.enabled) {
            return;
        }

        const startTime = performance.now();

        try {
            const userHash = await this.getUserHash();
            const timestamp = new Date().toISOString();

            const payload = {
                product: this.product,
                event: event,
                user_hash: userHash,
                timestamp: timestamp,
                properties: properties,
                revenue_cents: revenueCents
            };

            // Send async (fire and forget)
            this.sendEvent(payload);

            const elapsed = performance.now() - startTime;
            this.log(`Event tracked: ${event} (${elapsed.toFixed(2)}ms)`, payload);

        } catch (error) {
            // Silent failure - never break the host app
            this.log('Error tracking event:', error);
        }
    }

    /**
     * Send event to ingestion endpoint
     */
    async sendEvent(payload) {
        try {
            // Use sendBeacon if available (more reliable for page unload events)
            if (typeof navigator.sendBeacon !== 'undefined') {
                const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
                navigator.sendBeacon(this.ingestUrl, blob);
            } else {
                // Fallback to fetch
                fetch(this.ingestUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(payload),
                    keepalive: true // Keep request alive even if page unloads
                }).catch(() => {
                    // Silent failure
                });
            }
        } catch (error) {
            // Silent failure
            this.log('Error sending event:', error);
        }
    }

    /**
     * Track daily active session (once per day)
     * @param {object} properties - Session properties
     */
    async trackDailySession(properties = {}) {
        if (typeof localStorage === 'undefined') {
            // Can't track daily sessions without localStorage
            return;
        }

        const today = new Date().toISOString().split('T')[0];
        const lastSession = localStorage.getItem(this.options.sessionKey);

        if (lastSession !== today) {
            await this.trackEvent('daily_active_session', properties);
            localStorage.setItem(this.options.sessionKey, today);
        }
    }

    /**
     * Debug logging
     */
    log(...args) {
        if (this.options.debug) {
            console.log('[Compass]', ...args);
        }
    }
}

/**
 * Pinned-specific event tracking helpers
 */
class PinnedTracker extends CompassTracker {
    constructor(ingestUrl, options = {}) {
        super('pinned', ingestUrl, options);
    }

    /**
     * Track note created
     */
    async trackNoteCreated(noteId, wordCount, hasMention = false) {
        await this.trackEvent('note_created', {
            note_id: noteId,
            word_count: wordCount,
            has_mention: hasMention
        });
    }

    /**
     * Track note acknowledged
     */
    async trackNoteAcknowledged(noteId, timeToAckMinutes) {
        await this.trackEvent('note_acknowledged', {
            note_id: noteId,
            time_to_ack_minutes: timeToAckMinutes
        });
    }

    /**
     * Track mention sent
     */
    async trackMentionSent(noteId, recipientCount) {
        await this.trackEvent('mention_sent', {
            note_id: noteId,
            recipient_count: recipientCount
        });
    }

    /**
     * Track daily active session
     */
    async trackSession(sessionDurationSeconds, notesViewed) {
        await this.trackDailySession({
            session_duration_seconds: sessionDurationSeconds,
            notes_viewed: notesViewed
        });
    }
}

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CompassTracker, PinnedTracker };
}

// Export for use as ES6 module
if (typeof window !== 'undefined') {
    window.CompassTracker = CompassTracker;
    window.PinnedTracker = PinnedTracker;
}
