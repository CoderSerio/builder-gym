# Solution - 08 SSR 可选（具体改法与原因）

## 需要改什么
1) Client（基于 `webpack.client.template.js` 或 Rspack 等价）
- `target: "web"`，入口 `src/client/index.tsx`。
- `output.filename/chunkFilename: "[name].[contenthash].js"`，`runtimeChunk: "single"`，`splitChunks: { chunks: "all" }`。
- JS/TSX loader：swc 或 babel（自动 JSX）。
- 生产可开启 `devtool: false` 或 `source-map`；开发用 cheap devtool。

2) Server（基于 `webpack.server.template.js` 或 rollup 方案）
- `target: "node"`，入口 `src/server/index.ts`。
- `externals`: 使用 `webpack-node-externals` 或手动排除 `node_modules`（如 react, react-dom/server）。
- 输出 `libraryTarget: "commonjs2"`，关闭压缩 `optimization.minimize: false`。
- loader 与 client 保持一致的 TS/JS 处理，但无需 HMR/React Refresh。

3) Rollup server 方案
- `external` 所有 node_modules。
- plugins: `nodeResolve({ preferBuiltins: true })`, `commonjs()`, `typescript()`。
- 输出 `dist/server/server.js` format cjs，sourcemap 便于调试。

4) 验证
- 先构建 server，再构建 client；使用简单 Node 脚本渲染 HTML 并确保 client bundle 可 hydrate。
- 查看 dist：client 产物有 runtime 独立 chunk，hash 稳定；server 产物未打包 node_modules。

## 为什么这样改
- SSR 需要区分运行时目标；将 browser 依赖塞进 server 包会膨胀并可能运行失败。
- external node_modules 避免重复打包，提高部署/启动速度。
- client 侧 runtime/splitChunks 保障缓存与首屏加载效率；server 侧保持精简与可调试性。
