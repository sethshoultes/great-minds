/* Pinned v1.0 — Dashboard notes UI. Vanilla JS, zero deps. */
(function () {
  'use strict';

  var cfg   = window.pinnedConfig || {};
  var API   = cfg.apiBase  || '/wp-json/pinned/v1';
  var NONCE = cfg.nonce    || '';
  var I18N  = Object.assign({
    newNotePlaceholder: 'Type your note...',
    emptyHint:          'Double-click anywhere to add a note',
    deleteConfirm:      'Delete this note?',
  }, cfg.i18n || {});

  var COLORS    = ['yellow','blue','green','pink','orange'];
  var AGE_AGING = 3 * 86400000; /* 3 days  */
  var AGE_STALE = 7 * 86400000; /* 7 days  */

  var state = { saving: {} };

  /* --- Utilities ----------------------------------------- */
  function debounce(fn, ms) {
    var t;
    return function () {
      var a = arguments, c = this;
      clearTimeout(t);
      t = setTimeout(function () { fn.apply(c, a); }, ms);
    };
  }

  function agingClass(createdAt) {
    if (!createdAt) return 'pinned-note--fresh';
    var age = Date.now() - new Date(createdAt).getTime();
    if (age >= AGE_STALE) return 'pinned-note--stale';
    if (age >= AGE_AGING) return 'pinned-note--aging';
    return 'pinned-note--fresh';
  }

  function api(method, path, body) {
    var opts = { method: method, headers: { 'Content-Type': 'application/json', 'X-WP-Nonce': NONCE } };
    if (body !== undefined) opts.body = JSON.stringify(body);
    return fetch(API + path, opts).then(function (r) {
      if (!r.ok) throw new Error('Pinned: ' + r.status);
      return r.json();
    });
  }

  /* --- Build DOM helpers --------------------------------- */
  function buildColorPicker(cur) {
    var el = document.createElement('div');
    el.className = 'pinned-color-picker';
    el.setAttribute('role', 'toolbar');
    el.setAttribute('aria-label', 'Note color');
    COLORS.forEach(function (c) {
      var d = document.createElement('button');
      d.type = 'button';
      d.className = 'pinned-color-dot pinned-color-dot--' + c + (c === cur ? ' pinned-color-dot--active' : '');
      d.setAttribute('aria-label', c + ' note');
      d.setAttribute('aria-pressed', c === cur ? 'true' : 'false');
      d.dataset.color = c;
      el.appendChild(d);
    });
    return el;
  }

  function buildAckBtn(note) {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'pinned-ack' + (note.acknowledged ? ' pinned-ack--done' : '');
    btn.setAttribute('aria-label', note.acknowledged ? 'Acknowledged' : 'Mark as acknowledged');
    btn.setAttribute('aria-pressed', note.acknowledged ? 'true' : 'false');
    btn.dataset.noteId = note.id;
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 12 12');
    svg.setAttribute('aria-hidden', 'true');
    var p = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
    p.setAttribute('points', '1.5,6 4.5,9.5 10.5,2.5');
    svg.appendChild(p);
    btn.appendChild(svg);
    return btn;
  }

  function buildNote(note) {
    var el = document.createElement('article');
    el.className = ['pinned-note','pinned-note--'+(note.color||'yellow'),agingClass(note.created_at),'pinned-note--new'].join(' ');
    el.dataset.noteId = note.id || '';
    el.setAttribute('role', 'article');
    el.setAttribute('aria-label', 'Note: ' + (note.body || '').substring(0, 40));
    el.tabIndex = 0;

    /* Header */
    var hdr = document.createElement('div');
    hdr.className = 'pinned-note__header';
    hdr.setAttribute('aria-hidden', 'true');
    hdr.appendChild(buildColorPicker(note.color || 'yellow'));
    var del = document.createElement('button');
    del.type = 'button';
    del.className = 'pinned-delete';
    del.setAttribute('aria-label', 'Delete note');
    del.dataset.noteId = note.id || '';
    del.innerHTML = '&times;';
    hdr.appendChild(del);
    el.appendChild(hdr);

    /* Body */
    var body = document.createElement('div');
    body.className = 'pinned-note__body';
    body.contentEditable = 'true';
    body.setAttribute('role', 'textbox');
    body.setAttribute('aria-multiline', 'true');
    body.setAttribute('aria-label', 'Note text');
    body.dataset.placeholder = I18N.newNotePlaceholder;
    body.textContent = note.body || '';
    el.appendChild(body);

    /* Footer */
    var ftr = document.createElement('div');
    ftr.className = 'pinned-note__footer';
    var author = document.createElement('span');
    author.className = 'pinned-note__author';
    author.textContent = note.author_name || '';
    ftr.appendChild(author);
    ftr.appendChild(buildAckBtn(note));
    if (note.ack_count != null && note.ack_total) {
      var cnt = document.createElement('span');
      cnt.className = 'pinned-ack-count';
      cnt.textContent = note.ack_count + '/' + note.ack_total;
      ftr.appendChild(cnt);
    }
    el.appendChild(ftr);
    return el;
  }

  /* --- Note actions -------------------------------------- */
  function beginEdit(el) {
    el.classList.add('pinned-note--editing');
    el.setAttribute('aria-expanded', 'true');
    var body   = el.querySelector('.pinned-note__body');
    var picker = el.querySelector('.pinned-color-picker');
    if (picker) picker.classList.add('pinned-color-picker--visible');
    if (body)   body.focus();
  }

  function endEdit(el) {
    el.classList.remove('pinned-note--editing');
    el.removeAttribute('aria-expanded');
    var picker = el.querySelector('.pinned-color-picker');
    if (picker) picker.classList.remove('pinned-color-picker--visible');
    saveDebounced(el);
  }

  function saveNote(el) {
    var id    = el.dataset.noteId;
    var body  = el.querySelector('.pinned-note__body');
    if (!body) return;
    var text  = body.textContent.trim();
    var color = el.dataset.currentColor ||
      (el.className.match(/pinned-note--([a-z]+)/) || [])[1] || 'yellow';
    if (!id) {
      api('POST', '/notes', { body: text, color: color }).then(function (n) {
        el.dataset.noteId = n.id;
        updateEmpty(el.closest('.pinned-board'));
      }).catch(function () { el.classList.add('pinned-note--expiring'); });
    } else {
      api('PATCH', '/notes/' + id, { body: text, color: color }).catch(function () {});
    }
  }
  var saveDebounced = debounce(saveNote, 600);

  function changeColor(el, color) {
    COLORS.forEach(function (c) { el.classList.remove('pinned-note--' + c); });
    el.classList.add('pinned-note--' + color);
    el.dataset.currentColor = color;
    el.querySelectorAll('.pinned-color-dot').forEach(function (d) {
      var on = d.dataset.color === color;
      d.classList.toggle('pinned-color-dot--active', on);
      d.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    saveDebounced(el);
  }

  function toggleAck(el, btn) {
    var id = el.dataset.noteId;
    if (!id) return;
    var done = btn.classList.contains('pinned-ack--done');
    api('POST', '/notes/' + id + '/acknowledge', { acknowledged: !done }).then(function (n) {
      btn.classList.toggle('pinned-ack--done', n.acknowledged);
      btn.setAttribute('aria-pressed', n.acknowledged ? 'true' : 'false');
      btn.setAttribute('aria-label', n.acknowledged ? 'Acknowledged' : 'Mark as acknowledged');
      var cnt = btn.parentNode.querySelector('.pinned-ack-count');
      if (cnt && n.ack_count != null) cnt.textContent = n.ack_count + '/' + n.ack_total;
    }).catch(function () {});
  }

  function deleteNote(el) {
    if (!confirm(I18N.deleteConfirm)) return;
    var id = el.dataset.noteId;
    var board = el.closest('.pinned-board');
    el.classList.add('pinned-note--removing');
    el.addEventListener('animationend', function () {
      el.remove();
      updateEmpty(board);
    }, { once: true });
    if (id) api('DELETE', '/notes/' + id).catch(function () {});
  }

  function updateEmpty(board) {
    if (!board) return;
    board.classList.toggle('pinned-board--empty', !board.querySelector('.pinned-note'));
  }

  /* --- Double-click creation ----------------------------- */
  function createNote(board) {
    var el = buildNote({ body: '', color: 'yellow', created_at: new Date().toISOString(), author_name: cfg.userName || '', acknowledged: false });
    board.appendChild(el);
    board.classList.remove('pinned-board--empty');
    requestAnimationFrame(function () { beginEdit(el); });
    return el;
  }

  /* --- Presence ------------------------------------------ */
  function renderPresence(board, users) {
    var ex = board.querySelector('.pinned-presence');
    if (ex) ex.remove();
    if (!users || !users.length) return;
    var bar = document.createElement('div');
    bar.className = 'pinned-presence';
    bar.setAttribute('aria-label', 'Active users');
    users.slice(0, 5).forEach(function (u) {
      var d = document.createElement('span');
      d.className = 'pinned-presence__dot' + (u.active ? ' pinned-presence__dot--active' : '');
      d.setAttribute('title', u.name);
      d.setAttribute('aria-label', u.name + (u.active ? ' (active)' : ''));
      bar.appendChild(d);
    });
    if (users.length > 5) {
      var m = document.createElement('span');
      m.textContent = '+' + (users.length - 5);
      m.style.cssText = 'font-size:10px;color:var(--pm)';
      bar.appendChild(m);
    }
    board.appendChild(bar);
  }

  /* --- Load from REST ------------------------------------- */
  function loadNotes(board) {
    [1,2,3].forEach(function () {
      var sk = document.createElement('div');
      sk.className = 'pinned-skeleton';
      board.appendChild(sk);
    });
    api('GET', '/notes').then(function (data) {
      board.querySelectorAll('.pinned-skeleton').forEach(function (s) { s.remove(); });
      var notes = data.notes || data || [];
      if (!notes.length) board.classList.add('pinned-board--empty');
      notes.forEach(function (n) { board.appendChild(buildNote(n)); });
      setTimeout(function () {
        board.querySelectorAll('.pinned-note--new').forEach(function (n) { n.classList.remove('pinned-note--new'); });
      }, 400);
      if (data.presence) renderPresence(board, data.presence);
    }).catch(function () {
      board.querySelectorAll('.pinned-skeleton').forEach(function (s) { s.remove(); });
      board.classList.add('pinned-board--empty');
    });
  }

  /* --- Event delegation ---------------------------------- */
  function attachEvents(board) {
    board.addEventListener('dblclick', function (e) {
      var n = e.target.closest('.pinned-note');
      if (n) { beginEdit(n); return; }
      createNote(board);
    });

    board.addEventListener('click', function (e) {
      var addBtn = e.target.closest('.pinned-add-btn');
      if (addBtn) { e.stopPropagation(); createNote(board); return; }
      var dot = e.target.closest('.pinned-color-dot');
      if (dot) { e.stopPropagation(); var n = dot.closest('.pinned-note'); if (n) changeColor(n, dot.dataset.color); return; }
      var del = e.target.closest('.pinned-delete');
      if (del) { e.stopPropagation(); var n = del.closest('.pinned-note'); if (n) deleteNote(n); return; }
      var ack = e.target.closest('.pinned-ack');
      if (ack) { e.stopPropagation(); var n = ack.closest('.pinned-note'); if (n) toggleAck(n, ack); return; }
    });

    board.addEventListener('focusout', function (e) {
      var body = e.target.closest('.pinned-note__body');
      if (!body) return;
      var n = body.closest('.pinned-note');
      if (!n) return;
      if (e.relatedTarget && n.contains(e.relatedTarget)) return;
      endEdit(n);
    });

    board.addEventListener('input', function (e) {
      var body = e.target.closest('.pinned-note__body');
      if (body) { var n = body.closest('.pinned-note'); if (n) saveDebounced(n); }
    });

    board.addEventListener('keydown', function (e) {
      var n = e.target.closest('.pinned-note');
      if (!n) return;
      if (e.key === 'Enter' && e.target === n) { e.preventDefault(); beginEdit(n); return; }
      if (e.key === 'Escape') {
        var body = n.querySelector('.pinned-note__body');
        if (body && document.activeElement === body) { body.blur(); n.focus(); }
        return;
      }
      if ((e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === 'ArrowLeft' || e.key === 'ArrowUp') && !e.target.isContentEditable) {
        var notes = Array.from(board.querySelectorAll('.pinned-note'));
        var i = notes.indexOf(n);
        var nx = (e.key === 'ArrowRight' || e.key === 'ArrowDown') ? i + 1 : i - 1;
        if (nx >= 0 && nx < notes.length) { e.preventDefault(); notes[nx].focus(); }
      }
    });
  }

  /* --- Init ---------------------------------------------- */
  function init() {
    document.querySelectorAll('.pinned-board').forEach(function (board) {
      board.setAttribute('role', 'region');
      board.setAttribute('aria-label', 'Pinned notes');
      board.tabIndex = 0;
      var hint = document.createElement('div');
      hint.className = 'pinned-empty-hint';
      hint.textContent = I18N.emptyHint;
      hint.setAttribute('aria-hidden', 'true');
      board.appendChild(hint);
      board.classList.add('pinned-board--empty');
      attachEvents(board);
      loadNotes(board);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.Pinned = { init: init, createNote: createNote, loadNotes: loadNotes };
}());
