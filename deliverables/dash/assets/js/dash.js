/**
 * Dash — Command Bar for WordPress
 * Press Cmd+K to Dash.
 *
 * Vanilla JS. Zero dependencies. Single file.
 * Target: <15KB gzipped. Modal open <16ms. Client search <50ms.
 *
 * Consumes window.dashIndex (pre-loaded JSON) or fetches via
 * dashData.indexUrl (AJAX fallback for large sites).
 *
 * Interaction modes:
 *   search   — default, post/page/CPT/settings
 *   command  — ">" prefix, quick actions
 *   user     — "@" prefix, WP_User_Query (always server-side)
 *
 * Custom events fired:
 *   dash:open   — modal opened
 *   dash:close  — modal closed
 *   dash:select — item selected (detail: { item })
 */
(function () {
  'use strict';

  /* ── Constants ── */
  var MAX_RESULTS       = 10;
  var DEBOUNCE_MS       = 30;
  var PLACEHOLDER_TICK  = 3800;
  var PLACEHOLDERS      = [
    'Where to?',
    'Jump anywhere\u2026',
    'Search posts, pages, settings\u2026',
    'What do you need?',
    'Press \u2318K anytime to Dash'
  ];

  /* ── State ── */
  var isOpen          = false;
  var activeIdx       = -1;
  var results         = [];
  var clientIndex     = null;   // loaded once, reused
  var indexLoading    = false;
  var indexCallbacks  = [];
  var debounceTimer   = null;
  var placeholderTimer= null;
  var placeholderCursor = 0;
  var dom             = null;   // set in init()

  /* ─────────────────────────────────────────────
     UTILITIES
     ───────────────────────────────────────────── */

  function el(tag, className, attrs) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (attrs) {
      for (var k in attrs) {
        if (Object.prototype.hasOwnProperty.call(attrs, k)) {
          node.setAttribute(k, attrs[k]);
        }
      }
    }
    return node;
  }

  function dispatch(name, detail) {
    try {
      document.dispatchEvent(new CustomEvent(name, { detail: detail || null, bubbles: false }));
    } catch (e) { /* IE11 CustomEvent fallback not needed for WP admin */ }
  }

  /* ─────────────────────────────────────────────
     MODE ROUTER  (6 lines, as specced)
     ───────────────────────────────────────────── */

  function getMode(raw) {
    var first = raw.charAt(0);
    if (first === '>') return 'command';
    if (first === '@') return 'user';
    return 'search';
  }

  function getModeLabel(mode) {
    return mode === 'command' ? 'Actions' : mode === 'user' ? 'Users' : 'Search';
  }

  function stripPrefix(raw) {
    var first = raw.charAt(0);
    return (first === '>' || first === '@') ? raw.slice(1).replace(/^\s+/, '') : raw;
  }

  /* ─────────────────────────────────────────────
     DOM CONSTRUCTION
     ───────────────────────────────────────────── */

  function buildDOM() {
    /* Backdrop — click-to-close, ARIA dialog */
    var backdrop = el('div', 'dash-backdrop', {
      id:           'dash-backdrop',
      role:         'dialog',
      'aria-modal': 'true',
      'aria-label': 'Dash command bar'
    });

    /* Modal */
    var modal = el('div', 'dash-modal', { id: 'dash-modal' });

    /* Input row */
    var inputWrap = el('div', 'dash-input-wrap');

    var input = document.createElement('input');
    input.type        = 'text';
    input.className   = 'dash-input';
    input.id          = 'dash-input';
    input.setAttribute('role',               'combobox');
    input.setAttribute('aria-expanded',      'false');
    input.setAttribute('aria-controls',      'dash-results');
    input.setAttribute('aria-activedescendant', '');
    input.setAttribute('aria-autocomplete',  'list');
    input.setAttribute('autocomplete',       'off');
    input.setAttribute('spellcheck',         'false');
    input.placeholder = PLACEHOLDERS[0];

    var modeBadge = el('span', 'dash-mode-badge', {
      id:          'dash-mode',
      'aria-live': 'polite',
      'data-mode': 'search'
    });
    modeBadge.textContent = 'Search';

    inputWrap.appendChild(input);
    inputWrap.appendChild(modeBadge);

    /* Results list */
    var resultsList = el('ul', 'dash-results', {
      id:          'dash-results',
      role:        'listbox',
      'aria-label':'Search results'
    });

    /* Live region — screen reader announcements */
    var liveRegion = el('div', 'dash-sr-only', {
      id:           'dash-live',
      'aria-live':  'polite',
      'aria-atomic':'true'
    });

    /* Keyboard hints footer */
    var footer = el('div', 'dash-footer');
    footer.innerHTML =
      '<span class="dash-footer-hint"><kbd>\u2191</kbd><kbd>\u2193</kbd> navigate</span>' +
      '<span class="dash-footer-hint"><kbd>\u23CE</kbd> open</span>' +
      '<span class="dash-footer-hint"><kbd>Esc</kbd> close</span>';

    modal.appendChild(inputWrap);
    modal.appendChild(resultsList);
    modal.appendChild(footer);
    modal.appendChild(liveRegion);
    backdrop.appendChild(modal);
    document.body.appendChild(backdrop);

    return {
      backdrop:    backdrop,
      modal:       modal,
      input:       input,
      modeBadge:   modeBadge,
      resultsList: resultsList,
      liveRegion:  liveRegion
    };
  }

  /* ─────────────────────────────────────────────
     INDEX LOADING
     Uses window.dashIndex if pre-populated by
     dash-admin.js. Falls back to XHR fetch.
     Multiple callers share one in-flight request.
     ───────────────────────────────────────────── */

  function loadIndex(cb) {
    /* Already loaded */
    if (clientIndex !== null) { cb(clientIndex); return; }

    /* Pre-populated by PHP/admin script */
    if (window.dashIndex && Array.isArray(window.dashIndex)) {
      clientIndex = window.dashIndex;
      cb(clientIndex);
      return;
    }

    /* Queue the callback */
    indexCallbacks.push(cb);
    if (indexLoading) return;
    indexLoading = true;

    var xhr = new XMLHttpRequest();
    xhr.open('GET', dashData.indexUrl, true);
    xhr.onreadystatechange = function () {
      if (xhr.readyState !== 4) return;
      indexLoading = false;

      var idx = [];
      if (xhr.status === 200) {
        try {
          var resp = JSON.parse(xhr.responseText);
          if (resp.success && Array.isArray(resp.data)) idx = resp.data;
        } catch (e) {}
      }

      clientIndex = idx;
      var pending = indexCallbacks.splice(0);
      for (var i = 0; i < pending.length; i++) pending[i](clientIndex);
    };
    xhr.send();
  }

  /* ─────────────────────────────────────────────
     CLIENT-SIDE SEARCH ENGINE
     Prefix match + keyword scoring (~50 lines).
     No Fuse.js, no dependencies.
     ───────────────────────────────────────────── */

  function clientSearch(items, query, mode) {
    if (!query || !items || !items.length) return [];

    var q      = query.toLowerCase();
    var words  = q.split(/\s+/);
    var scored = [];

    for (var i = 0; i < items.length; i++) {
      var item  = items[i];
      var type  = item.type || '';

      /* Mode gating */
      if (mode === 'command' && type !== 'action')  continue;
      if (mode === 'user'    && type !== 'user')    continue;
      if (mode === 'search'  && type === 'user')    continue;

      var s = score(item, q, words);
      if (s > 0) scored.push({ item: item, score: s });
    }

    /* Primary: score DESC. Secondary: recency DESC. */
    scored.sort(function (a, b) {
      if (b.score !== a.score) return b.score - a.score;
      return (b.item.updated || 0) - (a.item.updated || 0);
    });

    var out = [], cap = Math.min(scored.length, MAX_RESULTS);
    for (var j = 0; j < cap; j++) out.push(scored[j].item);
    return out;
  }

  function score(item, q, words) {
    var title    = (item.title    || '').toLowerCase();
    var keywords = (item.keywords || '').toLowerCase();
    var s        = 0;

    if (title === q)              return 100;          /* exact */
    if (title.indexOf(q) === 0)   s += 80;             /* prefix */
    else if (title.indexOf(q) !== -1) s += 50;         /* contains */

    if (keywords.indexOf(q) !== -1) s += 30;           /* keyword hit */

    /* Multi-word: all tokens must appear somewhere */
    if (words.length > 1) {
      var all = true;
      for (var w = 0; w < words.length; w++) {
        if (title.indexOf(words[w]) === -1 && keywords.indexOf(words[w]) === -1) {
          all = false; break;
        }
      }
      if (all) s += 20;
    }

    if (item.recent) s += 15;   /* recency boost */

    return s;
  }

  /* ─────────────────────────────────────────────
     SERVER FALLBACK  (AJAX)
     Used for: user search (always), large sites
     where index threshold is exceeded, and when
     client index hasn't loaded yet.
     ───────────────────────────────────────────── */

  function serverSearch(query, mode, cb) {
    var xhr = new XMLHttpRequest();
    var url = dashData.ajaxUrl +
      '?action=dash_search' +
      '&q='    + encodeURIComponent(query) +
      '&type=' + encodeURIComponent(mode) +
      '&_wpnonce=' + dashData.nonce;
    xhr.open('GET', url, true);
    xhr.onreadystatechange = function () {
      if (xhr.readyState !== 4 || xhr.status !== 200) return;
      try {
        var resp = JSON.parse(xhr.responseText);
        if (resp.success) cb(resp.data || []);
      } catch (e) { cb([]); }
    };
    xhr.send();
  }

  function executeCommand(actionId) {
    var xhr = new XMLHttpRequest();
    var body = 'action=dash_execute_command' +
      '&command='    + encodeURIComponent(actionId) +
      '&_wpnonce='   + dashData.nonce;
    xhr.open('POST', dashData.ajaxUrl, true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send(body);
  }

  /* ─────────────────────────────────────────────
     RESULT RENDERING
     Clear list, build new nodes, reset
     active index to 0.
     ───────────────────────────────────────────── */

  function renderResults(items) {
    dom.resultsList.innerHTML = '';
    results   = items;
    activeIdx = items.length > 0 ? 0 : -1;

    if (!items.length) {
      var raw      = dom.input.value.trim();
      var stripped = stripPrefix(raw);
      if (stripped) {
        var empty = el('li', 'dash-empty', { role: 'option' });
        empty.textContent = 'No results for \u201c' + stripped + '\u201d';
        dom.resultsList.appendChild(empty);
      }
      dom.liveRegion.textContent = 'No results';
      dom.input.setAttribute('aria-expanded',         'false');
      dom.input.setAttribute('aria-activedescendant', '');
      return;
    }

    var fragment = document.createDocumentFragment();
    for (var i = 0; i < items.length; i++) {
      var item = items[i];

      var li = el('li',
        'dash-result' + (i === 0 ? ' is-active' : ''),
        {
          id:            'dash-result-' + i,
          role:          'option',
          'aria-selected': i === 0 ? 'true' : 'false',
          'data-url':    item.url    || '',
          'data-action': item.action || ''
        }
      );

      /* Dashicon */
      var iconWrap = el('span', 'dash-result-icon');
      var dashicon = el('span', 'dashicons ' + typeToIcon(item.type));
      iconWrap.appendChild(dashicon);

      /* Text content */
      var content = el('span', 'dash-result-content');
      var title   = el('span', 'dash-result-title');
      title.textContent = item.title || 'Untitled';
      var badge   = el('span', 'dash-result-type');
      badge.textContent = typeToLabel(item.type);

      content.appendChild(title);
      content.appendChild(badge);
      li.appendChild(iconWrap);
      li.appendChild(content);
      fragment.appendChild(li);
    }
    dom.resultsList.appendChild(fragment);

    dom.input.setAttribute('aria-expanded',         'true');
    dom.input.setAttribute('aria-activedescendant', 'dash-result-0');
    dom.liveRegion.textContent =
      items.length + ' result' + (items.length !== 1 ? 's' : '') + ' available';
  }

  function typeToIcon(type) {
    var map = {
      post:    'dashicons-admin-post',
      page:    'dashicons-admin-page',
      action:  'dashicons-superhero-alt',
      setting: 'dashicons-admin-generic',
      user:    'dashicons-admin-users',
      cpt:     'dashicons-archive',
      media:   'dashicons-admin-media',
      plugin:  'dashicons-admin-plugins'
    };
    return map[type] || 'dashicons-search';
  }

  function typeToLabel(type) {
    var map = {
      post:    'Post',
      page:    'Page',
      action:  'Action',
      setting: 'Setting',
      user:    'User',
      cpt:     'Content',
      media:   'Media',
      plugin:  'Plugin'
    };
    return map[type] || 'Item';
  }

  /* ─────────────────────────────────────────────
     KEYBOARD NAVIGATION
     ───────────────────────────────────────────── */

  function navigate(dir) {
    if (!results.length) return;

    var prev  = activeIdx;
    var total = results.length;

    activeIdx = dir === 'down'
      ? (activeIdx < total - 1 ? activeIdx + 1 : 0)
      : (activeIdx > 0         ? activeIdx - 1 : total - 1);

    setActiveRow(prev, activeIdx);
  }

  function setActiveRow(prev, next) {
    var prevEl = dom.resultsList.querySelector('#dash-result-' + prev);
    var nextEl = dom.resultsList.querySelector('#dash-result-' + next);

    if (prevEl) {
      prevEl.classList.remove('is-active');
      prevEl.setAttribute('aria-selected', 'false');
    }
    if (nextEl) {
      nextEl.classList.add('is-active');
      nextEl.setAttribute('aria-selected', 'true');
      nextEl.scrollIntoView({ block: 'nearest' });
    }
    dom.input.setAttribute('aria-activedescendant', 'dash-result-' + next);
  }

  /* ─────────────────────────────────────────────
     SELECTION
     ───────────────────────────────────────────── */

  function selectResult() {
    if (activeIdx < 0 || activeIdx >= results.length) return;
    var item = results[activeIdx];

    dispatch('dash:select', { item: item });

    if (item.action) {
      executeCommand(item.action);
      close();
    } else if (item.url) {
      close();
      window.location.href = item.url;
    }
  }

  /* ─────────────────────────────────────────────
     OPEN / CLOSE
     Frame 0: input painted, focused, accepting
     keystrokes. Animation runs in parallel on
     compositor — never blocks input.
     ───────────────────────────────────────────── */

  function open() {
    if (isOpen) return;
    isOpen = true;

    dom.backdrop.classList.add('is-open');
    dom.modal.classList.add('is-open');
    dom.input.value = '';
    dom.input.focus();
    dom.resultsList.innerHTML = '';
    results   = [];
    activeIdx = -1;

    /* Lock body scroll without shifting layout */
    document.body.style.overflow = 'hidden';

    /* Dismiss onboarding if it's floating */
    dismissTooltip();

    /* Show recent items immediately — this also primes the index cache */
    loadIndex(function (idx) {
      if (!isOpen) return;
      if (dom.input.value.trim()) return; /* user typed already */
      var recents = idx.filter(function (item) { return !!item.recent; }).slice(0, MAX_RESULTS);
      if (recents.length) {
        dom.resultsList.innerHTML = '';
        var divider = el('li', 'dash-divider', { role: 'presentation', 'aria-hidden': 'true' });
        divider.textContent = 'Recent';
        dom.resultsList.appendChild(divider);
        renderResults(recents);
      }
    });

    startPlaceholders();
    dispatch('dash:open');
  }

  function close() {
    if (!isOpen) return;
    isOpen = false;

    dom.backdrop.classList.remove('is-open');
    dom.modal.classList.remove('is-open');
    dom.input.setAttribute('aria-expanded',         'false');
    dom.input.setAttribute('aria-activedescendant', '');
    results   = [];
    activeIdx = -1;

    document.body.style.overflow = '';

    stopPlaceholders();
    dispatch('dash:close');
  }

  /* ─────────────────────────────────────────────
     PLACEHOLDER ROTATION
     ───────────────────────────────────────────── */

  function startPlaceholders() {
    stopPlaceholders();
    placeholderTimer = setInterval(function () {
      placeholderCursor = (placeholderCursor + 1) % PLACEHOLDERS.length;
      dom.input.placeholder = PLACEHOLDERS[placeholderCursor];
    }, PLACEHOLDER_TICK);
  }

  function stopPlaceholders() {
    if (placeholderTimer) { clearInterval(placeholderTimer); placeholderTimer = null; }
  }

  /* ─────────────────────────────────────────────
     INPUT HANDLER  (debounced, 30ms)
     ───────────────────────────────────────────── */

  function handleInput() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(function () {
      var raw   = dom.input.value;
      var mode  = getMode(raw);
      var query = stripPrefix(raw);

      /* Update mode badge */
      dom.modeBadge.textContent      = getModeLabel(mode);
      dom.modeBadge.dataset.mode     = mode;

      /* Empty query → show recents */
      if (!query) {
        if (clientIndex) {
          var recents = clientIndex.filter(function (i) { return !!i.recent; }).slice(0, MAX_RESULTS);
          renderResults(recents);
        } else {
          renderResults([]);
        }
        return;
      }

      /* User search is always server-side (WP_User_Query) */
      if (mode === 'user') {
        serverSearch(query, mode, function (items) {
          if (isOpen) renderResults(items);
        });
        return;
      }

      /* Client-side search */
      if (clientIndex !== null) {
        renderResults(clientSearch(clientIndex, query, mode));
      } else {
        /* Index not ready — fall back to server while it loads */
        serverSearch(query, mode, function (items) {
          if (isOpen) renderResults(items);
        });
      }
    }, DEBOUNCE_MS);
  }

  /* ─────────────────────────────────────────────
     ONBOARDING TOOLTIP
     Rendered by dash-admin.js; this file handles
     dismiss logic so it's collocated with open().
     ───────────────────────────────────────────── */

  function dismissTooltip() {
    var tip = document.getElementById('dash-tooltip');
    if (tip && tip.parentNode) {
      tip.classList.remove('is-visible');
      setTimeout(function () {
        if (tip.parentNode) tip.parentNode.removeChild(tip);
      }, 200);
    }
  }

  /* ─────────────────────────────────────────────
     EVENT WIRING
     ───────────────────────────────────────────── */

  function wireEvents() {
    /* Global keyboard shortcut — capture phase to beat WP core */
    document.addEventListener('keydown', function (e) {
      /* Cmd+K / Ctrl+K — toggle */
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        e.stopImmediatePropagation();
        isOpen ? close() : open();
        return;
      }

      if (!isOpen) return;

      switch (e.key) {
        case 'Escape':
          e.preventDefault();
          e.stopImmediatePropagation();
          close();
          break;
        case 'ArrowDown':
          e.preventDefault();
          navigate('down');
          break;
        case 'ArrowUp':
          e.preventDefault();
          navigate('up');
          break;
        case 'Enter':
          e.preventDefault();
          selectResult();
          break;
      }
    }, true /* capture */);

    /* Typing */
    dom.input.addEventListener('input', handleInput);

    /* Click a result */
    dom.resultsList.addEventListener('click', function (e) {
      var li = e.target.closest('.dash-result');
      if (!li) return;
      var idx = parseInt(li.id.replace('dash-result-', ''), 10);
      if (!isNaN(idx)) { activeIdx = idx; selectResult(); }
    });

    /* Mouse hover activates row (mouse users expect hover state) */
    dom.resultsList.addEventListener('mousemove', function (e) {
      var li = e.target.closest('.dash-result');
      if (!li) return;
      var idx = parseInt(li.id.replace('dash-result-', ''), 10);
      if (!isNaN(idx) && idx !== activeIdx) {
        setActiveRow(activeIdx, idx);
        activeIdx = idx;
      }
    });

    /* Click backdrop to close */
    dom.backdrop.addEventListener('click', function (e) {
      if (e.target === dom.backdrop) close();
    });

    /* External API: other plugins can open/close Dash programmatically */
    document.addEventListener('dash:open',  function () { if (!isOpen) open();  });
    document.addEventListener('dash:close', function () { if (isOpen)  close(); });
  }

  /* ─────────────────────────────────────────────
     INIT
     ───────────────────────────────────────────── */

  function init() {
    if (typeof dashData === 'undefined') return;

    dom = buildDOM();
    wireEvents();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
