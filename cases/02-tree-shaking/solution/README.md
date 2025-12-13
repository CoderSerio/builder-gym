# Solution - 02 Tree Shaking（具体改法与原因）

## 需要改什么
1) `package.json`
- 增加 `"sideEffects": ["*.css"]`（或列出确有副作用的文件），其余默认为可摇树。
- 若使用 ESM，设置 `"type": "module"` 或在 `exports` 中声明 ESM/CJS。

2) 源码
- 将 `legacy.cjs` 改成 ESM（`export const ...`）或在 webpack/rollup 里用 commonjs 插件处理。
- 确保入口和工具链使用 ESM，避免 `require` 动态导入阻断静态分析。

3) webpack
- `optimization.usedExports: true`，`optimization.sideEffects: true`，`optimization.concatenateModules: true`。
- 产物：`filename/chunkFilename` 使用 `[name].[contenthash].js`。
- loader：改为 `swc-loader` 或精简 babel 配置，减少无关插件。

4) rollup
- 启用 treeshake（默认即可，显式 `treeshake: true`）。
- 添加 `@rollup/plugin-node-resolve`、`@rollup/plugin-commonjs`，必要时 `@rollup/plugin-babel` 或 swc 插件。
- `manualChunks` 可按依赖分组，产物 `dir: dist`，format: `esm`。

## 为什么这样改
- `sideEffects` 正确声明可让构建器大胆删除未用代码，同时保留确实有副作用的样式/Polyfill。
- 统一 ESM 让静态分析生效，避免 CJS 动态特性破坏摇树。
- webpack 的 usedExports/concatenateModules 结合 ESM 可减少包裹开销；rollup 天生 treeshake，但仍需处理 commonjs。
- contenthash 便于对比优化前后体积变化与缓存表现。
