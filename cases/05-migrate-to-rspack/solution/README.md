# Solution - 05 迁移 Rspack（具体改法与原因）

## 需要改什么
1) 将 `webpack.legacy.js` 迁移到 `rspack.config.template.js`
- loader：用 `builtin:swc-loader` 取代 `babel-loader`（jsc.parser jsx, target es2019）。
- `builtins.react` 开启 `runtime: "automatic"`, `refresh: true` 支持 HMR。
- `devtool: "eval-cheap-module-source-map"`（开发更快）；生产可切 `source-map` 或关闭。
- `cache: { type: "filesystem" }` 开启持久化缓存。
- `experiments.lazyCompilation.entries: true`（可按需编译，减少冷启动）。
- `output` 使用 `[name].[contenthash].js`，`clean: true`。

2) 依赖
- 安装：`pnpm add -D @rspack/cli @rspack/core`（或 rspack 发行包）。
- 保留 React 相关依赖不变。

3) 验证
- 记录迁移前后 `pnpm bench` 的时间差；修改单文件观察 HMR 耗时。

## 为什么这样改
- Rspack 基于 Rust + SWC，编译链更短，显著加速冷/热启动。
- filesystem cache 避免重复编译，lazyCompilation 减少初始工作量。
- devtool 从 full source-map 切到 cheap 方案，折中调试与速度。
