# Solution - 04 Runtime 稳定（逐步对齐 tasks）

## 1. 安装依赖

参考 `docs/learning.md`（webpack + 可选 Rspack）。

---

## 2. webpack 抽离 runtime

### 2.1 先跑反例（bad）
**操作**：
```bash
pnpm run build:bad
ls dist
```

**预期**：
- runtime 会混在入口 chunk 或其他业务 chunk 中（没有稳定独立的 runtime 文件）

**解释**：
- 反例配置在 `webpack.config.bad.js`：显式设置了 `optimization.runtimeChunk: false`，导致 runtime 与业务强耦合。

### 2.2 再跑正例（good）
**操作**：
```bash
pnpm run build:good
ls dist
```

**你需要改/对照的配置文件**：`webpack.config.good.js`

**关键改动点**：
- `optimization.runtimeChunk: "single"`：把 runtime 抽成独立 chunk
- `optimization.splitChunks.chunks: "all"`：允许拆分公共 chunk（方便观察效果）
- `output.filename/chunkFilename: "[name].[contenthash].js"`：统一命名与缓存策略

---

## 3. Rspack 做等价实现（可选）

**操作**：
```bash
pnpm run build:rspack
ls dist
```

**配置文件**：`rspack.config.js`

**关键点**：
- `optimization.runtimeChunk: "single"`
- `optimization.splitChunks.chunks: "all"`

---

## 4. 验证 hash 稳定性

**操作**：
1) 先构建一次正例：
```bash
pnpm run build:good
ls dist
```
2) 修改业务代码（例如 `src/app.js` 文案）后再构建一次：
```bash
pnpm run build:good
ls dist
```

**预期**：
- 业务 chunk 的 hash 变化
- runtime chunk 的 hash 尽量不变（更稳定）

**解释**：
- runtime 含 chunk 映射表与加载逻辑；如果 runtime 混在业务文件里，业务改动会污染 runtime，导致缓存抖动。
- 抽离 runtime + contenthash 的组合，目标是让“只变该变的文件”接近可落地的工程实践。

---

## 完整配置参考

### `webpack.config.good.js`
```js
const path = require("path");

/**
 * 正例：抽离 runtime，降低 hash 抖动。
 */
module.exports = {
  mode: "production",
  entry: path.resolve(__dirname, "src/index.js"),
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].[contenthash].js",
    // 和之前一样，记得给每个chunk单独的命名
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
    // single 代表把 runtime chunk 放到一个单独的
    // multiple 代表是应对 entry 有多个字段的情况，产生多个隔离的 runtime chunk
    runtimeChunk: "single",
    // 之前有学到过
    splitChunks: {
      chunks: "all"
    }
  }
};
```

### `rspack.config.js`
```js
const path = require("path");
const { defineConfig } = require("@rspack/cli");

module.exports = defineConfig({
  mode: "production",
  entry: {
    main: path.resolve(__dirname, "src/index.js")
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].[contenthash].js",
    chunkFilename: "[name].[contenthash].js",
    clean: true
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "builtin:swc-loader",
        options: {
          jsc: { parser: { syntax: "ecmascript" } }
        }
      },
      { test: /\.css$/, use: ["style-loader", "css-loader"] }
    ]
  },
  optimization: {
    runtimeChunk: "single",
    splitChunks: {
      chunks: "all"
    }
  }
});
```
