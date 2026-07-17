const path = require('path');
const fs = require('fs');
const { execSync, spawn } = require('child_process');

const NAME = 'maestro';

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function launch(config) {
  // Maestro nao precisa de browser launch
  // Mas verificamos se o CLI existe
  try {
    execSync('maestro --version', { stdio: 'pipe' });
  } catch {
    console.warn('  ⚠️  Maestro CLI não encontrado. Instale com: curl -Ls "https://get.maestro.mobile.dev" | bash');
  }
  return { browser: null, page: null, context: null };
}

function createHelpers(config) {
  const SCREENSHOT_DIR = path.join(process.cwd(), 'screenshots');
  const MAESTRO_DIR = path.join(config.appDir, 'maestro');

  return {
    BASE_URL: config.baseUrl,
    SCREENSHOT_DIR,
    MAESTRO_DIR,

    sleep,

    async screenshot(page, step, name) {
      // Maestro captura screenshot via comando
      const dir = path.join(SCREENSHOT_DIR, step);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      // O screenshot e feito pelo proprio comando maestro
      console.log(`  📸 Screenshot: ${step}/${name}.png`);
    },

    async runFlow(flowName) {
      const flowFile = path.join(MAESTRO_DIR, flowName + '.yaml');
      if (!fs.existsSync(flowFile)) {
        throw new Error(`Flow não encontrado: ${flowName}.yaml`);
      }
      return new Promise((resolve, reject) => {
        const proc = spawn('maestro', ['test', flowFile], {
          stdio: ['pipe', 'pipe', 'pipe'],
          env: { ...process.env }
        });
        let output = '';
        proc.stdout.on('data', d => { output += d.toString(); process.stdout.write(d); });
        proc.stderr.on('data', d => { output += d.toString(); process.stderr.write(d); });
        proc.on('close', code => {
          if (code === 0) resolve({ status: 'passed', output });
          else reject(new Error(`Flow ${flowName} falhou (código ${code})`));
        });
        proc.on('error', reject);
      });
    },

    async screenshot(page, step, name) {
      const dir = path.join(SCREENSHOT_DIR, step);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      const file = path.join(dir, `${name}.png`);
      try {
        execSync(`maestro screenshot ${file}`, { stdio: 'pipe' });
        console.log(`  📸 Screenshot: ${step}/${name}.png`);
      } catch {
        console.warn(`  ⚠️  Erro ao capturar screenshot`);
      }
    },

    // Atalhos compativeis com a interface Playwright
    async navigateAndWait(page, url, description) {
      console.log(`\n📍 ${description}: ${url}`);
      try {
        execSync(`maestro open ${url}`, { stdio: 'pipe', timeout: 30000 });
        await sleep(2000);
        return true;
      } catch (err) {
        console.warn(`  ⚠️  Erro ao navegar: ${err.message}`);
        return false;
      }
    },

    async tryClick(page, text) {
      try {
        execSync(`maestro tap "${text}"`, { stdio: 'pipe', timeout: 10000 });
        await sleep(1500);
        return true;
      } catch {
        return false;
      }
    },

    async fillField(page, label, value) {
      try {
        execSync(`maestro input "${label}" "${value}"`, { stdio: 'pipe', timeout: 10000 });
        return true;
      } catch {
        return false;
      }
    },

    async tryNavigateTo(page, paths, label) {
      for (const p of paths) {
        const ok = await this.navigateAndWait(page, config.baseUrl + p, `Tentando ${p}`);
        if (ok) return p;
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
    }
  };
}

async function destroy(state) {
  // Maestro nao precisa cleanup
}

module.exports = { NAME, launch, createHelpers, destroy };
