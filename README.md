<div align="center">

# Bundler-Gym

</div>

面向架构新人到进阶的构建教学项目，覆盖 webpack/rollup 与 Rspack/SWC/OXC 等新兴工具。
每章节提供反例、待填模板与参考解法，用于练习诊断配置与优化能力。

## 目录结构
- `cases/01-basic` … `08-ssr-bundle(optional)`: 练习场景
- `cases/*/docs/`: 知识点说明、任务练习、参考答案

## 快速开始

```bash
pnpm install   # 如需实际运行各关卡，请安装所需依赖
pnpm bench     # 在根目录运行基准（默认对当前目录或 --cwd 指定目录）
# 或进入某关运行
cd cases/01-basic && pnpm bench
```

> 本仓库初始为教学模板，build 命令多为占位。请按各关 README 的任务完成配置后再运行 benchmark。

## 学习路线（对应关卡）
0. 基础入门：认识 webpack 核心字段（mode/entry/output/module）
1. 缓存优化：contenthash 与 devtool 策略
2. Tree Shaking & sideEffects：webpack / rollup
3. Vendor 拆分与缓存稳定
4. Runtime Chunk 稳定性
5. 旧项目迁移：webpack → Rspack
6. 库构建现代化：rollup/tsup/swc
7. 新兴链路探索：SWC/OXC/Rspack
8. 多入口/SSR-friendly 打包
9. 微前端架构-模块联邦
10. 循环引用 + 幽灵依赖（依赖治理入门）

## 使用方式

- 拉取项目代码
- 进入 `cases`，阅读 `README.md` 开始学习 