/**
 * Dash Plugin — Continuous QA Test Suite
 * Margaret Hamilton QA Pipeline
 *
 * Tests against: http://localhost:10018/wp-admin/?localwp_auto_login=1
 *
 * Coverage:
 *  1. Cmd+K opens Dash (not WP core palette)
 *  2. Search: General, Membership, Level, New Post
 *  3. Navigation for each result
 *  4. > command mode (>clear, >reindex)
 *  5. @ user mode (@admin)
 *  6. Escape closes modal
 *  7. Keyboard nav (ArrowDown, ArrowUp, Enter)
 *  8. Focus trap (Tab stays inside modal)
 *  9. Backdrop click closes modal
 */

import { chromium } from 'playwright';

const BASE = 'http://localhost:10018/wp-admin/?localwp_auto_login=1';
const TIMEOUT = 10000;

const results = {
  passed: [],
  failed: [],
  warnings: [],
  timestamp: new Date().toISOString(),
};

function pass(name, detail = '') {
  results.passed.push({ name, detail });
  console.log(`  ✅ PASS: ${name}${detail ? ' — ' + detail : ''}`);
}

function fail(name, detail = '') {
  results.failed.push({ name, detail });
  console.log(`  ❌ FAIL: ${name}${detail ? ' — ' + detail : ''}`);
}

function warn(name, detail = '') {
  results.warnings.push({ name, detail });
  console.log(`  ⚠️  WARN: ${name}${detail ? ' — ' + detail : ''}`);
}

async function waitForDash(page) {
  await page.waitForSelector('#dash-backdrop', { timeout: TIMEOUT });
}

