## 11 自定义 Loader/Plugin + Rspack Rust 插件

本关聚焦两件事：
- 写一个 JS Loader（编译期剔除调试代码块）+ JS Plugin（收集 i18n key）。
- 在 Rspack 下提供 Rust 加速版本的 i18n 收集（通过原生扩展加速字符串扫描）。

你将获得：
- Webpack 与 Rspack 的等价配置（Loader/Plugin 接入点对照）。
- 观察 JS 插件 vs Rust 插件的耗时差异（批量文件场景）。
- 了解 Rspack 内置 `DefinePlugin` 作为“调试代码移除”的等价思路（对照组）。

运行方式见 `docs/learning.md` 与 `scripts/bench.js`。

目录结构（关键部分）
- `plugins/`
  - `js/`：通用 JS 插件（i18n 收集）
  - `js-native-bridge/`：Rspack 原生桥接插件（JS 外壳，强制调用 N-API）
  - `rust-napi/`：Rust N-API 扩展源码（字符串扫描加速）
- `loaders/`
  - `js/`：JS Loader（调试注释块剔除）
