#!/usr/bin/env node
/**
 * 无依赖 dev runner：为了教学，避免引入 concurrently。
 * 用两个子进程启动 remote/host 的 build + serve（简化版）。
 * 真实项目建议使用 dev server，这里先提供最小可运行链路。
 */
const { spawn } = require("child_process");

function parseArgs(argv) {
  const args = { tool: "webpack" };
  const idx = argv.indexOf("--tool");
  if (idx >= 0 && argv[idx + 1]) args.tool = argv[idx + 1];
  return args;
}

function run(cmd) {
  const child = spawn(cmd, { stdio: "inherit", shell: true, env: process.env });
  child.on("exit", (code) => {
    if (code && code !== 0) process.exitCode = code;
  });
  return child;
}

const { tool } = parseArgs(process.argv);

if (tool !== "webpack" && tool !== "rspack") {
  console.error("[dev-runner] --tool must be webpack or rspack");
  process.exit(1);
}

const buildRemote = tool === "webpack" ? "pnpm run build:remote:webpack" : "pnpm run build:remote:rspack";
const buildHost = tool === "webpack" ? "pnpm run build:host:webpack" : "pnpm run build:host:rspack";
const serveRemote = tool === "webpack" ? "pnpm run serve:remote:webpack" : "pnpm run serve:remote:rspack";
const serveHost = tool === "webpack" ? "pnpm run serve:host:webpack" : "pnpm run serve:host:rspack";

// 简化：先 build，再 serve。想要 HMR/增量开发请看 tasks/learning 的建议。
run(`${buildRemote} && ${buildHost} && ${serveRemote} & ${serveHost}`);


