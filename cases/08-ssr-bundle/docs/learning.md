# 08 学习（可选）：Turbopack 与 SSR 构建

## 本关需要安装哪些依赖（以及为什么）

```bash
pnpm add -D turbo
pnpm add react@19 react-dom@19
```

> **注意**：截至本章节编写时，Turbopack 主要作为 Next.js 的构建工具使用。本关将介绍 Turbopack 的核心概念，并通过 Next.js 的 Turbopack 模式来体验 SSR 构建。如果你需要完全独立的 SSR 构建（不依赖 Next.js），可以参考 Rspack 或 Webpack 方案（见其他章节）。

---

## 什么是 Turbopack？

**Turbopack** 是 **Next.js 团队**（Vercel）开发的**基于 Rust 的构建工具**，目标是替代 Webpack，提供**极致的构建速度**。

### Turbopack 的核心特点

1. **Rust 实现**：和 SWC、Rspack 一样，用 Rust 重写了编译链路，性能比 JS 实现的工具快 10-700 倍
2. **增量编译**：只重新编译变更的模块，冷启动和热更新都极快
3. **原生支持 SSR**：Next.js 团队开发，天然理解 SSR 的 client/server 分离需求
4. **零配置**：开箱即用 TypeScript、JSX、CSS、CSS Modules、Sass 等

### Turbopack vs Webpack vs Rspack

| 工具 | 语言 | 主要场景 | SSR 支持 | 生态成熟度 |
|------|------|----------|----------|------------|
| **Webpack** | JavaScript | 通用构建工具 | 需要手动配置 client/server | ⭐⭐⭐⭐⭐ 最成熟 |
| **Rspack** | Rust | Webpack 的 Rust 替代 | 需要手动配置 client/server | ⭐⭐⭐⭐ 快速成长 |
| **Turbopack** | Rust | Next.js 项目（未来可能独立） | **原生支持**（通过 Next.js） | ⭐⭐⭐ 主要绑定 Next.js |

---

## 为什么 SSR 场景适合用 Turbopack？

### 1. 原生理解 SSR 架构

Turbopack 是 Next.js 团队开发的，**天然理解 SSR 的双端需求**：
- **Client Bundle**：浏览器端代码，需要代码分割、缓存优化
- **Server Bundle**：Node 端代码，需要 externalize node_modules、保持精简

### 2. 零配置的 SSR 构建

在 Next.js 项目中，启用 Turbopack 后：
- 自动识别 `app/` 目录下的 Server Components 和 Client Components
- 自动分离 client/server 代码
- 自动 externalize server 端的 node_modules（如 `react`、`react-dom/server`）
- 自动优化 client 端的代码分割和缓存策略

### 3. 极快的开发体验

- **冷启动**：大型项目从几十秒降到几秒
- **热更新**：改一行代码，几乎瞬间看到效果
- **增量编译**：只编译变更的模块，不重新编译整个项目

---

## SSR/同构的直觉

SSR（Server-Side Rendering）至少有两端：

- **Server**：Node 环境，把 React 组件渲染成 HTML 字符串
- **Client**：浏览器环境，把 HTML "hydrate" 成可交互的应用

因此通常需要两份产物：
- **Server Bundle**：运行在 Node，调用 `renderToString()` 生成 HTML
- **Client Bundle**：运行在浏览器，调用 `hydrateRoot()` 让页面可交互

### 示例代码结构

```
src/
  ├── client/
  │   └── index.tsx          # Client 入口：hydrateRoot()
  ├── server/
  │   └── index.ts           # Server 入口：renderToString()
  └── shared/
      └── App.tsx            # 共享组件（两端都用）
```

---

## 为什么要 externalize server 的 node_modules？

Server 端的依赖（`react`、`react-dom/server`、各类 Node 包）在部署环境通常已经存在：

1. **体积膨胀**：如果把 `react` 打进 server bundle，会导致 server 产物从几 KB 膨胀到几百 KB
2. **重复依赖**：部署环境已经有 `node_modules`，再打包进去就是重复
3. **版本冲突**：打包的版本和运行环境的版本可能不一致

**Externalize 的目标**：Server bundle 只打包你的业务代码，依赖由运行环境的 `node_modules` 提供。

### 示例对比

**❌ 不 externalize（错误）**：
```js
// dist/server/server.js 包含整个 react + react-dom（~200KB）
import React from "react";  // 被打包进去了
```

**✅ Externalize（正确）**：
```js
// dist/server/server.js 只有业务代码（~5KB）
// react 和 react-dom 从运行环境的 node_modules 加载
import React from "react";  // 运行时从 node_modules 加载
```

---

## Client 侧为什么还要做缓存策略？

Client 面向用户网络与加载速度：

1. **Contenthash**：文件内容不变，hash 不变，浏览器缓存命中率高
2. **Runtime Chunk 拆分**：Webpack runtime 独立成 chunk，业务代码更新不影响 runtime
3. **Vendor 拆分**：框架/三方库独立成 chunk，业务更新不影响框架 chunk

**目标**：业务更新只影响业务 chunk，不影响框架/三方库 chunk，用户只需重新下载变更的部分。

---

## Turbopack 在 Next.js 中的使用

### 启用 Turbopack（Next.js 13.5+）

