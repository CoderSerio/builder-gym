# Solution - 07 SWC/OXC（具体改法与原因）

## 需要改什么
1) SWC 路线
- 配置 `swc.config.json`: parser typescript+tsx, target es2019, react automatic, sourceMaps。
- 添加脚本：`"build:swc": "swc src -d dist --config-file swc.config.json"`。
- 如需 polyfill，结合 `@swc/helpers` 或外部 polyfill 注入。

2) OXC 路线（若可用）
- 使用 `oxc.config.json`，指定 target、jsx=automatic、modules=esnext。
- 脚本：`"build:oxc": "oxc build src --out-dir dist --config oxc.config.json"`（示例，视 oxc CLI 实际参数调整）。

3) Rspack 路线
- 基于 `rspack.config.template.js`：`builtin:swc-loader`，devtool 选 `eval-cheap-module-source-map`，开启 `cache: filesystem`，`experiments.lazyCompilation.entries: true`。

4) 验证
- 比较 Babel 构建 vs SWC/OXC 构建的 `pnpm bench` 时间。
- 检查产物是否满足目标浏览器/Node 版本；若缺 polyfill，补充。
- 观察 HMR/增量速度是否提升。

## 为什么这样改
- SWC/OXC 均以 Rust/高性能实现，减少 JS 端编译开销，显著提升冷启动与增量。
- 正确 parser/transform 配置保证 JSX/TS 能编译且行为一致。
- cache + lazyCompilation 进一步降低迭代成本。
