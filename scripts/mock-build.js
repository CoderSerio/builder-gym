#!/usr/bin/env node
/**
 * 占位构建脚本：将 src 下的文件复制到 dist，便于 benchmark 在未安装真实工具时运行。
 * 实际关卡请替换为对应构建命令。
 */
const fs = require("fs");
const fsp = require("fs/promises");
const path = require("path");

const cwd = process.cwd();
const srcDir = path.join(cwd, "src");
const distDir = path.join(cwd, "dist");

async function rimraf(dir) {
  await fsp.rm(dir, { recursive: true, force: true });
}

async function copyDir(src, dest) {
  await fsp.mkdir(dest, { recursive: true });
  const entries = await fsp.readdir(src, { withFileTypes: true });
  for (const entry of entries) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      await copyDir(s, d);
    } else if (entry.isFile()) {
      await fsp.copyFile(s, d);
    }
  }
}

async function main() {
  if (!fs.existsSync(srcDir)) {
    console.log("[mock-build] src 不存在，跳过复制。");
    return;
  }
  await rimraf(distDir);
  await copyDir(srcDir, distDir);
  console.log("[mock-build] 已将 src 复制到 dist（占位构建）。");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});


