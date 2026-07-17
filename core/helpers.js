const path = require('path');
const fs = require('fs');

const CONFIG = JSON.parse(process.env.APP_CONFIG || '{}');
const BASE_URL = CONFIG.baseUrl || process.env.BASE_URL || 'https://dev.tuaagenda.app';
const SCREENSHOT_DIR = path.join(process.cwd(), 'screenshots');

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function screenshot(page, step, name) {
  const dir = path.join(SCREENSHOT_DIR, step);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const file = path.join(dir, `${name}.png`);
  await page.screenshot({ path: file, fullPage: true });
  console.log(`  📸 Screenshot: ${step}/${name}.png`);
}

async function navigateAndWait(page, url, description) {
  console.log(`\n📍 ${description}`);
  try {
    await page.goto(url, { waitUntil: 'load', timeout: 30000 });
    await sleep(2000);
    return true;
  } catch (err) {
    console.warn(`  ⚠️  Erro ao navegar: ${err.message}`);
    return false;
  }
}

async function tryClick(page, text, maxWait = 5000) {
  try {
    const el = page.locator('button, a, [role="button"], span, div').filter({ hasText: text }).first();
    await el.waitFor({ timeout: maxWait });
    await el.click();
    await sleep(1500);
    return true;
  } catch {
    return false;
  }
}

async function fillField(page, label, value) {
  try {
    const input = page.locator(
      `input[placeholder*="${label}" i],
       input[name*="${label}" i],
       input[id*="${label}" i],
       label:has-text("${label}") + input,
       label:has-text("${label}") ~ input`
    ).first();
    if (await input.isVisible({ timeout: 2000 }).catch(() => false)) {
      await input.fill(value);
      return true;
    }
  } catch {}
  return false;
}

async function tryNavigateTo(page, paths, label) {
  for (const p of paths) {
    const ok = await navigateAndWait(page, BASE_URL + p, `Tentando ${p}`);
    if (ok) return p;
  }
  for (const l of [label, ...paths.map(x => x.split('/').pop().replace(/-/g, ' '))]) {
    if (l && await tryClick(page, l)) return l;
  }
  return null;
}

async function runAllWithRetry(actions, maxRetries = 2) {
  for (const action of actions) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        await action();
        break;
      } catch (err) {
        if (attempt === maxRetries) throw err;
        console.warn(`  ⚠️  Tentativa ${attempt} falhou, tentando novamente...`);
        await sleep(2000);
      }
    }
  }
}

module.exports = {
  BASE_URL, SCREENSHOT_DIR, sleep, screenshot,
  navigateAndWait, tryClick, fillField, tryNavigateTo, runAllWithRetry
};
