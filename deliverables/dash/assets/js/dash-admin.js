/**
 * Dash Admin — Initialization & Onboarding
 *
 * Responsibilities:
 *   1. Pre-populate window.dashIndex from the PHP-inlined JSON blob
 *      so dash.js never needs a network round-trip on open.
 *   2. Show a first-use onboarding tooltip (once, then mark seen).
 *   3. Expose window.Dash as a minimal public API for other plugins.
 *
 * Load order (enforced by PHP wp_enqueue_script dependency array):
 *   dash-admin.js → dash.js
 *
 * This file must be enrolled with `in_footer: true` so the DOM is
 * ready when it executes — no DOMContentLoaded guard needed here.
 */
(function () {
  'use strict';

  /* ─────────────────────────────────────────────
     BAIL EARLY
     If dashData isn't present, PHP didn't enqueue
     us correctly. Nothing to do.
     ───────────────────────────────────────────── */
  if (typeof dashData === 'undefined') return;

  /* ─────────────────────────────────────────────
     1. POPULATE CLIENT INDEX
     PHP inlines the serialized index into
     dashData.index (array) when item count
     is under DASH_CLIENT_INDEX_THRESHOLD (5 000).
     We move it to window.dashIndex so dash.js
     finds it without an XHR on first open.
     ───────────────────────────────────────────── */
  if (dashData.index && Array.isArray(dashData.index)) {
    window.dashIndex = dashData.index;
    /* Free the copy on dashData to avoid duplicate memory */
    dashData.index = null;
  }

  /* ─────────────────────────────────────────────
     2. ONBOARDING TOOLTIP
     Show "Press ⌘K to Dash" once.
     Dismiss after 6 s, on Cmd+K, or on click.
     Server marks seen via AJAX so tooltip never
     appears again (stored in user meta).
     ───────────────────────────────────────────── */

  var TOOLTIP_DELAY   = 1800;  /* ms after page load */
  var TOOLTIP_DISPLAY = 6000;  /* ms visible          */

  function showOnboardingTooltip() {
    if (dashData.onboardingSeen) return;
    if (document.getElementById('dash-tooltip')) return;

    var tip = document.createElement('div');
    tip.id        = 'dash-tooltip';
    tip.className = 'dash-tooltip';
    tip.setAttribute('role',        'status');
    tip.setAttribute('aria-live',   'polite');
    tip.setAttribute('aria-atomic', 'true');

    var isMac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
    var key   = isMac ? '\u2318K' : 'Ctrl+K';

    tip.innerHTML =
      'Press <kbd>' + key + '</kbd> to Dash \u2014 jump anywhere in your admin';

    document.body.appendChild(tip);

    /* Trigger transition on next frame so CSS animation fires */
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        tip.classList.add('is-visible');
      });
    });

    /* Auto-dismiss */
    var dismissTimer = setTimeout(dismissTooltip, TOOLTIP_DISPLAY);

    /* Dismiss on Cmd+K (user took the hint) */
    document.addEventListener('keydown', function onKbd(e) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        clearTimeout(dismissTimer);
        dismissTooltip();
        document.removeEventListener('keydown', onKbd, true);
      }
    }, true);

    /* Dismiss on click */
    tip.addEventListener('click', function () {
      clearTimeout(dismissTimer);
      dismissTooltip();
    });

    /* Mark seen in user meta so it never appears again */
    markOnboarded();
  }

  function dismissTooltip() {
    var tip = document.getElementById('dash-tooltip');
    if (!tip) return;
    tip.classList.remove('is-visible');
    setTimeout(function () {
      if (tip.parentNode) tip.parentNode.removeChild(tip);
    }, 200);
  }

  function markOnboarded() {
    if (!dashData.ajaxUrl || !dashData.nonce) return;
    var xhr = new XMLHttpRequest();
    xhr.open('POST', dashData.ajaxUrl, true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send('action=dash_mark_onboarded&_wpnonce=' + dashData.nonce);
    /* Fire-and-forget. Failure is silent — worst case tooltip shows
       on next page load, which is acceptable. */
  }

  setTimeout(showOnboardingTooltip, TOOLTIP_DELAY);

  /* ─────────────────────────────────────────────
     3. PUBLIC API  (window.Dash)
     Gives other plugins a clean surface to
     integrate without coupling to internals.

     window.Dash.open()   — open the command bar
     window.Dash.close()  — close the command bar
     window.Dash.index()  — return a copy of the
                            current client index
                            (useful for debugging)
     ───────────────────────────────────────────── */
  window.Dash = {
    open: function () {
      document.dispatchEvent(new CustomEvent('dash:open'));
    },
    close: function () {
      document.dispatchEvent(new CustomEvent('dash:close'));
    },
    index: function () {
      return window.dashIndex ? window.dashIndex.slice() : [];
    }
  };

})();
