# 11 任务：自定义 Loader/Plugin + Rspack Rust 插件

目标：
- 实现 `strip-debug-block-loader`：移除 `/* @debug:start */ ... /* @debug:end */` 之间的代码。
- 实现 `i18n-collect-plugin`：收集 `t('key')` / `t("key")` 调用，输出 `i18n.keys.json`。
- 在 Rspack 下提供 Rust 加速版（同等功能），并对比耗时差异。
- 引入 Rspack `DefinePlugin` 作为“调试代码移除”的对照组（`__DEBUG__` 常量）。

验收：
- `pnpm bench` 能一次跑完四个变体并打印表格：`webpack+js`、`rspack+js`、`rspack+rust`、`rspack+define`。
- `dist/` 下产物正确，且生成 `i18n.keys.json`（包含 key/计数）。
- Rust 变体不可用时（未编译/无 rust 环境），自动降级为 JS 实现或跳过，并给出提示。
