/**
 * 注意：这是旧的 SSR 示例代码（不使用 Next.js 的独立 SSR 实现）
 * 现在本章节已改用 Next.js + Turbopack，请参考 app/ 目录下的代码
 * 此文件仅作为参考保留，展示如何手动实现 SSR
 */
import React from "react";
import { App } from "../shared/App";
import { renderToString } from "react-dom/server";

export function render() {
  return `<!DOCTYPE html>
  <html>
    <head><title>SSR Demo</title></head>
    <body>
      <div id="app">${renderToString(React.createElement(App))}</div>
      <script src="/client.js"></script>
    </body>
  </html>`;
}

// 仅作为示例，实际使用 Next.js 时不需要手动调用
// console.log(render());
