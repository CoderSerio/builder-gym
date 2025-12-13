# 01 基础入门：最小化打包

## 背景故事
你接手一个小项目，需要接入 webpack 真实构建，产出可上线的 JS/CSS，并了解开发/生产模式配置差异、loader 选择与性能优化。

## 当前状态
- `package.json` 的 `build` 命令调用占位脚本（`mock-build.js`），只是复制文件，没有真实打包。
- `webpack.config.js` 存在但仅演示最简配置（开发模式、无 contenthash、未接入构建命令）。
- 缺少 webpack 相关依赖（webpack、swc-loader 等）。


## 任务清单

### 1. 安装依赖

> swc-loader 可以看作是 rust 版本的 babel-loader，性能会更好

```bash
pnpm add -D webpack webpack-cli swc-loader @swc/core style-loader css-loader
```

### 2. 修改 `package.json` 的 build 命令

当前的脚本是临时的，需要替换为真实的 webpack 打包脚本。

```json
"build:dev": "node ../../scripts/mock-build.js",
"build": "node ../../scripts/mock-build.js"
```

### 3. 完善 `webpack.config.js`

当前配置是开发演示版，需补充：

- **生产输出**：`output.filename: "bundle.[contenthash].js"`（而非固定 `bundle.js`）。

- **mode 适配**：可通过 CLI `--mode` 或在配置里用环境变量动态切换。

- **devtool 优化**：
  - 开发：`eval-cheap-module-source-map`（快且可调试）
  - 生产：`false` 或 `source-map`（二选一即可）

- swc-loader 已配置好，如需对比 Babel 性能，可另建配置切换。

### 4. 验证
```bash
pnpm build            # 执行生产构建（webpack --mode production）
ls dist               # 查看产物：应有 dist/bundle.[hash].js
pnpm bench            # 跑基准：清理 dist → 构建 → 统计体积/耗时/gzip
```

### 5. 对比实验（可选）
- 安装 babel：`pnpm add -D babel-loader @babel/core @babel/preset-env`
- 在 webpack 配置中把 swc-loader 切为 babel-loader，重跑 `pnpm bench`，对比耗时。

## 诊断提示
- 运行 `pnpm build` 后检查 dist 是否存在带 hash 的 js 文件。
- 修改 src 代码重新构建，观察 contenthash 是否变化。
- 对比 swc vs babel 的构建时间（在 benchmark 输出中查看）。

## 扩展阅读
- [webpack 官方配置文档](https://webpack.js.org/configuration/)
- [SWC loader](https://swc.rs/docs/usage/swc-loader)
- contenthash 与浏览器缓存策略


