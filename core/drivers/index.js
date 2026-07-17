const path = require('path');
const fs = require('fs');

const DRIVERS = {};

function register(name, mod) {
  DRIVERS[name] = mod;
}

function getDriver(name) {
  if (DRIVERS[name]) return DRIVERS[name];
  const filePath = path.join(__dirname, name + '.js');
  if (fs.existsSync(filePath)) {
    const mod = require(filePath);
    DRIVERS[name] = mod;
    return mod;
  }
  throw new Error(`Driver "${name}" não encontrado. Disponíveis: ${Object.keys(DRIVERS).join(', ')}`);
}

function listDrivers() {
  const files = fs.readdirSync(__dirname).filter(f => f.endsWith('.js') && f !== 'index.js');
  const names = files.map(f => f.replace('.js', ''));
  return [...new Set([...Object.keys(DRIVERS), ...names])];
}

module.exports = { register, getDriver, listDrivers };
