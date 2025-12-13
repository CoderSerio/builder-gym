#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * 通用 benchmark 脚本
 * 流程：clean dist → 执行 build → 统计体积/压缩体积/耗时 → 表格输出。
 * 支持 per-case 基线，不强制跨工具对比。
 */
const fs = require("fs");
const fsp = require("fs/promises");
const path = require("path");
const { spawn } = require("child_process");
const { performance } = require("perf_hooks");
const zlib = require("zlib");

const args = process.argv.slice(2);
const cwdFlagIndex = args.indexOf("--cwd");
const targetDir =
  cwdFlagIndex >= 0 && args[cwdFlagIndex + 1]
    ? path.resolve(process.cwd(), args[cwdFlagIndex + 1])
    : process.cwd();

const defaultConfig = {
  distDir: "dist",
  buildCommand: "pnpm run build",
  baselineKey: path.basename(targetDir),
  clean: true
};

async function readJSONSafe(filePath) {
  try {
    const content = await fsp.readFile(filePath, "utf8");
    return JSON.parse(content);
  } catch (e) {
    return null;
  }
}

async function loadConfig() {
  const configPath = path.join(targetDir, "bench.config.json");
  const userConfig = await readJSONSafe(configPath);
  const pkg = await readJSONSafe(path.join(targetDir, "package.json"));
  const pkgBench = pkg && pkg.benchConfig ? pkg.benchConfig : null;
  return { ...defaultConfig, ...(pkgBench || {}), ...(userConfig || {}) };
}

async function loadBaseline(baselineKey) {
  const baselinePath = path.join(
    __dirname,
    "baseline.json"
  );
  const baseline = await readJSONSafe(baselinePath);
  return baseline ? baseline[baselineKey] : null;
}

async function rimrafSafe(dir) {
  try {
    await fsp.rm(dir, { recursive: true, force: true });
  } catch (e) {
    // ignore
  }
}

async function runCommand(command, cwd) {
  const start = performance.now();
  await new Promise((resolve, reject) => {
    const child = spawn(command, {
      cwd,
      stdio: "inherit",
      shell: true,
      env: process.env
    });
    child.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`Command failed: ${command} (code ${code})`));
    });
  });
  return performance.now() - start;
}

async function gzipSizeOfBuffer(buf) {
  return new Promise((resolve, reject) => {
    zlib.gzip(buf, (err, res) => {
      if (err) reject(err);
      else resolve(res.length);
    });
  });
}

async function walkFiles(dir) {
  const results = [];
  const entries = await fsp.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      const nested = await walkFiles(full);
      results.push(...nested);
    } else if (entry.isFile()) {
      results.push(full);
    }
  }
  return results;
}

async function measureDist(distDir) {
  const abs = path.resolve(targetDir, distDir);
  const exists = fs.existsSync(abs);
  if (!exists) {
    return {
      sizeBytes: 0,
      gzipBytes: 0,
      files: []
    };
  }
  const files = await walkFiles(abs);
  let sizeBytes = 0;
  let gzipBytes = 0;
  for (const file of files) {
    const buf = await fsp.readFile(file);
    sizeBytes += buf.length;
    gzipBytes += await gzipSizeOfBuffer(buf);
  }
  return { sizeBytes, gzipBytes, files };
}

function formatBytes(n) {
  if (!n) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const i = Math.min(units.length - 1, Math.floor(Math.log(n) / Math.log(1024)));
  const value = n / 1024 ** i;
  return `${value.toFixed(2)} ${units[i]}`;
}

function printReport({ buildMs, sizeBytes, gzipBytes, baseline }) {
  const rows = [
    ["Metric", "Current", "Baseline", "Δ"],
    [
      "Time (ms)",
      buildMs.toFixed(2),
      baseline?.timeMs ? baseline.timeMs.toFixed(2) : "-",
      baseline?.timeMs ? (buildMs - baseline.timeMs).toFixed(2) : "-"
    ],
    [
      "Size",
      formatBytes(sizeBytes),
      baseline?.sizeBytes ? formatBytes(baseline.sizeBytes) : "-",
      baseline?.sizeBytes ? formatBytes(sizeBytes - baseline.sizeBytes) : "-"
    ],
    [
      "Gzip",
      formatBytes(gzipBytes),
      baseline?.gzipBytes ? formatBytes(baseline.gzipBytes) : "-",
      baseline?.gzipBytes ? formatBytes(gzipBytes - baseline.gzipBytes) : "-"
    ]
  ];

  const colWidths = [0, 0, 0, 0];
  for (const row of rows) {
    row.forEach((cell, idx) => {
      colWidths[idx] = Math.max(colWidths[idx], String(cell).length);
    });
  }
  const line = () =>
    console.log(
      `| ${"-".repeat(colWidths[0])} | ${"-".repeat(colWidths[1])} | ${"-".repeat(colWidths[2])} | ${"-".repeat(colWidths[3])} |`
    );
  line();
  console.log(
    `| ${rows[0][0].padEnd(colWidths[0])} | ${rows[0][1].padEnd(colWidths[1])} | ${rows[0][2].padEnd(colWidths[2])} | ${rows[0][3].padEnd(colWidths[3])} |`
  );
  line();
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    console.log(
      `| ${String(row[0]).padEnd(colWidths[0])} | ${String(row[1]).padEnd(colWidths[1])} | ${String(row[2]).padEnd(colWidths[2])} | ${String(row[3]).padEnd(colWidths[3])} |`
    );
  }
  line();
  if (baseline?.note) {
    console.log(`Baseline note: ${baseline.note}`);
  }
}

async function main() {
  console.log(`Running benchmark in ${targetDir}`);
  const config = await loadConfig();
  const baseline = await loadBaseline(config.baselineKey);

  if (config.clean) {
    await rimrafSafe(path.join(targetDir, config.distDir));
  }

  let buildMs = 0;
  try {
    buildMs = await runCommand(config.buildCommand, targetDir);
  } catch (err) {
    console.error(`[benchmark] 构建失败：${err.message}`);
    process.exitCode = 1;
    return;
  }

  const { sizeBytes, gzipBytes, files } = await measureDist(config.distDir);
  if (!files.length) {
    console.warn(
      `[benchmark] 未找到构建产物 (${config.distDir})，请完成关卡任务后再测量。`
    );
  }

  printReport({ buildMs, sizeBytes, gzipBytes, baseline });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