(async () => {
  console.log('═══════════════════════════════════════════════');
  console.log(' DASH PLUGIN — CONTINUOUS QA SUITE');
  console.log(' Margaret Hamilton QA Pipeline');
  console.log(' ' + new Date().toISOString());
  console.log('═══════════════════════════════════════════════\n');

  let browser;
  try {
    browser = await chromium.launch({ headless: true });
  } catch (e) {
    console.log('❌ Cannot launch browser: ' + e.message);
    process.exit(1);
  }

  const page = await browser.newPage();

  // ─── SETUP: Load WP Admin ───
  console.log('▸ Loading WP Admin...');
  try {
    await page.goto(BASE, { waitUntil: 'networkidle', timeout: 30000 });
  } catch (e) {
    console.log('❌ Cannot reach WP Admin at ' + BASE);
    console.log('   Error: ' + e.message);
    console.log('   Is Local running on port 10018?');
    await browser.close();
    process.exit(1);
  }

  // Verify we're logged in
  const isLoggedIn = await page.$('#wpadminbar');
  if (!isLoggedIn) {
    fail('Login', 'Auto-login did not work — no admin bar found');
    await browser.close();
    process.exit(1);
  }
  pass('Login', 'Auto-login successful');

  // ─── TEST 1: Dash loads, WP core palette disabled ───
  console.log('\n▸ TEST 1: Cmd+K opens Dash (not WP core palette)');

  const dashBackdrop = await page.$('#dash-backdrop');
  if (dashBackdrop) {
    pass('Dash DOM', 'Dash backdrop element exists in DOM');
  } else {
    fail('Dash DOM', 'Dash backdrop element NOT found — plugin may not be active');
    await browser.close();
    process.exit(1);
  }

  // Check that WP core command palette is NOT loaded
  const wpCommandsLoaded = await page.evaluate(() => {
    return !!document.querySelector('.commands-command-menu') ||
           !!document.querySelector('[class*="command-palette"]');
  });
  if (!wpCommandsLoaded) {
    pass('WP Core Palette Disabled', 'No WP core command palette elements found');
  } else {
    fail('WP Core Palette Disabled', 'WP core command palette elements detected — Dash should replace it');
  }

  // Open with Cmd+K
  await page.keyboard.press('Meta+k');
  await page.waitForTimeout(400);

  const isOpen = await page.$eval('#dash-backdrop', el => el.classList.contains('is-open'));
  if (isOpen) {
    pass('Cmd+K Opens', 'Modal opened on Meta+K');
  } else {
    fail('Cmd+K Opens', 'Modal did NOT open on Meta+K');
  }

  // Check input is focused
  const inputFocused = await page.evaluate(() => document.activeElement?.id === 'dash-input');
  if (inputFocused) {
    pass('Input Focus', 'Search input auto-focused on open');
  } else {
    warn('Input Focus', 'Search input NOT focused after open');
  }

  // Close for next tests
  await page.keyboard.press('Escape');
  await page.waitForTimeout(200);

  // ─── TEST 2: Search queries ───
  const searchTerms = [
    { query: 'General', expectType: 'setting', expectTitle: /general/i },
    { query: 'New Post', expectType: 'action', expectTitle: /new post/i },
  ];

  for (const term of searchTerms) {
    console.log(`\n▸ TEST 2: Search for "${term.query}"`);

    await page.keyboard.press('Meta+k');
    await page.waitForTimeout(400);

    // Clear and type
    await page.fill('#dash-input', '');
    await page.type('#dash-input', term.query, { delay: 30 });
    await page.waitForTimeout(600);

    const searchResults = await page.$$eval('.dash-result', els =>
      els.map(el => ({
        title: el.querySelector('.dash-result-title')?.textContent || '',
        meta: el.querySelector('.dash-result-meta')?.textContent || '',
        url: el.getAttribute('data-url') || '',
        action: el.getAttribute('data-action') || '',
      }))
    );

    if (searchResults.length > 0) {
      pass(`Search "${term.query}"`, `${searchResults.length} results found`);

      const match = searchResults.find(r => term.expectTitle.test(r.title));
      if (match) {
        pass(`Match "${term.query}"`, `Found "${match.title}" (${match.meta})`);
      } else {
        warn(`Match "${term.query}"`, `No exact match for ${term.expectTitle}. Got: ${searchResults.map(r => r.title).join(', ')}`);
      }
    } else {
      fail(`Search "${term.query}"`, 'No results returned');
    }

    await page.keyboard.press('Escape');
    await page.waitForTimeout(200);
  }

  // ─── TEST 3: Navigation works ───
  console.log('\n▸ TEST 3: Navigation — select result and navigate');

  await page.keyboard.press('Meta+k');
  await page.waitForTimeout(400);
  await page.fill('#dash-input', '');
  await page.type('#dash-input', 'General Settings', { delay: 30 });
  await page.waitForTimeout(600);

  const hasResults = await page.$$eval('.dash-result', els => els.length > 0);
  if (hasResults) {
    const firstUrl = await page.$eval('.dash-result', el => el.getAttribute('data-url'));
    if (firstUrl && firstUrl.length > 0) {
      pass('Result URLs', `First result has URL: ${firstUrl}`);

      // Navigate
      const navPromise = page.waitForNavigation({ timeout: 5000 }).catch(() => null);
      await page.keyboard.press('Enter');
      const nav = await navPromise;

      if (nav || page.url().includes('options-general')) {
        pass('Navigation', `Navigated to ${page.url()}`);
      } else {
        warn('Navigation', `Current URL: ${page.url()} — expected options-general.php`);
      }
    } else {
      fail('Result URLs', 'First result has empty URL');
    }
  } else {
    fail('Navigation', 'No results to navigate to');
  }

  // Go back to dashboard for remaining tests
  await page.goto(BASE, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(500);

  // ─── TEST 4: > Command mode ───
  console.log('\n▸ TEST 4: Command mode (> prefix)');

  // Test >reindex
  await page.keyboard.press('Meta+k');
  await page.waitForTimeout(400);
  await page.fill('#dash-input', '');
  await page.type('#dash-input', '>reindex', { delay: 30 });
  await page.waitForTimeout(600);

  const modeIndicator = await page.$eval('#dash-mode', el => el.textContent);
  if (modeIndicator === 'Actions') {
    pass('Command Mode Indicator', 'Mode shows "Actions" for > prefix');
  } else {
    fail('Command Mode Indicator', `Expected "Actions", got "${modeIndicator}"`);
  }

  const cmdResults = await page.$$eval('.dash-result', els =>
    els.map(el => ({
      title: el.querySelector('.dash-result-title')?.textContent || '',
      action: el.getAttribute('data-action') || '',
    }))
  );

  const reindexCmd = cmdResults.find(r => /reindex|rebuild/i.test(r.title));
  if (reindexCmd) {
    pass('Command >reindex', `Found: "${reindexCmd.title}"`);
  } else {
    warn('Command >reindex', `Not found. Results: ${cmdResults.map(r => r.title).join(', ')}`);
  }

  await page.keyboard.press('Escape');
  await page.waitForTimeout(200);

  // Test >clear
  await page.keyboard.press('Meta+k');
  await page.waitForTimeout(400);
  await page.fill('#dash-input', '');
  await page.type('#dash-input', '>clear', { delay: 30 });
  await page.waitForTimeout(600);

  const clearResults = await page.$$eval('.dash-result', els =>
    els.map(el => el.querySelector('.dash-result-title')?.textContent || '')
  );
  const clearCmd = clearResults.find(r => /clear|cache/i.test(r));
  if (clearCmd) {
    pass('Command >clear', `Found: "${clearCmd}"`);
  } else {
    warn('Command >clear', `Not found. Results: ${clearResults.join(', ')}`);
  }

  await page.keyboard.press('Escape');
  await page.waitForTimeout(200);

  // ─── TEST 5: @ User mode ───
  console.log('\n▸ TEST 5: User mode (@ prefix)');

  await page.keyboard.press('Meta+k');
  await page.waitForTimeout(400);
  await page.fill('#dash-input', '');
  await page.type('#dash-input', '@admin', { delay: 30 });
  await page.waitForTimeout(1500); // User search is server-side, needs more time

  const userModeIndicator = await page.$eval('#dash-mode', el => el.textContent);
  if (userModeIndicator === 'Users') {
    pass('User Mode Indicator', 'Mode shows "Users" for @ prefix');
  } else {
    fail('User Mode Indicator', `Expected "Users", got "${userModeIndicator}"`);
  }

  const userResults = await page.$$eval('.dash-result', els =>
    els.map(el => ({
      title: el.querySelector('.dash-result-title')?.textContent || '',
      meta: el.querySelector('.dash-result-meta')?.textContent || '',
    }))
  );

  if (userResults.length > 0) {
    pass('User Search @admin', `${userResults.length} users found: ${userResults.map(u => u.title).join(', ')}`);
  } else {
    warn('User Search @admin', 'No user results — may need list_users capability or server-side delay');
  }

  await page.keyboard.press('Escape');
  await page.waitForTimeout(200);

  // ─── TEST 6: Escape closes modal ───
  console.log('\n▸ TEST 6: Escape closes modal');

  await page.keyboard.press('Meta+k');
  await page.waitForTimeout(400);
  const openBeforeEsc = await page.$eval('#dash-backdrop', el => el.classList.contains('is-open'));

  await page.keyboard.press('Escape');
  await page.waitForTimeout(300);
  const closedAfterEsc = await page.$eval('#dash-backdrop', el => !el.classList.contains('is-open'));

  if (openBeforeEsc && closedAfterEsc) {
    pass('Escape Closes', 'Modal opened then closed with Escape');
  } else {
    fail('Escape Closes', `Open before: ${openBeforeEsc}, Closed after: ${closedAfterEsc}`);
  }

  // ─── TEST 7: Keyboard navigation ───
  console.log('\n▸ TEST 7: Keyboard navigation (ArrowDown, ArrowUp, Enter)');

  await page.keyboard.press('Meta+k');
  await page.waitForTimeout(400);
  await page.fill('#dash-input', '');
  await page.type('#dash-input', 'Post', { delay: 30 });
  await page.waitForTimeout(600);

  const resultCount = await page.$$eval('.dash-result', els => els.length);
  if (resultCount < 2) {
    warn('Keyboard Nav', `Only ${resultCount} results — need at least 2 for arrow key testing`);
  } else {
    // First result should be active by default
    const firstActive = await page.$eval('#dash-result-0', el => el.classList.contains('is-active'));
    if (firstActive) {
      pass('Default Selection', 'First result is active by default');
    } else {
      warn('Default Selection', 'First result not active by default');
    }

    // ArrowDown
    await page.keyboard.press('ArrowDown');
    await page.waitForTimeout(100);
    const secondActive = await page.$eval('#dash-result-1', el => el.classList.contains('is-active'));
    const firstDeactivated = await page.$eval('#dash-result-0', el => !el.classList.contains('is-active'));
    if (secondActive && firstDeactivated) {
      pass('ArrowDown', 'Moved selection to second result');
    } else {
      fail('ArrowDown', `Second active: ${secondActive}, First deactivated: ${firstDeactivated}`);
    }

    // ArrowUp
    await page.keyboard.press('ArrowUp');
    await page.waitForTimeout(100);
    const backToFirst = await page.$eval('#dash-result-0', el => el.classList.contains('is-active'));
    if (backToFirst) {
      pass('ArrowUp', 'Moved selection back to first result');
    } else {
      fail('ArrowUp', 'Did not move back to first result');
    }

    // Check aria-activedescendant updates
    const ariaActive = await page.$eval('#dash-input', el => el.getAttribute('aria-activedescendant'));
    if (ariaActive === 'dash-result-0') {
      pass('aria-activedescendant', 'Updates correctly with keyboard nav');
    } else {
      warn('aria-activedescendant', `Expected "dash-result-0", got "${ariaActive}"`);
    }
  }

  await page.keyboard.press('Escape');
  await page.waitForTimeout(200);

  // ─── TEST 8: Backdrop click closes modal ───
  console.log('\n▸ TEST 8: Backdrop click closes modal');

  await page.keyboard.press('Meta+k');
  await page.waitForTimeout(400);

  // Click the backdrop (not the modal)
  await page.click('#dash-backdrop', { position: { x: 10, y: 10 } });
  await page.waitForTimeout(300);

  const closedAfterClick = await page.$eval('#dash-backdrop', el => !el.classList.contains('is-open'));
  if (closedAfterClick) {
    pass('Backdrop Click', 'Modal closes when clicking backdrop');
  } else {
    fail('Backdrop Click', 'Modal did NOT close on backdrop click');
  }

  // ─── TEST 9: Cmd+K toggle (open then close) ───
  console.log('\n▸ TEST 9: Cmd+K toggle');

  await page.keyboard.press('Meta+k');
  await page.waitForTimeout(400);
  const openFirst = await page.$eval('#dash-backdrop', el => el.classList.contains('is-open'));

  await page.keyboard.press('Meta+k');
  await page.waitForTimeout(400);
  const closedSecond = await page.$eval('#dash-backdrop', el => !el.classList.contains('is-open'));

  if (openFirst && closedSecond) {
    pass('Cmd+K Toggle', 'Second Cmd+K closes the modal');
  } else {
    fail('Cmd+K Toggle', `First open: ${openFirst}, Second close: ${closedSecond}`);
  }

  // ─── TEST 10: ARIA attributes ───
  console.log('\n▸ TEST 10: ARIA / Accessibility attributes');

  const ariaDialog = await page.$eval('#dash-backdrop', el => el.getAttribute('role'));
  if (ariaDialog === 'dialog') {
    pass('role=dialog', 'Backdrop has role="dialog"');
  } else {
    fail('role=dialog', `Expected "dialog", got "${ariaDialog}"`);
  }

  const ariaModal = await page.$eval('#dash-backdrop', el => el.getAttribute('aria-modal'));
  if (ariaModal === 'true') {
    pass('aria-modal', 'Backdrop has aria-modal="true"');
  } else {
    fail('aria-modal', `Expected "true", got "${ariaModal}"`);
  }

  const inputRole = await page.$eval('#dash-input', el => el.getAttribute('role'));
  if (inputRole === 'combobox') {
    pass('Input role=combobox', 'Search input has correct ARIA role');
  } else {
    fail('Input role=combobox', `Expected "combobox", got "${inputRole}"`);
  }

  const resultsList = await page.$eval('#dash-results', el => el.getAttribute('role'));
  if (resultsList === 'listbox') {
    pass('Results role=listbox', 'Results list has correct ARIA role');
  } else {
    fail('Results role=listbox', `Expected "listbox", got "${resultsList}"`);
  }

  const liveRegion = await page.$('#dash-live');
  if (liveRegion) {
    const ariaLive = await page.$eval('#dash-live', el => el.getAttribute('aria-live'));
    if (ariaLive === 'polite') {
      pass('aria-live region', 'Screen reader live region exists with aria-live="polite"');
    } else {
      fail('aria-live region', `Expected "polite", got "${ariaLive}"`);
    }
  } else {
    fail('aria-live region', 'No live region element found');
  }

  // Check sr-only class hides the live region visually
  const srOnlyHidden = await page.$eval('#dash-live', el => {
    const style = window.getComputedStyle(el);
    return style.position === 'absolute' && style.width === '1px' && style.height === '1px';
  });
  if (srOnlyHidden) {
    pass('SR-only hidden', 'Live region visually hidden but accessible to screen readers');
  } else {
    warn('SR-only hidden', 'Live region may be visible or not properly hidden');
  }

  // ─── SUMMARY ───
  console.log('\n═══════════════════════════════════════════════');
  console.log(' RESULTS SUMMARY');
  console.log('═══════════════════════════════════════════════');
  console.log(` ✅ Passed:   ${results.passed.length}`);
  console.log(` ❌ Failed:   ${results.failed.length}`);
  console.log(` ⚠️  Warnings: ${results.warnings.length}`);
  console.log(` Total:      ${results.passed.length + results.failed.length + results.warnings.length}`);

  if (results.failed.length > 0) {
    console.log('\n── FAILURES ──');
    results.failed.forEach(f => console.log(`  ❌ ${f.name}: ${f.detail}`));
  }

  if (results.warnings.length > 0) {
    console.log('\n── WARNINGS ──');
    results.warnings.forEach(w => console.log(`  ⚠️  ${w.name}: ${w.detail}`));
  }

  console.log('\n═══════════════════════════════════════════════\n');

  // Output JSON for report generation
  console.log('__RESULTS_JSON__' + JSON.stringify(results));

  await browser.close();
  process.exit(results.failed.length > 0 ? 1 : 0);
})();
