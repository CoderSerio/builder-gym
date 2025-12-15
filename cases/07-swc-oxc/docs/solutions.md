# Solution - 07 SWC/OXC/Rspack 新兴链路（逐步对齐 tasks）

> 本答案的结构严格对齐 `docs/tasks.md` 的 1-5 步；每一步都包含：**操作** / **你需要改哪里** / **为什么** / **如何验收**。

## 1. 安装依赖

**操作**：按 `docs/learning.md` 的依赖清单安装即可。

**解释**：
- SWC 路线需要 `@swc/cli` + `@swc/core`
- Rspack 路线需要 `@rspack/cli` + `@rspack/core`（内置 `builtin:swc-loader`）
- OXC 路线（可选）按你选择的 CLI 工具安装
- 运行时依赖（本 demo 用到 React）需要 `react` + `react-dom`

**验收**：
- `pnpm -C cases/07-swc-oxc run build:swc` 能正常执行

---

## 2. 用 SWC 完成 TS/React 编译

**你需要改的文件**：`swc.config.json`

**关键配置点**：
- `jsc.parser.syntax: "typescript"`：告诉 SWC 源码是 TS 语法
- `jsc.parser.tsx: true`：支持 JSX
- `jsc.transform.react.runtime: "automatic"`：React 17+ 自动 runtime（不需要手动 `import React`）
- `jsc.target: "es2019"`：输出的 JS 语法级别
- `module.type: "es6"`：输出 ESM（`import/export`）
- `sourceMaps: true`：生成 sourcemap

**为什么用 SWC CLI 编译**：
- 让你直接感受"SWC 比 Babel/TSC 快多少"
- 理解 SWC 的配置结构（为后续在 Rspack 里用 `swc-loader` 打基础）

**验收**：
```bash
pnpm -C cases/07-swc-oxc run build:swc
ls cases/07-swc-oxc/dist
```
**预期**：
- `dist/index.js`、`dist/ui/App.js` 等文件被生成（保持目录结构）
- 打开产物确认：
  - TypeScript 类型注解被移除
  - JSX 被转成 `_jsx()` 或 `React.createElement()`（取决于 runtime）
  - 语法级别符合 `target: "es2019"`（如 `const` 保留、`?.` 保留）

---

## 3. 用 OXC 做替换对比（选做）

**你需要改的文件**：`oxc.config.json`（或通过 CLI 参数）

**为什么标记为"选做"**：
- OXC 的 CLI/配置 API 仍在快速迭代（截至本关编写时，不同版本可能不兼容）
- 本关的核心目标是"理解 Rust 工具链的收益"，用 SWC 已经能达成
- OXC 更适合"愿意尝鲜/跟踪上游变化"的同学

**如果你要尝试**：
- 参考 OXC 官方文档的最新 CLI 用法
- 确保配置和 SWC 等价（`target`、`jsx`、`modules` 对齐）
- 对比耗时与产物（**行为一致性比速度更重要**）

**验收**：
- 产物能跑，行为和 SWC 一致
- 如果 OXC 版本不稳定导致跑不通，可以跳过这一步（不影响本关核心目标）

---

## 4. 在 Rspack 中落地 SWC

**你需要改的文件**：`rspack.config.js`（本关已提供模板）

**关键配置点**：
- `module.rules`：配置 `builtin:swc-loader`（Rspack 内置，无需额外安装 `swc-loader`）
  - `test: /\.[jt]sx?$/`：匹配 `.js/.ts/.jsx/.tsx`
  - `loader: "builtin:swc-loader"`
  - `options.jsc.parser`：和 `swc.config.json` 保持一致
  - `options.jsc.target`：和 `swc.config.json` 保持一致
  - `options.jsc.transform.react`：和 `swc.config.json` 保持一致

- `cache: { type: "filesystem" }`：启用持久化缓存（二次启动更快）
- `experiments.lazyCompilation.entries: true`：按需编译（减少冷启动工作量）
- `devtool: "eval-cheap-module-source-map"`：开发模式用快速 sourcemap

**为什么这样配**：
- Rspack 本身是 Rust 写的，和 SWC 同语言栈，调用开销更小
- `builtin:swc-loader` 省去了 `babel-loader` 的 JS → Babel → 转译 → 回 JS 的开销
- `cache` + `lazyCompilation` 让"编译快"进一步放大成"开发体验快"

**验收**：
```bash
pnpm -C cases/07-swc-oxc run build:rspack
ls cases/07-swc-oxc/dist
```
**预期**：
- 构建成功，产出 `dist/main.[hash].js` 等 chunk
- 冷启动时间比用 `babel-loader` 的配置快很多
- 连续构建两次，第二次耗时显著下降（cache 命中）

---

## 5. 记录性能数据

**操作**：
```bash
pnpm -C cases/07-swc-oxc run bench
```

**你需要记录**：
- SWC CLI 直接编译的耗时
- Rspack + SWC 的构建耗时
- 如果你有 Babel 对照组（可以在 05 关或其他关里找），对比冷启动/热更新/CI 构建的时间差

**如何对比**：
- 你可以在本关里新增一个 `webpack.config.js`（用 `babel-loader`）作为对照组
- 或者直接和 05 关的 webpack 构建耗时对比
- 关键指标：冷启动时间、bundle 大小、gzip 后大小

**验收**：
- 能明确说出"SWC 比 Babel 快 XX 倍"（基于真实数据）
- 能解释"为什么 Rspack + SWC 比 webpack + Babel 快"（Rust 编译链路 + cache + lazyCompilation）

---

## 完整配置参考（可直接复制）

### `swc.config.json`（SWC CLI 编译用）
```json
{
  "$schema": "https://json.schemastore.org/swc",
  "jsc": {
    "parser": {
      "syntax": "typescript",
      "tsx": true,
      "decorators": false
    },
    "transform": {
      "react": {
        "runtime": "automatic",
        "refresh": false
      }
    },
    "target": "es2019"
  },
  "module": {
    "type": "es6"
  },
  "sourceMaps": true
}
```
> 注意：CLI 编译时 `refresh` 应该设为 `false`（refresh 是为 dev server 热更新准备的，纯编译不需要）

### `rspack.config.js`（Rspack + SWC 集成）
```js
const path = require("path");
const { defineConfig } = require("@rspack/cli");
const { HtmlRspackPlugin } = require("@rspack/core");

module.exports = defineConfig({
  mode: "development",
  entry: {
    main: path.resolve(__dirname, "src/index.tsx")
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].[contenthash].js",
    chunkFilename: "[name].[contenthash].js",
    clean: true
  },
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx", ".json"]
  },
  devtool: "eval-cheap-module-source-map",
  plugins: [
    new HtmlRspackPlugin({
      template: path.resolve(__dirname, "src/index.html")
    })
  ],
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        exclude: /node_modules/,
        loader: "builtin:swc-loader",
        options: {
          jsc: {
            parser: { syntax: "typescript", tsx: true },
            target: "es2019",
            transform: { react: { runtime: "automatic" } }
          }
        }
      }
    ]
  },
  cache: {
    type: "filesystem"
  },
  experiments: {
    lazyCompilation: {
      entries: true
    }
  }
});
```

### `package.json`（scripts 配置）
```json
{
  "scripts": {
    "build:swc": "swc src -d dist --config-file swc.config.json",
    "build:rspack": "rspack build -c rspack.config.js",
    "build": "pnpm run build:swc",
    "bench": "node ../../scripts/benchmark.js"
  }
}
```
