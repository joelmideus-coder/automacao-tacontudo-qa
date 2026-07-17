#!/usr/bin/env node

/**
 * QA Framework - Runner Principal
 * 
 * Uso:
 *   node run.js                    # Testa app definido em APP ou .env
 *   APP=minha-app node run.js      # Testa app específico
 *   TEST_LEVEL=full node run.js    # Nível do teste
 *   HEADLESS=true node run.js      # Modo invisível
 * 
 * Criado para ser 100% portátil entre projetos
 */

const path = require('path');
const fs = require('fs');

// ============================================================
// 1. CARREGAR CONFIGURAÇÃO
// ============================================================

// Arquivo .env (opcional)
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, 'utf-8').split('\n');
  for (const line of lines) {
    const clean = line.trim();
    if (!clean || clean.startsWith('#')) continue;
    const eq = clean.indexOf('=');
    if (eq > 0) {
      const key = clean.slice(0, eq).trim();
      const val = clean.slice(eq + 1).trim().replace(/^["']|["']$/g, '');
      if (!process.env[key]) process.env[key] = val;
    }
  }
}

// App a ser testado
const APP = process.env.APP || 'tuaagenda';
const APP_DIR = path.join(__dirname, 'apps', APP);
const CONFIG_PATH = path.join(APP_DIR, 'config.json');

if (!fs.existsSync(CONFIG_PATH)) {
  console.error(`\n❌ App "${APP}" não encontrado em apps/${APP}/`);
  console.error(`   Apps disponíveis:`);
  fs.readdirSync(path.join(__dirname, 'apps')).forEach(d => {
    if (fs.existsSync(path.join(__dirname, 'apps', d, 'config.json'))) {
      console.error(`   - ${d}`);
    }
  });
  console.error('');
  process.exit(1);
}

const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));

// Merge .env + config.json
if (process.env.BASE_URL) config.baseUrl = process.env.BASE_URL;
if (process.env.EMAIL_TESTE && config.credentials) config.credentials.email = process.env.EMAIL_TESTE;
if (process.env.SENHA_TESTE && config.credentials) config.credentials.password = process.env.SENHA_TESTE;

// ============================================================
// 2. INJETAR CONFIG NOS MÓDULOS DE TESTE
// ============================================================

config.appDir = APP_DIR;
process.env.APP_CONFIG = JSON.stringify(config);

// Forçar processo a rodar no diretório do app
process.chdir(APP_DIR);

// ============================================================
// 3. EXECUTAR RUNNER
// ============================================================

console.log(`
╔══════════════════════════════════════════════════════╗
║     QA Framework                                     ║
║     ${config.appName} - ${config.baseUrl}
║     Ambiente: ${process.env.APP_ENV || 'dev'}
╚══════════════════════════════════════════════════════╝
`);

require('./core/runner');
