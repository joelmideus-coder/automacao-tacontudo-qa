const path = require('path');
const fs = require('fs');
const CONFIG = JSON.parse(process.env.APP_CONFIG || '{}');
const drivers = require('./drivers');

const BASE_URL = CONFIG.baseUrl || process.env.BASE_URL || 'https://dev.tuaagenda.app';
const APP_DIR = CONFIG.appDir || process.cwd();
const SCREENSHOT_DIR = path.join(process.cwd(), 'screenshots');
const RESULTS_FILE = path.join(process.cwd(), 'results.json');
const DRIVER_NAME = CONFIG.driver || 'playwright';

const LEVELS = CONFIG.levels || { smoke: 1, critical: 2, complete: 3, full: 4 };
const LEVEL_LABELS = CONFIG.levelLabels || { 1: '🔴 Smoke', 2: '🔴 Crítica', 3: '🟡 Completa', 4: '🟢 Full' };
const TEST_LEVEL = (process.env.TEST_LEVEL || 'critical').toLowerCase();
const IS_HEADLESS = process.env.HEADLESS === 'true' || DRIVER_NAME !== 'playwright';
const LEVEL_MIN = LEVELS[TEST_LEVEL] || LEVELS.critical;

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function main() {
  const driverMod = drivers.getDriver(DRIVER_NAME);
  const h = driverMod.createHelpers(CONFIG);
  const MODULES_PATH = path.join(APP_DIR, 'tests');
  const moduleFiles = fs.readdirSync(MODULES_PATH).filter(f => f.endsWith('.js') && f !== 'helpers.js');
  const MODULES = moduleFiles.map(f => require(path.join(MODULES_PATH, f)));

  console.log('');
  console.log('╔══════════════════════════════════════════════════════╗');
  console.log(`║        ${CONFIG.appName || 'Test Framework'} - Suíte de Testes      ║`);
  console.log('╚══════════════════════════════════════════════════════╝');
  console.log(`\n📋 Nível: ${LEVEL_LABELS[LEVEL_MIN] || 'Custom'} (${TEST_LEVEL.toUpperCase()})`);
  console.log(`🌐 URL: ${BASE_URL}`);
  console.log(`🖥️  Driver: ${DRIVER_NAME} ${IS_HEADLESS ? '(Headless)' : ''}`);
  console.log(`📦 App: ${CONFIG.appName || 'Custom'}`);
  console.log('');

  const filtered = MODULES
    .filter(m => (LEVELS[m.level] || 5) <= LEVEL_MIN)
    .sort((a, b) => (LEVELS[a.level] || 5) - (LEVELS[b.level] || 5));

  let totalTests = 0;
  for (const mod of filtered) totalTests += mod.tests.length;
  console.log(`📦 ${filtered.length} módulos | ${totalTests} testes | Driver: ${DRIVER_NAME}`);
  console.log('');

  const driverState = await driverMod.launch(CONFIG);
  console.log(`✅ Driver ${DRIVER_NAME} inicializado\n`);

  const getPage = () => driverState.page;

  const results = { level: TEST_LEVEL, date: new Date().toISOString(), modules: [], config: { ...CONFIG, driver: DRIVER_NAME } };
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
        await test.fn(getPage(), h);
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
          await h.screenshot(getPage(), 'errors', `erro-${mod.category}-${safeName}`);
        } catch {}
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

  if (DRIVER_NAME === 'playwright' && !IS_HEADLESS) {
    console.log('🖥️  Navegador permanecerá aberto para inspeção.');
    console.log('   Pressione Ctrl+C no terminal para fechar.\n');
    await new Promise(() => {});
  }
  await driverMod.destroy(driverState);
}

main().catch(err => {
  console.error('\n💥 Erro fatal:', err.message);
  process.exit(1);
});
