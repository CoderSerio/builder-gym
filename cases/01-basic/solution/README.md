# Solution - 01 基础入门（具体改法与原因）

## 需要改什么
1) `webpack.config.js`
- `mode: "production"`（发布）或 `development`（调试），明确环境。
- `entry`: 指向 `src/index.js`。
- `output.filename`: `bundle.[contenthash].js`（生产）保证缓存稳定；开发可保留 `bundle.js`。
- `devtool`: 开发用 `eval-cheap-module-source-map`，生产可关闭或用 `source-map`。
- JS 规则：`swc-loader`（jsc.parser jsx/ts 配置齐全，target=es2019）——若想对比 Babel，可留注释切换。
- CSS 规则：`style-loader` + `css-loader`。
- `output.clean: true` 保持 dist 干净。

2) 依赖
- 安装：`pnpm add -D webpack webpack-cli swc-loader @swc/core style-loader css-loader`（或对应 Babel 依赖）。

## 为什么这样改
- `contenthash` 让产物可长期缓存，避免每次全量失效。
- `swc-loader` 编译更快，便于新人感知性能差异。
- 明确 devtool 取舍，帮助理解调试 vs 速度的平衡。
- clean 输出避免旧文件干扰 benchmark 统计。
