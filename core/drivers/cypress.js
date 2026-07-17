const path = require('path');
const { execSync, spawn } = require('child_process');
const fs = require('fs');

const NAME = 'cypress';

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function launch(config) {
  try {
    execSync('npx cypress --version', { stdio: 'pipe' });
  } catch {
    console.warn('  ⚠️  Cypress não encontrado. Instale com: npm install cypress');
  }
  return { browser: null, page: null, context: null };
}

function createHelpers(config) {
  const SCREENSHOT_DIR = path.join(process.cwd(), 'screenshots');
  const CYPRESS_DIR = path.join(config.appDir, 'cypress');

  return {
    BASE_URL: config.baseUrl,
    SCREENSHOT_DIR,

    sleep,

    async screenshot(page, step, name) {
      const dir = path.join(SCREENSHOT_DIR, step);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      console.log(`  📸 Screenshot: ${step}/${name}.png`);
    },

    async runSpec(specName) {
      return new Promise((resolve, reject) => {
        const proc = spawn('npx', ['cypress', 'run', '--spec', `cypress/e2e/${specName}.cy.js`], {
          cwd: config.appDir,
          stdio: ['pipe', 'pipe', 'pipe'],
          env: { ...process.env }
        });
        let output = '';
        proc.stdout.on('data', d => { output += d.toString(); process.stdout.write(d); });
        proc.stderr.on('data', d => { output += d.toString(); process.stderr.write(d); });
        proc.on('close', code => {
          if (code === 0) resolve({ status: 'passed', output });
          else reject(new Error(`Spec ${specName} falhou (código ${code})`));
        });
        proc.on('error', reject);
      });
    },

    async navigateAndWait(page, url, description) {
      console.log(`\n📍 ${description}: ${url}`);
      return true;
    },

    async tryClick(page, text) { return false; },
    async fillField(page, label, value) { return false; },

    async tryNavigateTo(page, paths, label) { return null; },

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
    }
  };
}

async function destroy(state) {}

module.exports = { NAME, launch, createHelpers, destroy };
