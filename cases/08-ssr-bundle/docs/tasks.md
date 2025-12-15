# 08 任务（可选）：Turbopack 与 SSR 构建

## 背景
同构/SSR 项目需要前后端分别打包：前端 browser bundle，后端 node bundle。Turbopack 作为 Next.js 团队开发的构建工具，原生支持 SSR 的双端构建，无需手动配置 client/server 分离。

## 现象
- 传统构建工具（Webpack/Rspack）需要手动配置 client/server 分离、externals、代码分割
- Turbopack 通过 Next.js 可以零配置实现 SSR 构建，但需要理解其工作原理

## 任务清单

### 1. 安装依赖
依赖安装命令请看 `learning.md`（本文件不提供答案命令）。

### 2. 创建 Next.js 项目并启用 Turbopack
创建一个最小化的 Next.js 项目，启用 Turbopack 模式，理解其自动的 SSR 构建流程。

### 3. 理解 Server/Client 分离
观察 Next.js + Turbopack 如何自动分离 Server Components 和 Client Components，以及如何自动 externalize server 端的依赖。

### 4. 对比传统构建工具
（可选）对比 Turbopack 和 Webpack/Rspack 在 SSR 场景下的配置复杂度、构建速度差异。

### 5. 验证 SSR 渲染
验证 SSR 渲染示例能正常运行，server 产物不包含 node_modules，client 产物能正常 hydrate。

---

> **注意**：本关主要目的是**认识 Turbopack 这个新工具**，理解其在 SSR 场景下的优势。如果你需要完全独立的 SSR 构建（不依赖 Next.js），可以参考其他章节的 Webpack/Rspack 方案。
