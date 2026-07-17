const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn, execSync } = require('child_process');
const CONFIG = JSON.parse(process.env.APP_CONFIG || '{}');

const PORT = 3456;
const FRAMEWORK_DIR = path.resolve(__dirname, '..');
const DESKTOP = path.join(require('os').homedir(), 'Desktop');

const sseClients = [];

function broadcast(type, data) {
  const msg = JSON.stringify({ type, data, ts: Date.now() });
  sseClients.forEach(res => res.write(`data: ${msg}\n\n`));
}

function runCommand(cmd, args, opts = {}, label) {
  broadcast('run-start', { label });
  const proc = spawn(cmd, args, { ...opts, shell: true, env: { ...process.env, ...opts.env } });
  const output = [];
  proc.stdout.on('data', d => {
    const txt = d.toString();
    output.push(txt);
    broadcast('run-output', { label, text: txt });
  });
  proc.stderr.on('data', d => {
    const txt = d.toString();
    output.push(txt);
    broadcast('run-output', { label, text: txt });
  });
  proc.on('close', code => {
    broadcast('run-end', { label, code, output: output.join('') });
  });
  proc.on('error', err => {
    broadcast('run-end', { label, code: -1, error: err.message });
  });
  return proc;
}

function serveFile(res, filePath, contentType) {
  try {
    const data = fs.readFileSync(filePath);
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  } catch {
    res.writeHead(404);
    res.end('Not found');
  }
}

function parseBody(req) {
  return new Promise(resolve => {
    let body = '';
    req.on('data', c => body += c);
    req.on('end', () => {
      try { resolve(JSON.parse(body)); }
      catch { resolve({}); }
    });
  });
}

const handlers = {
  '/': async (req, res) => serveFile(res, path.join(__dirname, 'dashboard.html'), 'text/html'),
  '/api/apps': async (req, res) => {
    const appsDir = path.join(FRAMEWORK_DIR, 'apps');
    const apps = [];
    if (fs.existsSync(appsDir)) {
      fs.readdirSync(appsDir).forEach(d => {
        const cfgPath = path.join(appsDir, d, 'config.json');
        if (fs.existsSync(cfgPath)) {
          const cfg = JSON.parse(fs.readFileSync(cfgPath, 'utf-8'));
          apps.push({ name: d, label: cfg.appName || d });
        }
      });
    }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ apps, current: process.env.APP || apps[0]?.name || null }));
  },
  '/api/run': async (req, res) => {
    const body = await parseBody(req);
    const { test, headless, app } = body;
    const appName = app || process.env.APP || 'tuaagenda';

    const baseEnv = { APP: appName, TEST_LEVEL: test, HEADLESS: headless ? 'true' : 'false' };
    const baseCwd = FRAMEWORK_DIR;

    const tasks = {
      'smoke': { cmd: 'node', args: ['run.js'], env: { ...baseEnv, TEST_LEVEL: 'smoke' } },
      'critical': { cmd: 'node', args: ['run.js'], env: { ...baseEnv, TEST_LEVEL: 'critical' } },
      'complete': { cmd: 'node', args: ['run.js'], env: { ...baseEnv, TEST_LEVEL: 'complete' } },
      'full': { cmd: 'node', args: ['run.js'], env: { ...baseEnv, TEST_LEVEL: 'full' } },
      'report': { cmd: 'node', args: ['core/report.js'], env: { APP: appName } },
      'report-bugs': { cmd: 'node', args: ['core/report-bugs.js'], env: { APP: appName } },
    };

    const task = tasks[test];
    if (!task) {
      res.writeHead(400);
      return res.end(JSON.stringify({ error: 'Unknown test' }));
    }

    const cwd = task.cwd || baseCwd;
    const label = task.label || test;
    const proc = runCommand(task.cmd, task.args, { cwd, env: task.env || {} }, label);

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ok: true, label, pid: proc.pid }));
  },
  '/api/sse': async (req, res) => {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
    });
    res.write(`data: ${JSON.stringify({ type: 'connected', data: { msg: 'SSE connected' } })}\n\n`);
    sseClients.push(res);
    req.on('close', () => {
      const idx = sseClients.indexOf(res);
      if (idx >= 0) sseClients.splice(idx, 1);
    });
  },
  '/api/status': async (req, res) => {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ok: true, clients: sseClients.length }));
  },
  '/api/kill': async (req, res) => {
    try {
      execSync('pkill -f "node run.js" 2>/dev/null; pkill -f "node core/runner" 2>/dev/null');
      broadcast('run-end', { label: 'killed', code: -1 });
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: true }));
    } catch {
      res.writeHead(500);
      res.end(JSON.stringify({ error: 'kill failed' }));
    }
  },
};

const mimeTypes = {
  '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml',
  '.json': 'application/json',
};

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const pathname = url.pathname;

  if (handlers[pathname]) return handlers[pathname](req, res);

  const filePath = path.join(__dirname, pathname === '/' ? 'dashboard.html' : pathname);
  const ext = path.extname(filePath);
  serveFile(res, filePath, mimeTypes[ext] || 'application/octet-stream');
});

server.listen(PORT, () => {
  console.log(`\n  🎯 QA Dashboard: http://localhost:${PORT}`);
  console.log(`  Pressione Ctrl+C para parar o servidor\n`);
});
