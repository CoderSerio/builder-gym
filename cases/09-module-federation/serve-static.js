#!/usr/bin/env node
/**
 * 无依赖静态文件服务：用于 Host/Remote 的 dist 目录本地托管。
 * 支持 CORS，便于 host 在不同端口拉取 remoteEntry.js。
 */
const http = require("http");
const fs = require("fs");
const path = require("path");

function parseArgs(argv) {
  const args = { dir: "", port: 3000, cors: false };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--dir") args.dir = argv[++i];
    else if (a === "--port") args.port = Number(argv[++i] || 3000);
    else if (a === "--cors") args.cors = true;
  }
  return args;
}

function contentType(filePath) {
  const ext = path.extname(filePath);
  if (ext === ".js") return "application/javascript; charset=utf-8";
  if (ext === ".css") return "text/css; charset=utf-8";
  if (ext === ".html") return "text/html; charset=utf-8";
  if (ext === ".json") return "application/json; charset=utf-8";
  return "application/octet-stream";
}

const { dir, port, cors } = parseArgs(process.argv);
const root = path.resolve(process.cwd(), dir || ".");

if (!fs.existsSync(root)) {
  console.error(`[serve-static] dir not found: ${root}`);
  process.exit(1);
}

const server = http.createServer((req, res) => {
  if (cors) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  }
  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    res.end();
    return;
  }

  const urlPath = (req.url || "/").split("?")[0];
  const safePath = path.normalize(urlPath).replace(/^(\.\.[/\\])+/, "");
  let filePath = path.join(root, safePath);

  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, "index.html");
  }

  if (!fs.existsSync(filePath)) {
    res.statusCode = 404;
    res.end("Not Found");
    return;
  }

  res.statusCode = 200;
  res.setHeader("Content-Type", contentType(filePath));
  fs.createReadStream(filePath).pipe(res);
});

server.listen(port, () => {
  console.log(`[serve-static] Serving ${root} at http://localhost:${port}`);
});


