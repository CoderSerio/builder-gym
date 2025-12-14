# Solution - 03 Vendor 拆分

## 1. 安装依赖

**操作**：按 `docs/learning.md` 的依赖清单安装即可。

**解释**：
本章节需要 webpack/rollup 两条路线对照；
- webpack 侧需要 css/js loader
- rollup 侧需要 node-resolve/commonjs（以及按需的 css 插件）。

---

## 2. 设计分层拆分策略

**目标**：把产物拆成 4 层（命名只是示例，关键是“边界与稳定性”）：
- Framework：框架（React/ReactDOM）——低频变动
- Libs：其他三方库——中频变动
- Commons：业务公共模块——中频变动
- App：业务代码——高频变动

**解释**：
- 拆分的核心收益来自缓存：低频变动层应尽量保持 hash 稳定，业务改动不应触发它们重下。

---

## 3. webpack 实现 splitChunks

### 3.1 先跑反例（bad）
**操作**：
```bash
pnpm run build:webpack:bad
ls dist
```

**预期**：
- 只有一个大包（例如 `main.js`），没有 framework/libs 分层

**解释**：
- 单包会导致“改业务一行 → 整包 hash 变化 → 框架/三方库也被迫重下”。

### 3.2 再跑正例（good）
**操作**：
```bash
pnpm run build:webpack
ls dist
```

**你需要改的配置文件**：`webpack.good.js`

**关键改动点（建议先做这些）**：
- `output.filename/chunkFilename` 使用 `[name].[contenthash].js`
- `optimization.runtimeChunk: "single"`（或等价配置）隔离 runtime，降低 hash 抖动
- `optimization.splitChunks.cacheGroups` 分层拆分：
  - `framework`：匹配 react/react-dom（如果你真实项目用了 react）
  - `libs`：匹配 node_modules 其他依赖
  - `commons`：匹配业务公共目录

**解释**：
- `splitChunks` 决定“怎么拆”，`contenthash` 决定“拆完怎么命名”，`runtimeChunk` 决定“运行时代码是否会污染业务 chunk 的 hash”。

---

## 4. rollup 实现 manualChunks（对比）

**操作**：
```bash
pnpm run build:rollup
ls dist
```

**你需要改的配置文件**：`rollup.manual.config.js`

**关键改动点**：
- 实现 `manualChunks(id)`，把模块按 framework/libs/commons 分配
- `entryFileNames/chunkFileNames: "[name].[hash].js"`（rollup 的 hash 占位符）

**解释**：
- rollup 的拆分逻辑更显式（manualChunks），用它当对照能帮助你理解“分层拆包”本质是给模块分组。

---

## 5. 验证缓存稳定

**操作**：
1) 先构建一次正例：
```bash
pnpm run build:webpack
ls dist
```
2) 修改业务代码（例如 `src/app.js` 文案）后再次构建：
```bash
pnpm run build:webpack
ls dist
```

**预期**：
- App 层相关 chunk 的 hash 变化
- Framework/Libs 层 chunk 的 hash 尽量不变（如果还会变，多半是 runtime/拆分边界/模块 ID 策略导致，下一关会继续深入）

---

## 完整配置参考（可直接复制）

### `webpack.bad.config.js`（反例）
```js
const path = require("path");

module.exports = {
  mode: "production",
  entry: path.resolve(__dirname, "src/index.js"),
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "main.js",
    clean: true
  },
  module: {
    rules: [
      { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" },
      { test: /\.css$/, use: ["style-loader", "css-loader"] }
    ]
  },
  optimization: {
    splitChunks: false,
    runtimeChunk: false
  }
};
```

### `webpack.good.js`（正例模板：你需要补 cacheGroups）
```js
const path = require("path");

module.exports = {
  mode: "production",
  entry: path.resolve(__dirname, "src/index.js"),
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].[contenthash].js",
    chunkFilename: "[name].[contenthash].js",
    clean: true
  },
  module: {
    rules: [
      { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" },
      { test: /\.css$/, use: ["style-loader", "css-loader"] }
    ]
  },
  optimization: {
    splitChunks: {
      chunks: "all",
      cacheGroups: {
        // ... 在这里补 framework/libs/commons 的分层 ...
      }
    },
    runtimeChunk: "single"
  }
};
```

### `rollup.manual.config.js`（对照模板：你需要补 manualChunks）
```js
import path from "path";

export default {
  input: path.resolve("src/index.js"),
  output: {
    dir: "dist",
    format: "esm",
    entryFileNames: "[name].[hash].js",
    chunkFileNames: "[name].[hash].js"
  },
  treeshake: true,
  manualChunks(id) {
    // ... 在这里补 framework/libs/commons 的分层 ...
    return null;
  },
  plugins: [
    // ... 按需补 node-resolve/commonjs/css 等插件 ...
  ]
};
```
