# Solution - 03 Vendor 拆分（具体改法与原因）

## 需要改什么
1) webpack（基于 `webpack.optimized.template.js`）
- `output.filename/chunkFilename: "[name].[contenthash].js"`。
- `optimization.runtimeChunk: "single"`，隔离 runtime，降低 hash 抖动。
- `optimization.splitChunks.cacheGroups` 示例：
  - `framework`: test `/[\\/]node_modules[\\/](react|react-dom)[\\/]`, name: "framework", priority: 30, enforce: true
  - `libs`: test `/[\\/]node_modules[\\/]`, name: "libs", priority: 20, minChunks: 1
  - `commons`: test `src/(components|common)`, name: "commons", minChunks: 2, priority: 10
  - 其余走默认组，业务 chunk 保持独立
- `chunks: "all"` 以便提取异步与同步依赖。

2) rollup（基于 `rollup.manual.config.js`）
- `manualChunks(id)`：
  - react 相关 → "framework"
  - node_modules 其他 → "libs"
  - src/components 或 shared → "commons"
- `entryFileNames/chunkFileNames: "[name].[hash].js"`，format: `esm`。

## 为什么这样改
- 分层拆分确保低变动依赖（React）与偶变依赖（libs）命名稳定，业务修改不影响它们的 hash，提升浏览器缓存命中。
- runtime 单独输出避免 runtime 与业务耦合导致的频繁 hash 改变。
- rollup 的 manualChunks 与 webpack splitChunks 思路一致，可帮助理解不同 bundler 下的缓存策略。
