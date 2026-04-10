/**
 * LocalGenius Chat Widget
 *
 * Vanilla JavaScript chat widget. No jQuery dependency.
 * Decision 7: One beautiful widget. Zero customization.
 * Decision 8: No AI/chatbot branding.
 *
 * @package LocalGenius
 */

(function () {
	'use strict';

	// Ensure config exists
	if (typeof window.localGeniusConfig === 'undefined') {
		return;
	}

	var config = window.localGeniusConfig;
	var consentGiven = false;
	var isOpen = false;
	var isTyping = false;

	// Create widget HTML
	function createWidget() {
		var widget = document.createElement('div');
		widget.className = 'localgenius-widget';
		widget.setAttribute('role', 'complementary');
		widget.setAttribute('aria-label', 'Chat with us');

		widget.innerHTML =
			'<button class="localgenius-bubble" aria-label="Open chat" aria-expanded="false">' +
				'<svg class="localgenius-bubble-open" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true">' +
					'<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>' +
				'</svg>' +
				'<svg class="localgenius-bubble-close" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true">' +
					'<line x1="18" y1="6" x2="6" y2="18"></line>' +
					'<line x1="6" y1="6" x2="18" y2="18"></line>' +
				'</svg>' +
			'</button>' +
			'<div class="localgenius-window" role="dialog" aria-label="Chat window">' +
				'<div class="localgenius-header">' +
					'<div class="localgenius-header-title">Hi there!</div>' +
					'<div class="localgenius-header-subtitle">Ask us anything about our business</div>' +
				'</div>' +
				'<div class="localgenius-messages" role="log" aria-live="polite" aria-label="Chat messages">' +
					'<div class="localgenius-welcome">' +
						'<div class="localgenius-welcome-icon">' +
							'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true">' +
								'<circle cx="12" cy="12" r="10"></circle>' +
								'<path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>' +
								'<line x1="12" y1="17" x2="12.01" y2="17"></line>' +
							'</svg>' +
						'</div>' +
						'<div class="localgenius-welcome-text">Got a question? Ask away and we\'ll get you an answer!</div>' +
					'</div>' +
				'</div>' +
				'<div class="localgenius-consent">' +
					'<label class="localgenius-consent-checkbox">' +
						'<input type="checkbox" id="localgenius-consent-input" aria-describedby="localgenius-consent-desc">' +
						'<span class="localgenius-consent-text" id="localgenius-consent-desc">' +
							'I agree to have my questions processed to provide answers. ' +
							'<a href="/privacy-policy/" target="_blank" rel="noopener">Privacy Policy</a>' +
						'</span>' +
					'</label>' +
				'</div>' +
				'<div class="localgenius-input-area is-disabled">' +
					'<div class="localgenius-input-wrapper">' +
						'<textarea ' +
							'class="localgenius-input" ' +
							'placeholder="Type your question..." ' +
							'rows="1" ' +
							'aria-label="Your question" ' +
							'disabled' +
						'></textarea>' +
						'<button class="localgenius-send" aria-label="Send message" disabled>' +
							'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true">' +
								'<line x1="22" y1="2" x2="11" y2="13"></line>' +
								'<polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>' +
							'</svg>' +
						'</button>' +
					'</div>' +
				'</div>' +
				(config.showPoweredBy ?
					'<div class="localgenius-footer">' +
						'<a href="' + escapeHtml(config.poweredByUrl) + '" class="localgenius-powered" target="_blank" rel="noopener">' +
							'Powered by LocalGenius' +
						'</a>' +
					'</div>' : '') +
			'</div>';

		document.body.appendChild(widget);
		return widget;
	}

	// Escape HTML to prevent XSS
	function escapeHtml(text) {
		var div = document.createElement('div');
		div.textContent = text;
		return div.innerHTML;
	}

	// Toggle widget open/close
	function toggleWidget(widget) {
		isOpen = !isOpen;
		var bubble = widget.querySelector('.localgenius-bubble');

		if (isOpen) {
			widget.classList.add('is-open');
			bubble.setAttribute('aria-expanded', 'true');
			bubble.setAttribute('aria-label', 'Close chat');
			var input = widget.querySelector('.localgenius-input');
			if (input && !input.disabled) {
				setTimeout(function() { input.focus(); }, 200);
			}
		} else {
			widget.classList.remove('is-open');
			bubble.setAttribute('aria-expanded', 'false');
			bubble.setAttribute('aria-label', 'Open chat');
		}
	}

	// Handle consent checkbox
	function handleConsent(widget, checked) {
		consentGiven = checked;
		var inputArea = widget.querySelector('.localgenius-input-area');
		var input = widget.querySelector('.localgenius-input');
		var sendBtn = widget.querySelector('.localgenius-send');
		var consentSection = widget.querySelector('.localgenius-consent');

		if (checked) {
			inputArea.classList.remove('is-disabled');
			input.disabled = false;
			sendBtn.disabled = false;
			consentSection.style.display = 'none';
			input.focus();
		} else {
			inputArea.classList.add('is-disabled');
			input.disabled = true;
			sendBtn.disabled = true;
			consentSection.style.display = 'block';
		}
	}

	// Add message to chat
	function addMessage(widget, text, isUser) {
		var messages = widget.querySelector('.localgenius-messages');
		var welcome = messages.querySelector('.localgenius-welcome');

		if (welcome) {
			welcome.remove();
		}

		var message = document.createElement('div');
		message.className = 'localgenius-message ' + (isUser ? 'localgenius-message-user' : 'localgenius-message-bot');
		message.innerHTML = '<div class="localgenius-message-content">' + escapeHtml(text) + '</div>';

		messages.appendChild(message);
		messages.scrollTop = messages.scrollHeight;
	}

	// Show typing indicator
	function showTyping(widget) {
		if (isTyping) return;
		isTyping = true;

		var messages = widget.querySelector('.localgenius-messages');
		var typing = document.createElement('div');
		typing.className = 'localgenius-message localgenius-message-bot localgenius-typing-container';
		typing.innerHTML =
			'<div class="localgenius-typing" aria-label="Typing">' +
				'<span class="localgenius-typing-dot"></span>' +
				'<span class="localgenius-typing-dot"></span>' +
				'<span class="localgenius-typing-dot"></span>' +
			'</div>';

		messages.appendChild(typing);
		messages.scrollTop = messages.scrollHeight;
	}

	// Hide typing indicator
	function hideTyping(widget) {
		isTyping = false;
		var typing = widget.querySelector('.localgenius-typing-container');
		if (typing) {
			typing.remove();
		}
	}

	// Send question to API
	function sendQuestion(widget, question) {
		var input = widget.querySelector('.localgenius-input');
		var sendBtn = widget.querySelector('.localgenius-send');

		if (!question.trim() || !consentGiven) return;

		// Disable input while processing
		input.disabled = true;
		sendBtn.disabled = true;
		input.value = '';

		// Add user message
		addMessage(widget, question, true);
		showTyping(widget);

		// Build request
		var formData = new FormData();
		formData.append('question', question);

		fetch(config.apiEndpoint, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'X-WP-Nonce': config.nonce
			},
			body: JSON.stringify({ question: question })
		})
		.then(function(response) {
			return response.json();
		})
		.then(function(data) {
			hideTyping(widget);

			if (data.answer) {
				addMessage(widget, data.answer, false);
			} else {
				addMessage(widget, getFallbackMessage(), false);
			}

			// Re-enable input
			input.disabled = false;
			sendBtn.disabled = false;
			input.focus();
		})
		.catch(function() {
			hideTyping(widget);
			addMessage(widget, getFallbackMessage(), false);

			// Re-enable input
			input.disabled = false;
			sendBtn.disabled = false;
			input.focus();
		});
	}

	// Get fallback message
	function getFallbackMessage() {
		if (config.phone) {
			return "I'm having a bit of trouble right now. I'd recommend calling us directly at " + config.phone + " for assistance.";
		}
		return "I'm having a bit of trouble right now. Please try again in a moment or contact us directly.";
	}

	// Auto-resize textarea
	function autoResize(textarea) {
		textarea.style.height = 'auto';
		textarea.style.height = Math.min(textarea.scrollHeight, 100) + 'px';
	}

	// Initialize widget
	function init() {
		var widget = createWidget();
		var bubble = widget.querySelector('.localgenius-bubble');
		var consentInput = widget.querySelector('#localgenius-consent-input');
		var input = widget.querySelector('.localgenius-input');
		var sendBtn = widget.querySelector('.localgenius-send');

		// Bubble click
		bubble.addEventListener('click', function() {
			toggleWidget(widget);
		});

		// Consent checkbox
		if (consentInput) {
			consentInput.addEventListener('change', function() {
				handleConsent(widget, this.checked);
			});
		}

		// Send button click
		sendBtn.addEventListener('click', function() {
			sendQuestion(widget, input.value);
		});

		// Enter key to send
		input.addEventListener('keydown', function(e) {
			if (e.key === 'Enter' && !e.shiftKey) {
				e.preventDefault();
				sendQuestion(widget, input.value);
			}
		});

		// Auto-resize textarea
		input.addEventListener('input', function() {
			autoResize(this);
		});

		// Escape to close
		document.addEventListener('keydown', function(e) {
			if (e.key === 'Escape' && isOpen) {
				toggleWidget(widget);
			}
		});

		// Close when clicking outside
		document.addEventListener('click', function(e) {
			if (isOpen && !widget.contains(e.target)) {
				toggleWidget(widget);
			}
		});
	}

	// Wait for DOM ready
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', init);
	} else {
		init();
	}
})();
