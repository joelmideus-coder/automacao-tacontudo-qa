const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const CONFIG = JSON.parse(process.env.APP_CONFIG || '{}');

const BASE_URL = CONFIG.baseUrl || process.env.BASE_URL || 'https://dev.tuaagenda.app';
const APP_DIR = CONFIG.appDir || process.cwd();
const SCREENSHOT_DIR = path.join(process.cwd(), 'screenshots');
const RESULTS_FILE = path.join(process.cwd(), 'results.json');
const CHROME_PROFILE = path.join(require('os').homedir(), 'Library/Application Support/Google/Chrome');

const LEVELS = CONFIG.levels || { smoke: 1, critical: 2, complete: 3, full: 4 };
const LEVEL_LABELS = CONFIG.levelLabels || { 1: '🔴 Smoke', 2: '🔴 Crítica', 3: '🟡 Completa', 4: '🟢 Full' };
const TEST_LEVEL = (process.env.TEST_LEVEL || 'critical').toLowerCase();
const IS_HEADLESS = process.env.HEADLESS === 'true';
const LEVEL_MIN = LEVELS[TEST_LEVEL] || LEVELS.critical;

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function main() {
  const h = require('./helpers');
  const MODULES_PATH = path.join(APP_DIR, 'tests');
  const moduleFiles = fs.readdirSync(MODULES_PATH).filter(f => f.endsWith('.js') && f !== 'helpers.js');
  const MODULES = moduleFiles.map(f => require(path.join(MODULES_PATH, f)));

  console.log('');
  console.log('╔══════════════════════════════════════════════════════╗');
  console.log(`║        ${CONFIG.appName || 'Test Framework'} - Suíte de Testes      ║`);
  console.log('╚══════════════════════════════════════════════════════╝');
  console.log(`\n📋 Nível: ${LEVEL_LABELS[LEVEL_MIN] || 'Custom'} (${TEST_LEVEL.toUpperCase()})`);
  console.log(`🌐 URL: ${BASE_URL}`);
  console.log(`🖥️  Modo: ${IS_HEADLESS ? 'Headless' : 'Com visualização'}`);
  console.log(`📦 App: ${CONFIG.appName || 'Custom'}`);
  console.log('');

  const filtered = MODULES
    .filter(m => (LEVELS[m.level] || 5) <= LEVEL_MIN)
    .sort((a, b) => (LEVELS[a.level] || 5) - (LEVELS[b.level] || 5));

  let totalTests = 0;
  for (const mod of filtered) totalTests += mod.tests.length;
  console.log(`📦 ${filtered.length} módulos | ${totalTests} testes`);
  console.log('');

  if (!IS_HEADLESS) {
    const isChromeRunning = (() => {
      try {
        return require('child_process').execSync('pgrep -x "Google Chrome"', { stdio: 'pipe' }).toString().trim().length > 0;
      } catch { return false; }
    })();
    if (isChromeRunning) {
      console.log('⚠️  Chrome está aberto. Feche o Chrome primeiro para usar seu perfil.');
      console.log('   Ou use HEADLESS=true\n');
    }
  }

  let browser, page;

  if (IS_HEADLESS) {
    browser = await chromium.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-blink-features=AutomationControlled']
    });
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      locale: CONFIG.locale || 'pt-BR',
      timezoneId: CONFIG.timezone || 'America/Sao_Paulo'
    });
    page = await context.newPage();
    console.log('✅ Modo headless\n');
  } else {
    const useOwnProfile = !require('child_process').execSync('pgrep -x "Google Chrome"', { stdio: 'pipe' }).toString().includes('chrome') && fs.existsSync(CHROME_PROFILE);
    browser = await chromium.launchPersistentContext(
      useOwnProfile ? CHROME_PROFILE : path.join(process.cwd(), '.playwright-profile'),
      {
        headless: false,
        viewport: { width: 1440, height: 900 },
        locale: CONFIG.locale || 'pt-BR',
        timezoneId: CONFIG.timezone || 'America/Sao_Paulo',
        args: ['--disable-blink-features=AutomationControlled', '--no-sandbox', '--disable-web-security'],
      }
    );
    page = browser.pages()[0] || await browser.newPage();
    console.log(useOwnProfile ? '✅ Usando perfil Chrome logado\n' : '⚠️  Perfil limpo\n');
  }

  const results = { level: TEST_LEVEL, date: new Date().toISOString(), modules: [], config: CONFIG };
  let passed = 0, failed = 0, skipped = 0;

  for (const mod of filtered) {
    const levelTag = LEVEL_LABELS[LEVELS[mod.level]] || '⚪';
    console.log(`\n┌─────────────────────────────────────────────────────`);
    console.log(`${levelTag} Módulo: ${mod.category}`);
    console.log(`└─────────────────────────────────────────────────────`);

    const moduleResult = { category: mod.category, level: mod.level, tests: [] };

    for (const test of mod.tests) {
      process.stdout.write(`  ▶ ${test.name}... `);
      const startTime = Date.now();
      try {
        await test.fn(page, h);
        const elapsed = Date.now() - startTime;
        console.log(`  ✅ (${elapsed}ms)`);
        passed++;
        moduleResult.tests.push({ name: test.name, status: 'passed', elapsed });
      } catch (err) {
        const elapsed = Date.now() - startTime;
        console.log(`  ❌ (${elapsed}ms)`);
        console.log(`     ${err.message}`);
        failed++;
        moduleResult.tests.push({ name: test.name, status: 'failed', error: err.message, elapsed });
        try {
          const safeName = test.name.replace(/[^a-zA-Z0-9]/g, '_');
          await h.screenshot(page, 'errors', `erro-${mod.category}-${safeName}`);
        } catch {
          try {
            const pages = browser.pages ? browser.pages() : [];
            if (pages.length > 0) { page = pages[0]; await h.screenshot(page, 'errors', `erro-${mod.category}-${safeName}`); }
          } catch {}
        }
      }
      await sleep(CONFIG.testInterval || 500);
    }
    results.modules.push(moduleResult);
  }

  results.summary = { passed, failed, skipped, total: passed + failed + skipped };
  fs.writeFileSync(RESULTS_FILE, JSON.stringify(results, null, 2));

  console.log('\n══════════════════════════════════════════════════════');
  console.log('📊 RESULTADO FINAL');
  console.log('══════════════════════════════════════════════════════');
  console.log(`  ✅ Passaram: ${passed}`);
  console.log(`  ❌ Falharam: ${failed}`);
  console.log(`  ⏭️  Pulados: ${skipped}`);
  console.log(`  📁 Screenshots: ${SCREENSHOT_DIR}`);
  console.log(`  📊 Resultados: ${RESULTS_FILE}`);
  console.log('══════════════════════════════════════════════════════\n');

  if (!IS_HEADLESS) {
    console.log('🖥️  Navegador permanecerá aberto para inspeção.');
    console.log('   Pressione Ctrl+C no terminal para fechar.\n');
    await new Promise(() => {});
  }
  if (IS_HEADLESS) await browser.close();
}

main().catch(err => {
  console.error('\n💥 Erro fatal:', err.message);
  process.exit(1);
});
