# Solution - 01 缓存友好的构建（逐步对齐 tasks）

> 本答案的标题严格对齐 `tasks.md` 的步骤，建议对照阅读。

## 1. 安装依赖

**操作**：
```bash
pnpm add -D webpack webpack-cli swc-loader @swc/core style-loader css-loader
```

**解释**：
- `webpack/webpack-cli`：执行真实构建
- `swc-loader/@swc/core`：编译 JS（更快）
- `css-loader/style-loader`：让 JS 能 `import './styles.css'`

---

## 2. 跑通反例（bad）

**操作**：
```bash
pnpm run build:bad
ls dist/bad
```

**预期**：
- 你会得到 `dist/bad/bundle.js`（固定文件名）

**解释**：
- 固定文件名意味着 URL 稳定，但内容变更会让缓存策略变得尴尬（要么每次校验/重下，要么容易拿旧资源）。

---

## 3. 跑通正例（good）

**操作**：
```bash
pnpm run build:good
ls dist/good
```

**预期**：
- 你会看到 `bundle.<hash>.js`（例如 `bundle.a3f2b1c9.js`）

**解释**：
- `[contenthash]` 是 webpack 内置占位符，构建时会用内容 hash 替换。
- 内容变 → hash 变 → 文件名变 → 浏览器自动下载新文件；内容不变 → 文件名不变 → 可长期缓存。

---

## 4. 验证“多版本共存”

**操作**：
1) 第一次构建：
```bash
pnpm run build:good
ls dist/good
```
2) 修改 `src/index.js`（随便改一行文案）后，再构建一次：
```bash
pnpm run build:good
ls dist/good
```

**预期**：
- `dist/good/` 下会同时存在至少两份不同 hash 的 bundle 文件

**解释**：
- 这是本关刻意设计：`webpack.good.config.js` 里 `output.clean: false`，用来让你看到“旧版本文件仍可被老用户命中，新版本文件供新用户下载”的真实发布形态。

---

## 5. 解释原因（参考答案）
- `bundle.js`：URL 固定，发布后必须依赖“每次校验/禁用强缓存/强制刷新”等策略，体验与成本都不理想。
- `bundle.[contenthash].js`：URL 随内容变化，天然支持“长效缓存 + 精准更新 + 多版本共存”。

---

## 6. 跑基准（可选）

**操作**：
```bash
pnpm bench
```

**说明**：
- 本关 benchmark 默认统计 `dist/good`（因为它代表“缓存友好的正例输出”）。

---

## 完整代码参考

### `package.json`（scripts 部分）
```json
{
  "scripts": {
    "build:bad": "webpack --mode production --config webpack.bad.config.js",
    "build:good": "webpack --mode production --config webpack.good.config.js",
    "build": "pnpm run build:bad"
  }
}
```

### `webpack.bad.config.js`
```js
const path = require("path");

module.exports = {
  mode: "production",
  entry: path.resolve(__dirname, "src/index.js"),
  output: {
    path: path.resolve(__dirname, "dist/bad"),
    filename: "bundle.js",
    clean: true
  },
  module: {
    rules: [
      { test: /\\.(js|jsx|ts|tsx)$/, exclude: /node_modules/, use: "swc-loader" },
      { test: /\\.css$/, use: ["style-loader", "css-loader"] }
    ]
  }
};
```

### `webpack.good.config.js`
```js
const path = require("path");

module.exports = {
  mode: "production",
  entry: path.resolve(__dirname, "src/index.js"),
  output: {
    path: path.resolve(__dirname, "dist/good"),
    filename: "bundle.[contenthash:8].js",
    clean: false
  },
  module: {
    rules: [
      { test: /\\.(js|jsx|ts|tsx)$/, exclude: /node_modules/, use: "swc-loader" },
      { test: /\\.css$/, use: ["style-loader", "css-loader"] }
    ]
  }
};
```
