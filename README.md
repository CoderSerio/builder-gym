# Build-Gym 构建靶场

面向架构新人到进阶的构建教学项目，覆盖 webpack/rollup 与 Rspack/SWC/OXC 等新兴工具。每关提供反例、待填模板与参考解法，重点培养诊断、配置与优化能力。

## 目录结构
- `cases/01-basic` … `08-ssr-bundle(optional)`: 关卡代码与 README。
- `cases/*/solution/`: 参考答案与讲解。
- `scripts/benchmark.js`: 通用裁判脚本，支持多工具、按关卡基线。
- `scripts/baseline.json`: 各关卡基线占位。

## 快速开始

```bash
pnpm install   # 如需实际运行各关卡，请安装所需依赖
pnpm bench     # 在根目录运行基准（默认对当前目录或 --cwd 指定目录）
# 或进入某关运行
cd cases/01-basic && pnpm bench
```

> 本仓库初始为教学模板，build 命令多为占位。请按各关 README 的任务完成配置后再运行 benchmark。

## 学习路线（对应关卡）
1. 基础打包入门：webpack + swc-loader
2. Tree Shaking & sideEffects：webpack / rollup
3. Vendor 拆分与缓存稳定
4. Runtime Chunk 稳定性
5. 旧项目迁移：webpack → Rspack
6. 库构建现代化：rollup/tsup/swc
7. 新兴链路探索：SWC/OXC/Rspack
8. 多入口/SSR-friendly 打包

## Benchmark 说明
- 默认读取 `scripts/baseline.json` 的 per-case 基线；关卡可定义局部配置（待填）。
- 流程：clean dist → 执行 build → 统计体积/压缩体积/耗时 → 表格输出。
- 如未配置真实构建，benchmark 会提示缺失产物，不会报错中断。

## 贡献指南
1. 先阅读对应关卡 README，理解反例与目标。
2. 按任务修改配置或代码，复跑 `pnpm bench` 验证。
3. 对照 `solution/` 参考答案，理解差异与原因（每关 solution 现已列出“改什么/为什么改”具体指引）。



