const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const NAME = 'playwright';
const CHROME_PROFILE = path.join(require('os').homedir(), 'Library/Application Support/Google/Chrome');

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function launch(config) {
  const IS_HEADLESS = process.env.HEADLESS === 'true';
  const BASE_URL = config.baseUrl;

  let browser, page;

  if (IS_HEADLESS) {
    browser = await chromium.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-blink-features=AutomationControlled']
    });
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      locale: config.locale || 'pt-BR',
      timezoneId: config.timezone || 'America/Sao_Paulo'
    });
    page = await context.newPage();
  } else {
    const isChromeRunning = (() => {
      try {
        return require('child_process').execSync('pgrep -x "Google Chrome"', { stdio: 'pipe' }).toString().trim().length > 0;
      } catch { return false; }
    })();
    const useOwnProfile = !isChromeRunning && fs.existsSync(CHROME_PROFILE);
    browser = await chromium.launchPersistentContext(
      useOwnProfile ? CHROME_PROFILE : path.join(process.cwd(), '.playwright-profile'),
      {
        headless: false,
        viewport: { width: 1440, height: 900 },
        locale: config.locale || 'pt-BR',
        timezoneId: config.timezone || 'America/Sao_Paulo',
        args: ['--disable-blink-features=AutomationControlled', '--no-sandbox', '--disable-web-security'],
      }
    );
    page = browser.pages()[0] || await browser.newPage();
  }

  return { browser, page, context: null };
}

function createHelpers(config) {
  const BASE_URL = config.baseUrl;
  const SCREENSHOT_DIR = path.join(process.cwd(), 'screenshots');

  return {
    BASE_URL,
    SCREENSHOT_DIR,

    sleep,

    async screenshot(page, step, name) {
      const dir = path.join(SCREENSHOT_DIR, step);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      const file = path.join(dir, `${name}.png`);
      await page.screenshot({ path: file, fullPage: true });
      console.log(`  📸 Screenshot: ${step}/${name}.png`);
    },

    async navigateAndWait(page, url, description) {
      console.log(`\n📍 ${description}`);
      try {
        await page.goto(url, { waitUntil: 'load', timeout: 30000 });
        await sleep(2000);
        return true;
      } catch (err) {
        console.warn(`  ⚠️  Erro ao navegar: ${err.message}`);
        return false;
      }
    },

    async tryClick(page, text, maxWait = 5000) {
      try {
        const el = page.locator('button, a, [role="button"], span, div').filter({ hasText: text }).first();
        await el.waitFor({ timeout: maxWait });
        await el.click();
        await sleep(1500);
        return true;
      } catch {
        return false;
      }
    },

    async fillField(page, label, value) {
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
    },

    async tryNavigateTo(page, paths, label) {
      for (const p of paths) {
        const ok = await this.navigateAndWait(page, BASE_URL + p, `Tentando ${p}`);
        if (ok) return p;
      }
      for (const l of [label, ...paths.map(x => x.split('/').pop().replace(/-/g, ' '))]) {
        if (l && await this.tryClick(page, l)) return l;
      }
      return null;
    },

    async runAllWithRetry(actions, maxRetries = 2) {
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
    },

    async getPage(driverState) {
      return driverState.page;
    }
  };
}

async function destroy(state) {
  if (state.browser) {
    try { await state.browser.close(); } catch {}
  }
}

module.exports = { NAME, launch, createHelpers, destroy };
