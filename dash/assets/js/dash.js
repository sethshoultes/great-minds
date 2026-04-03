/**
 * Dash — Command Bar for WordPress
 * Press Cmd+K to Dash.
 *
 * Single-file, zero-dependency, vanilla JS.
 * Consumes a JSON search index from the Dash PHP backend.
 */
(function () {
  'use strict';

  /* ── Config ── */
  var MAX_RESULTS = 10;
  var PLACEHOLDERS = ['Where to?', 'Jump anywhere...', 'Search posts, pages, settings...', 'What do you need?'];
  var PLACEHOLDER_INTERVAL = 4000;
  var DEBOUNCE_MS = 30;

  /* ── State ── */
  var isOpen = false;
  var activeIndex = -1;
  var results = [];
  var index = null; // client-side search index (loaded lazily)
  var indexLoading = false;
  var placeholderTimer = null;
  var placeholderIdx = 0;
  var debounceTimer = null;
  var onboardingShown = false;

  /* ── Mode Router (6 lines that make this a product) ── */
  function getMode(query) {
    if (query.charAt(0) === '>') return 'command';
    if (query.charAt(0) === '@') return 'user';
    return 'search';
  }

  function getModeLabel(mode) {
    if (mode === 'command') return 'Actions';
    if (mode === 'user') return 'Users';
    return 'Search';
  }

  function stripModePrefix(query) {
    var ch = query.charAt(0);
    if (ch === '>' || ch === '@') return query.slice(1).trimStart();
    return query;
  }

  /* ── DOM Construction ── */
  function buildDOM() {
    var backdrop = el('div', 'dash-backdrop', {
      id: 'dash-backdrop',
      role: 'dialog',
      'aria-modal': 'true',
      'aria-label': 'Dash command bar'
    });

    var modal = el('div', 'dash-modal', { id: 'dash-modal' });

    var inputWrap = el('div', 'dash-input-wrap');

    var input = document.createElement('input');
    input.type = 'text';
    input.className = 'dash-input';
    input.id = 'dash-input';
    input.setAttribute('role', 'combobox');
    input.setAttribute('aria-expanded', 'false');
    input.setAttribute('aria-controls', 'dash-results');
    input.setAttribute('aria-activedescendant', '');
    input.setAttribute('aria-autocomplete', 'list');
    input.setAttribute('autocomplete', 'off');
    input.setAttribute('spellcheck', 'false');
    input.placeholder = PLACEHOLDERS[0];

    var modeIndicator = el('span', 'dash-mode-indicator', { id: 'dash-mode', 'aria-live': 'polite' });
    modeIndicator.textContent = 'Search';

    inputWrap.appendChild(input);
    inputWrap.appendChild(modeIndicator);

    var resultsList = el('ul', 'dash-results', {
      id: 'dash-results',
      role: 'listbox',
      'aria-label': 'Search results'
    });

    var liveRegion = el('div', 'dash-sr-only', {
      id: 'dash-live',
      'aria-live': 'polite',
      'aria-atomic': 'true'
    });

    modal.appendChild(inputWrap);
    modal.appendChild(resultsList);
    modal.appendChild(liveRegion);
    backdrop.appendChild(modal);
    document.body.appendChild(backdrop);

    return { backdrop: backdrop, modal: modal, input: input, resultsList: resultsList, modeIndicator: modeIndicator, liveRegion: liveRegion };
  }

  function el(tag, className, attrs) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (attrs) {
      for (var key in attrs) {
        if (attrs.hasOwnProperty(key)) node.setAttribute(key, attrs[key]);
      }
    }
    return node;
  }

  /* ── Index Loading ── */
  function loadIndex(callback) {
    if (index) return callback(index);
    if (indexLoading) return;
    indexLoading = true;

    var xhr = new XMLHttpRequest();
    xhr.open('GET', dashConfig.indexUrl, true);
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        indexLoading = false;
        if (xhr.status === 200) {
          try {
            var response = JSON.parse(xhr.responseText);
            if (response.success && response.data) {
              index = response.data;
              callback(index);
            }
          } catch (e) {
            index = [];
            callback(index);
          }
        }
      }
    };
    xhr.send();
  }

  /* ── Client-Side Search Engine ── */
  function searchIndex(items, query, mode) {
    if (!query || !items || !items.length) return [];

    var q = query.toLowerCase();
    var scored = [];

    for (var i = 0; i < items.length; i++) {
      var item = items[i];

      // Mode filtering
      if (mode === 'command' && item.type !== 'action') continue;
      if (mode === 'user' && item.type !== 'user') continue;
      if (mode === 'search' && item.type === 'user') continue;

      var score = scoreItem(item, q);
      if (score > 0) {
        scored.push({ item: item, score: score });
      }
    }

    // Sort by score descending, then by recency
    scored.sort(function (a, b) {
      if (b.score !== a.score) return b.score - a.score;
      return (b.item.updated || 0) - (a.item.updated || 0);
    });

    var out = [];
    var limit = Math.min(scored.length, MAX_RESULTS);
    for (var j = 0; j < limit; j++) {
      out.push(scored[j].item);
    }
    return out;
  }

  function scoreItem(item, query) {
    var title = (item.title || '').toLowerCase();
    var keywords = (item.keywords || '').toLowerCase();
    var score = 0;

    // Exact title match
    if (title === query) return 100;

    // Title starts with query (prefix match — index-friendly)
    if (title.indexOf(query) === 0) score += 80;
    // Title contains query
    else if (title.indexOf(query) !== -1) score += 50;

    // Keyword match
    if (keywords.indexOf(query) !== -1) score += 30;

    // Multi-word: check if all words appear somewhere
    var words = query.split(/\s+/);
    if (words.length > 1) {
      var allMatch = true;
      for (var w = 0; w < words.length; w++) {
        if (title.indexOf(words[w]) === -1 && keywords.indexOf(words[w]) === -1) {
          allMatch = false;
          break;
        }
      }
      if (allMatch) score += 20;
    }

    // Recency boost (items updated in last 24h)
    if (item.recent) score += 15;

    return score;
  }

  /* ── Server-Side Fallback (AJAX) ── */
  function searchServer(query, mode, callback) {
    var xhr = new XMLHttpRequest();
    var url = dashConfig.ajaxUrl +
      '?action=dash_search&q=' + encodeURIComponent(query) +
      '&type=' + encodeURIComponent(mode) +
      '&_wpnonce=' + dashConfig.nonce;
    xhr.open('GET', url, true);
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        try {
          var response = JSON.parse(xhr.responseText);
          if (response.success) callback(response.data || []);
        } catch (e) {
          callback([]);
        }
      }
    };
    xhr.send();
  }

  /* ── Result Rendering ── */
  function renderResults(items, dom) {
    dom.resultsList.innerHTML = '';
    results = items;
    activeIndex = items.length > 0 ? 0 : -1;

    if (!items.length) {
      var query = dom.input.value.trim();
      var stripped = stripModePrefix(query);
      if (stripped) {
        var empty = el('li', 'dash-empty', { role: 'option' });
        empty.textContent = 'No results for "' + stripped + '"';
        dom.resultsList.appendChild(empty);
      }
      dom.liveRegion.textContent = 'No results';
      dom.input.setAttribute('aria-expanded', 'false');
      dom.input.setAttribute('aria-activedescendant', '');
      return;
    }

    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      var li = el('li', 'dash-result' + (i === 0 ? ' is-active' : ''), {
        id: 'dash-result-' + i,
        role: 'option',
        'aria-selected': i === 0 ? 'true' : 'false',
        'data-url': item.url || '',
        'data-action': item.action || ''
      });

      // Icon
      var icon = el('span', 'dash-result-icon');
      var dashicon = el('span', 'dashicons ' + getIcon(item.type));
      icon.appendChild(dashicon);

      // Content
      var content = el('span', 'dash-result-content');
      var title = el('span', 'dash-result-title');
      title.textContent = item.title || 'Untitled';
      content.appendChild(title);

      // Type badge
      var meta = el('span', 'dash-result-meta');
      meta.textContent = getTypeLabel(item.type);
      content.appendChild(meta);

      li.appendChild(icon);
      li.appendChild(content);
      dom.resultsList.appendChild(li);
    }

    dom.input.setAttribute('aria-expanded', 'true');
    dom.input.setAttribute('aria-activedescendant', 'dash-result-0');
    dom.liveRegion.textContent = items.length + ' result' + (items.length !== 1 ? 's' : '') + ' available';
  }

  function getIcon(type) {
    var icons = {
      post: 'dashicons-admin-post',
      page: 'dashicons-admin-page',
      action: 'dashicons-superhero-alt',
      setting: 'dashicons-admin-generic',
      user: 'dashicons-admin-users',
      cpt: 'dashicons-archive',
      media: 'dashicons-admin-media',
      plugin: 'dashicons-admin-plugins'
    };
    return icons[type] || 'dashicons-search';
  }

  function getTypeLabel(type) {
    var labels = {
      post: 'Post',
      page: 'Page',
      action: 'Action',
      setting: 'Setting',
      user: 'User',
      cpt: 'Content',
      media: 'Media',
      plugin: 'Plugin'
    };
    return labels[type] || 'Item';
  }

  /* ── Keyboard Navigation ── */
  function navigate(direction, dom) {
    if (!results.length) return;

    var prev = activeIndex;
    if (direction === 'down') {
      activeIndex = activeIndex < results.length - 1 ? activeIndex + 1 : 0;
    } else {
      activeIndex = activeIndex > 0 ? activeIndex - 1 : results.length - 1;
    }

    var prevEl = dom.resultsList.querySelector('#dash-result-' + prev);
    var nextEl = dom.resultsList.querySelector('#dash-result-' + activeIndex);

    if (prevEl) {
      prevEl.classList.remove('is-active');
      prevEl.setAttribute('aria-selected', 'false');
    }
    if (nextEl) {
      nextEl.classList.add('is-active');
      nextEl.setAttribute('aria-selected', 'true');
      nextEl.scrollIntoView({ block: 'nearest' });
    }
    dom.input.setAttribute('aria-activedescendant', 'dash-result-' + activeIndex);
  }

  function selectResult() {
    if (activeIndex < 0 || activeIndex >= results.length) return;
    var item = results[activeIndex];

    // Action items fire a callback; navigation items redirect
    if (item.action) {
      executeAction(item.action);
    } else if (item.url) {
      window.location.href = item.url;
    }
    close(dom);
  }

  function executeAction(actionId) {
    var xhr = new XMLHttpRequest();
    var params = 'action=dash_execute_command&command=' + encodeURIComponent(actionId) +
      '&_wpnonce=' + dashConfig.nonce;
    xhr.open('POST', dashConfig.ajaxUrl, true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send(params);
  }

  /* ── Open / Close ── */
  function open(dom) {
    if (isOpen) return;
    isOpen = true;

    // Frame 0: input is visible, focused, accepting keystrokes
    dom.backdrop.classList.add('is-open');
    dom.modal.classList.add('is-open');
    dom.input.value = '';
    dom.input.focus();
    dom.resultsList.innerHTML = '';
    activeIndex = -1;
    results = [];

    // Lock body scroll
    document.body.style.overflow = 'hidden';

    // Dismiss onboarding tooltip if visible
    var tip = document.getElementById('dash-tooltip');
    if (tip && tip.parentNode) tip.parentNode.removeChild(tip);

    // Show recent items immediately (also preloads index)
    loadIndex(function (idx) {
      if (!isOpen) return;
      var query = dom.input.value.trim();
      if (!query) {
        var recents = idx.filter(function (item) { return item.recent; }).slice(0, MAX_RESULTS);
        if (recents.length) renderResults(recents, dom);
      }
    });

    // Start placeholder rotation
    startPlaceholderRotation(dom);

    // Dispatch custom event for other plugins
    document.dispatchEvent(new CustomEvent('dash:open'));
  }

  function close(dom) {
    if (!isOpen) return;
    isOpen = false;

    dom.backdrop.classList.remove('is-open');
    dom.modal.classList.remove('is-open');
    dom.input.setAttribute('aria-expanded', 'false');
    dom.input.setAttribute('aria-activedescendant', '');
    results = [];
    activeIndex = -1;

    // Restore body scroll
    document.body.style.overflow = '';

    stopPlaceholderRotation();
    document.dispatchEvent(new CustomEvent('dash:close'));
  }

  /* ── Placeholder Rotation ── */
  function startPlaceholderRotation(dom) {
    stopPlaceholderRotation();
    placeholderTimer = setInterval(function () {
      placeholderIdx = (placeholderIdx + 1) % PLACEHOLDERS.length;
      dom.input.placeholder = PLACEHOLDERS[placeholderIdx];
    }, PLACEHOLDER_INTERVAL);
  }

  function stopPlaceholderRotation() {
    if (placeholderTimer) {
      clearInterval(placeholderTimer);
      placeholderTimer = null;
    }
  }

  /* ── Search Handler (debounced) ── */
  function handleInput(dom) {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(function () {
      var raw = dom.input.value;
      var mode = getMode(raw);
      var query = stripModePrefix(raw);

      // Update mode indicator
      dom.modeIndicator.textContent = getModeLabel(mode);

      if (!query) {
        // Show recents on empty query
        if (index) {
          var recents = index.filter(function (item) { return item.recent; }).slice(0, MAX_RESULTS);
          renderResults(recents, dom);
        } else {
          renderResults([], dom);
        }
        return;
      }

      // User search always goes server-side
      if (mode === 'user') {
        searchServer(query, mode, function (items) {
          if (isOpen) renderResults(items, dom);
        });
        return;
      }

      // Client-side search
      if (index) {
        var items = searchIndex(index, query, mode);
        renderResults(items, dom);
      } else {
        // Index not loaded yet — fall back to server
        searchServer(query, mode, function (items) {
          if (isOpen) renderResults(items, dom);
        });
      }
    }, DEBOUNCE_MS);
  }

  /* ── Onboarding Tooltip ── */
  function maybeShowOnboarding(dom) {
    if (onboardingShown) return;
    if (dashConfig.onboardingSeen) return;

    var tooltip = el('div', 'dash-tooltip', {
      id: 'dash-tooltip',
      role: 'status'
    });
    tooltip.innerHTML = 'Press <kbd style="background:#3f3f46;padding:1px 5px;border-radius:3px;font-size:11px;">⌘K</kbd> to Dash';
    document.body.appendChild(tooltip);

    // Position near the admin bar
    tooltip.style.position = 'fixed';
    tooltip.style.top = '42px';
    tooltip.style.right = '20px';
    tooltip.style.left = 'auto';
    tooltip.style.bottom = 'auto';
    tooltip.style.transform = 'none';

    // Remove the ::before arrow for this positioning
    tooltip.style.setProperty('--arrow-display', 'none');

    requestAnimationFrame(function () {
      tooltip.classList.add('is-visible');
    });

    // Dismiss after 6s or on first Cmd+K
    onboardingShown = true;
    setTimeout(function () {
      tooltip.classList.remove('is-visible');
      setTimeout(function () {
        if (tooltip.parentNode) tooltip.parentNode.removeChild(tooltip);
      }, 200);
    }, 6000);

    // Mark as seen in user meta
    var xhr = new XMLHttpRequest();
    xhr.open('POST', dashConfig.ajaxUrl, true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send('action=dash_mark_onboarded&_wpnonce=' + dashConfig.nonce);
  }

  /* ── Initialize ── */
  var dom;

  function init() {
    // Bail if dashConfig not available (PHP didn't enqueue)
    if (typeof dashConfig === 'undefined') return;

    dom = buildDOM();

    // Global keyboard shortcut: Cmd+K / Ctrl+K
    document.addEventListener('keydown', function (e) {
      // Open
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) {
          close(dom);
        } else {
          open(dom);
        }
        return;
      }

      if (!isOpen) return;

      // Escape
      if (e.key === 'Escape') {
        e.preventDefault();
        close(dom);
        return;
      }

      // Arrow down
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        navigate('down', dom);
        return;
      }

      // Arrow up
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        navigate('up', dom);
        return;
      }

      // Enter
      if (e.key === 'Enter') {
        e.preventDefault();
        selectResult();
        return;
      }
    });

    // Input handler
    dom.input.addEventListener('input', function () {
      handleInput(dom);
    });

    // Click on result
    dom.resultsList.addEventListener('click', function (e) {
      var li = e.target.closest('.dash-result');
      if (!li) return;
      var idx = parseInt(li.id.replace('dash-result-', ''), 10);
      if (!isNaN(idx)) {
        activeIndex = idx;
        selectResult();
      }
    });

    // Click on result — hover activation
    dom.resultsList.addEventListener('mousemove', function (e) {
      var li = e.target.closest('.dash-result');
      if (!li) return;
      var idx = parseInt(li.id.replace('dash-result-', ''), 10);
      if (!isNaN(idx) && idx !== activeIndex) {
        var prevEl = dom.resultsList.querySelector('.dash-result.is-active');
        if (prevEl) {
          prevEl.classList.remove('is-active');
          prevEl.setAttribute('aria-selected', 'false');
        }
        activeIndex = idx;
        li.classList.add('is-active');
        li.setAttribute('aria-selected', 'true');
        dom.input.setAttribute('aria-activedescendant', li.id);
      }
    });

    // Click backdrop to close
    dom.backdrop.addEventListener('click', function (e) {
      if (e.target === dom.backdrop) close(dom);
    });

    // Onboarding — show after a short delay
    setTimeout(function () { maybeShowOnboarding(dom); }, 2000);
  }

  // Boot when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
