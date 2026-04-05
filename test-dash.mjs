import { chromium } from 'playwright';

const BASE = 'http://localhost:10018/wp-admin/?localwp_auto_login=1';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  console.log('1. Loading WP Admin...');
  await page.goto(BASE, { waitUntil: 'networkidle' });

  // Force rebuild with correct command ID
  console.log('2. Forcing rebuild...');
  const result = await page.evaluate(async () => {
    const resp = await fetch(dashData.ajaxUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: 'action=dash_execute_command&command=reindex&_wpnonce=' + dashData.nonce,
    });
    return resp.json();
  });
  console.log('   Result:', JSON.stringify(result));

  // Reload to get fresh index
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  // Test
  console.log('\n3. Searching "Level"...');
  await page.keyboard.press('Meta+k');
  await page.waitForTimeout(300);
  await page.type('.dash-input', 'Level', { delay: 20 });
  await page.waitForTimeout(800);

  const results = await page.$$eval('.dash-result', els =>
    els.map(el => ({
      title: el.querySelector('.dash-result-title')?.textContent,
      url: el.getAttribute('data-url') || '(empty)',
    }))
  );
  console.log('   Results:', results);

  // Navigate to first result
  if (results.length > 0 && results[0].url !== '(empty)') {
    console.log('\n4. Navigating to', results[0].title);
    const nav = page.waitForNavigation({ timeout: 5000 }).catch(() => null);
    await page.keyboard.press('Enter');
    await nav;
    console.log('   URL:', page.url());
    console.log('   SUCCESS:', page.url().includes('post.php'));
  } else {
    console.log('   Still empty URLs - checking raw index...');
    const indexData = await page.evaluate(async () => {
      const resp = await fetch(dashData.indexUrl);
      const data = await resp.json();
      if (data.success) {
        return data.data.filter(i => i.title && i.title.toLowerCase().includes('level')).slice(0, 5);
      }
      return data;
    });
    console.log('   Raw index items:', JSON.stringify(indexData, null, 2));
  }

  await browser.close();
  console.log('\nDone.');
})();