```bash
# 创建 Next.js 项目
pnpm create next-app@latest my-ssr-app

# 启用 Turbopack（开发模式）
pnpm dev --turbo

# 或设置环境变量
TURBOPACK=1 pnpm dev
```

### Next.js 自动处理的 SSR 构建

Next.js + Turbopack 会自动：
- 识别 `app/` 目录下的 Server Components（默认是 server）
- 识别 `"use client"` 标记的 Client Components
- 自动分离 client/server 代码
- 自动 externalize server 端的依赖
- 自动优化 client 端的代码分割

---

## 如何验证是否为 SSR？

验证 SSR 的核心思路：**检查初始 HTML 响应是否包含完整的页面内容**。如果是 SSR，服务端会预先渲染好 HTML；如果是 CSR（Client-Side Rendering），初始 HTML 通常是空的 `<div id="app"></div>`。

### 方法 1：查看页面源代码（最简单）

1. 在浏览器中访问页面（如 `http://localhost:3000`）
2. **右键点击页面** → **查看页面源代码**（或按 `Ctrl+U` / `Cmd+Option+U`）
3. **检查 HTML 内容**：
   - ✅ **SSR**：能看到完整的 HTML 内容，包括 `<h1>SSR Friendly Bundle</h1>` 等
   - ❌ **CSR**：只能看到空的 `<div id="app"></div>` 或 `<div id="__next"></div>`

**示例（SSR 正确）**：
```html
<!DOCTYPE html>
<html>
  <head><title>SSR Demo</title></head>
  <body>
    <div id="app">
      <h1>SSR Friendly Bundle</h1>  <!-- 这是服务端渲染的内容 -->
    </div>
    <script src="/_next/static/.../main.js"></script>
  </body>
</html>
```

### 方法 2：禁用 JavaScript 后刷新

1. 在浏览器中打开 **开发者工具**（F12）
2. 进入 **设置** → **调试器** → 勾选 **"禁用 JavaScript"**
3. 刷新页面
4. **检查结果**：
   - ✅ **SSR**：页面内容仍然可见（因为 HTML 是服务端渲染的）
   - ❌ **CSR**：页面空白（因为需要 JavaScript 才能渲染内容）

### 方法 3：使用 curl 直接请求（最可靠）

```bash
# 请求页面，查看原始 HTML 响应
curl http://localhost:3000

# 或使用 wget
wget -O - http://localhost:3000
```

**检查输出**：
- ✅ **SSR**：输出包含完整的 HTML 内容（`<h1>SSR Friendly Bundle</h1>` 等）
- ❌ **CSR**：输出只有空的 `<div id="app"></div>`

**示例（SSR 正确）**：
```bash
$ curl http://localhost:3000
<!DOCTYPE html>
<html>
  <head><title>SSR Demo</title></head>
  <body>
    <div id="app">
      <h1>SSR Friendly Bundle</h1>  <!-- 服务端渲染的内容 -->
    </div>
    <script src="/_next/static/.../main.js"></script>
  </body>
</html>
```

### 方法 4：查看网络请求（DevTools）

1. 打开浏览器 **开发者工具**（F12）
2. 进入 **Network** 标签
3. 刷新页面
4. 找到第一个请求（通常是文档请求，`localhost:3000`）
5. 点击查看 **Response** 标签
6. **检查 HTML 内容**：
   - ✅ **SSR**：Response 包含完整的 HTML 内容
   - ❌ **CSR**：Response 只有空的容器元素

### 方法 5：检查构建产物

```bash
# 构建生产版本
pnpm run build

# 查看 server 端代码
ls -la .next/server/

# 查看 server 端渲染的 HTML 模板
cat .next/server/app/page.html  # 如果有的话
```

**预期**：
- `.next/server/` 目录存在，包含服务端渲染相关的代码
- Server 产物不包含 `react`、`react-dom`（因为它们被 externalize）

### 方法 6：添加时间戳验证（最直观）

在 Server Component 中添加一个时间戳，每次请求都会变化：

```tsx
// app/page.tsx
export default function Page() {
  const serverTime = new Date().toISOString();
  return (
    <div>
      <h1>SSR Friendly Bundle</h1>
      <p>Server rendered at: {serverTime}</p>
    </div>
  );
}
```

**验证**：
- 刷新页面多次，如果时间戳每次都变化，说明是 SSR（每次请求都在服务端重新渲染）
- 如果时间戳不变，可能是静态生成（SSG）或缓存

---

## 本关验收关注点

1. **Server 产物不应包含整个 node_modules**（至少 `react` 不应被重复打进）
2. **Client 产物能正常 hydrate**（浏览器端能正常渲染和交互）
3. **Client 产物具备较好的缓存稳定性**（hash 变化范围可控，业务更新不影响框架 chunk）
4. **能通过上述方法验证 SSR 是否生效**（初始 HTML 包含完整内容）

---

## 延伸阅读

- [Turbopack 官方文档](https://turbo.build/pack)
- [Next.js Turbopack 文档](https://nextjs.org/docs/app/api-reference/next-config-js/turbopack)
- [Rspack SSR 配置](https://rspack.dev/guide/ssr)（如果你需要完全独立的 SSR 构建）
