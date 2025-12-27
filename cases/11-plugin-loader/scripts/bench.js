#!/usr/bin/env node
/* eslint-disable no-console */
const { spawn } = require('child_process');
const fs = require('fs');
const fsp = require('fs/promises');
const path = require('path');
const zlib = require('zlib');

const cwd = __dirname + '/..';

const variants = [
  { name: 'webpack+js', cmd: 'pnpm run build:webpack' },
  { name: 'rspack+js', cmd: 'pnpm run build:rspack:js' },
  { name: 'rspack+rust', cmd: 'pnpm run build:rspack:rust' },
  { name: 'rspack+native', cmd: 'pnpm run build:rspack:native' },
  { name: 'rspack+define', cmd: 'pnpm run build:rspack:define' }
];

async function rimraf(d) { await fsp.rm(d, { recursive: true, force: true }); }

function run(cmd) {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    const child = spawn(cmd, { cwd, stdio: 'inherit', shell: true, env: process.env });
    child.on('exit', (code) => {
      const ms = Date.now() - start;
      if (code === 0) resolve(ms);
      else reject(Object.assign(new Error(`Command failed: ${cmd}`), { ms, code }));
    });
  });
}

async function walk(dir) {
  const out = [];
  const entries = await fsp.readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...await walk(p));
    else if (e.isFile()) out.push(p);
  }
  return out;
}

function gzipSize(buf) { return new Promise((res, rej) => zlib.gzip(buf, (e, r) => e ? rej(e) : res(r.length))); }

async function measureDist() {
  const dist = path.join(cwd, 'dist');
  if (!fs.existsSync(dist)) return { size: 0, gzip: 0 };
  const files = await walk(dist);
  let size = 0, gzip = 0;
  for (const f of files) {
    const b = await fsp.readFile(f);
    size += b.length;
    gzip += await gzipSize(b);
  }
  return { size, gzip };
}

(async () => {
  const results = [];
  for (const v of variants) {
    await rimraf(path.join(cwd, 'dist')); // clean between runs
    console.log(`\n\n[bench] Running ${v.name} ...`);
    let ms;
    try {
      ms = await run(v.cmd);
    } catch (e) {
      console.warn(`[bench] ${v.name} failed: ${e.message}`);
      results.push({ name: v.name, ms: e.ms, size: 0, gzip: 0, ok: false });
      continue;
    }
    const { size, gzip } = await measureDist();
    results.push({ name: v.name, ms, size, gzip, ok: true });
  }

  // try to read i18n result count
  let keysCount = null;
  try {
    const json = JSON.parse(await fsp.readFile(path.join(cwd, 'dist/i18n.keys.json'), 'utf8'));
    keysCount = json.total;
  } catch (_) {}

  const rows = [['Variant', 'Time(ms)', 'Size', 'Gzip', 'OK']]
    .concat(results.map(r => [r.name, String(r.ms), `${(r.size/1024).toFixed(1)}KB`, `${(r.gzip/1024).toFixed(1)}KB`, r.ok ? 'Y' : 'N']));
  const colW = rows[0].map((_,i) => Math.max(...rows.map(r => r[i].length)));
  const lines = rows.map(r => r.map((c,i) => c.padEnd(colW[i])).join('  '));
  console.log('\n[bench] i18n keys detected:', keysCount == null ? 'N/A' : keysCount);
  console.log('\n' + lines.join('\n'));
})();
