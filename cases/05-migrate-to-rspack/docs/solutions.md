# Solution - 05 迁移到 Rspack（逐步对齐 tasks）

> 本答案的结构严格对齐 `docs/tasks.md` 的 1-4 步；每一步都包含：**操作** / **你需要改哪里** / **为什么** / **如何验收**。

## 1. 安装依赖

**操作**：按 `docs/learning.md` 的依赖清单安装即可。

---

## 2. 迁移配置：webpack → Rspack

### 2.1 先明确“对照组”做了什么（webpack）

**对照组配置文件**：`webpack.config.js`

**你需要关注的关键能力**：
- 入口：`src/index.jsx`
- JSX/JS 转译：`babel-loader` + `@babel/preset-react`
- CSS：`style-loader` + `css-loader`
- `devtool: "source-map"`（这是“慢”的来源之一）

### 2.2 把关键能力迁移到 Rspack（目标组）

**目标组配置文件**：`rspack.config.js`

**你需要改的点（迁移等价能力）**：
- entry：保持与 webpack 一致（仍是 `src/index.jsx`）
- JS/JSX：把 webpack 的 `babel-loader` 换成 Rspack 的 `builtin:swc-loader`
  - `jsc.parser.jsx: true` 让 SWC 能解析 JSX
  - `jsc.target` 选择一个你项目可接受的目标（示例用 `es2019`）
- CSS：先保持与 webpack 一致（`style-loader` + `css-loader`），降低迁移风险

**为什么这样改**：
- 迁移阶段优先保证“行为一致”，避免你把问题混进“工具差异”里
- `builtin:swc-loader` 让编译链变短，是 Rspack 在这关里的关键收益来源

**验收**：
- `pnpm -C cases/05-migrate-to-rspack run build:rspack` 能成功产出 `dist/*`
- 页面代码路径一致（入口一致、能正确渲染）

---

## 3. 开发体验优化（Rspack 侧）

**你需要改的点（性能/体验按钮）**：
1) **devtool**
- 开发模式下从 `source-map` 改为 `eval-cheap-module-source-map`（或同级别 cheap 方案）
- 目的：提升冷启动与增量/HMR 速度（用更轻的 sourcemap 策略换性能）

2) **持久化 cache**
- 开启 `cache: { type: "filesystem" }`
- 目的：二次启动/重复编译更快（尤其在 CI 或频繁重启时）

3) **lazyCompilation**
- 开启 `experiments.lazyCompilation.entries: true`
- 目的：减少首次启动需要编译的模块数量，降低冷启动工作量

**验收**：
- 连续执行两次 `build:rspack`，第二次耗时明显下降（cache 命中）
- 在真实 dev server 场景下（后续可扩展），修改单文件后响应更快

---

## 4. 记录迁移前后数据

**操作**：
```bash
pnpm -C cases/05-migrate-to-rspack run bench
```

**你需要记录**：
- webpack 对照组（迁移前）的构建耗时
- rspack 目标组（迁移后 + 优化后）的构建耗时

> 如果你要把“webpack vs rspack”都纳入 benchmark，本关可以扩展成两个 bench key 或两个 buildCommand；这里先按仓库现有 benchmark 机制记录本关产物即可。

---

## 完整配置参考（可直接复制）

### `rspack.config.js`
```js
const path = require("path");
const { defineConfig } = require("@rspack/cli");
const { HtmlRspackPlugin } = require("@rspack/core");
const { ReactRefreshRspackPlugin } = require("@rspack/plugin-react-refresh");

// 判断是否为 dev serve 场景（只有 dev 才需要 React Refresh）
const isDevServe = process.env.npm_lifecycle_event === "dev:rspack";

module.exports = defineConfig({
  mode: isDevServe ? "development" : "production",
  entry: {
    main: path.resolve(__dirname, "src/index.jsx")
  },
  resolve: {
    extensions: [".js", ".jsx", ".json"]
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].[contenthash].js",
    chunkFilename: "[name].[contenthash].js",
    clean: true
  },
  devtool: isDevServe ? "eval-cheap-module-source-map" : "source-map",
  plugins: [
    // 需要小心谨慎地处理这里，因为构建模式下使用这个插件可能会报错。
    new HtmlRspackPlugin({
      template: path.resolve(__dirname, "src/index.html")
    })
  ].concat(isDevServe ? [new ReactRefreshRspackPlugin()] : []),
  builtins: {
    react: {
      runtime: "automatic",
      development: true,
      // 生产模式下开启会报错
      refresh: isDevServe
    }
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: "builtin:swc-loader",
        options: {
          jsc: {
            parser: { syntax: "ecmascript", jsx: true },
            target: "es2019",
            transform: { react: { runtime: "automatic", refresh: isDevServe } }
          }
        }
      },
      { test: /\.css$/, use: ["style-loader", "css-loader"] }
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
