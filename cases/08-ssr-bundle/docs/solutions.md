# Solution - 08 Turbopack 与 SSR 构建（逐步对齐 tasks）

> 本答案的结构严格对齐 `docs/tasks.md` 的 1-5 步；每一步都包含：**操作** / **你需要做什么** / **为什么** / **如何验收**。

---

## 1. 安装依赖

**操作**：按 `docs/learning.md` 的依赖清单安装即可。

**解释**：
- 本关通过 Next.js 来体验 Turbopack，所以需要 `next`（内置 Turbopack 支持）
- 运行时依赖需要 `react` + `react-dom`
- 如果要用 TypeScript，需要 `typescript` + `@types/react` + `@types/node`

**验收**：
```bash
pnpm -C cases/08-ssr-bundle add next react react-dom
pnpm -C cases/08-ssr-bundle add -D typescript @types/react @types/node
```

---

## 2. 创建 Next.js 项目并启用 Turbopack

**你需要做什么**：
1. 在 `cases/08-ssr-bundle/` 目录下创建 Next.js 项目结构
2. 创建 `next.config.js`，启用 Turbopack（或通过 CLI 参数）
3. 创建 `app/` 目录结构（Next.js 13+ App Router）

**关键配置点**：
- `next.config.js`：可以显式启用 Turbopack（虽然 Next.js 13.5+ 默认支持）
- `package.json` scripts：`"dev": "next dev --turbo"` 或 `"dev": "TURBOPACK=1 next dev"`

**为什么用 Next.js**：
- Turbopack 目前主要作为 Next.js 的构建工具使用
- Next.js 原生支持 SSR，自动处理 client/server 分离
- 通过 Next.js 可以最直观地体验 Turbopack 的 SSR 构建能力

**验收**：
```bash
pnpm -C cases/08-ssr-bundle run dev
```
**预期**：
- 开发服务器启动（通常 `http://localhost:3000`）
- 控制台显示 "Turbopack" 相关日志
- 页面能正常访问和渲染

---

## 3. 理解 Server/Client 分离

**你需要做什么**：
1. 在 `app/` 目录下创建 Server Component（默认，无需标记）
2. 创建 Client Component（需要 `"use client"` 标记）
3. 观察构建产物，理解 Turbopack 如何自动分离

**关键点**：
- **Server Component**（默认）：运行在 Node，可以直接访问数据库、文件系统等
  ```tsx
  // app/page.tsx（默认是 Server Component）
  export default function Page() {
    return <h1>SSR Friendly Bundle</h1>;
  }
  ```

- **Client Component**（需要标记）：运行在浏览器，可以处理交互、使用 hooks
  ```tsx
  // app/components/ClientButton.tsx
  "use client";
  import { useState } from "react";
  export function ClientButton() {
    const [count, setCount] = useState(0);
    return <button onClick={() => setCount(count + 1)}>{count}</button>;
  }
  ```

**为什么这样分离**：
- Server Component 不需要打包到 client bundle，减少 client 体积
- Client Component 需要打包到 client bundle，支持交互
- Turbopack 自动识别并分离，无需手动配置

**验收**：
```bash
pnpm -C cases/08-ssr-bundle run build
ls -la .next/server/
ls -la .next/static/
```
**预期**：
- `.next/server/` 包含 server 端代码（不包含 `react`、`react-dom`，因为它们被 externalize）
- `.next/static/` 包含 client 端代码（包含 `react`、`react-dom`，因为浏览器需要）

---

## 4. 对比传统构建工具（选做）

**你需要做什么**：
- 对比 Turbopack 和 Webpack/Rspack 在 SSR 场景下的配置复杂度
- 对比构建速度（冷启动、热更新）

**为什么做这个对比**：
- 理解 Turbopack 的优势（零配置、极快速度）
- 理解传统工具的优势（更灵活、生态更成熟）
- 为实际项目选型提供参考

**验收**：
- 能说出 Turbopack 在 SSR 场景下的优势（零配置、原生支持、极快速度）
- 能说出传统工具的优势（更灵活、生态更成熟、可以完全独立使用）

---

## 5. 验证 SSR 渲染

**你需要做什么**：
1. 运行 `pnpm run build` 构建生产版本
2. 运行 `pnpm run start` 启动生产服务器
3. 使用多种方法验证 SSR 是否生效（见下方详细步骤）

**关键验证点**：
- **Server 产物不包含 node_modules**：检查 `.next/server/` 下的文件大小，应该很小（只有业务代码）
- **Client 产物能正常 hydrate**：打开浏览器 DevTools，检查是否有 hydration 错误
- **页面能正常交互**：如果有 Client Component，验证交互功能正常
- **SSR 生效**：最简单的办法就是启动后查看页面

**为什么这样验证**：
- Server 产物不包含 node_modules 说明 externalize 成功
- Client 产物能正常 hydrate 说明 SSR 流程完整
- 页面能正常交互说明 Client Component 正常工作
- 验证 SSR 生效确保服务端确实在渲染 HTML，而不是纯客户端渲染

**验收步骤**：

### 步骤 1：构建并启动
```bash
pnpm -C cases/08-ssr-bundle run build
pnpm -C cases/08-ssr-bundle run start
```

### 步骤 2：验证 SSR（多种方法）

#### 方法 A：查看页面源代码（最简单）
1. 访问 `http://localhost:3000`
2. 右键 → **查看页面源代码**（或按 `Ctrl+U` / `Cmd+Option+U`）
3. **预期**：能看到完整的 HTML 内容，包括 `<h1>SSR Friendly Bundle</h1>` 等
   ```html
   <!DOCTYPE html>
   <html>
     <body>
       <div id="__next">
         <h1>SSR Friendly Bundle</h1>  <!-- 这是服务端渲染的内容 -->
       </div>
     </body>
   </html>
   ```

#### 方法 B：使用 curl 直接请求（最可靠）
```bash
curl http://localhost:3000
```
**预期**：输出包含完整的 HTML 内容，而不是空的 `<div id="__next"></div>`

#### 方法 C：禁用 JavaScript 后刷新
1. 打开浏览器 DevTools（F12）
2. 进入 **设置** → **调试器** → 勾选 **"禁用 JavaScript"**
3. 刷新页面
4. **预期**：页面内容仍然可见（因为 HTML 是服务端渲染的）

#### 方法 D：查看网络请求
1. 打开浏览器 DevTools（F12）→ **Network** 标签
2. 刷新页面
3. 找到第一个请求（`localhost:3000`）
4. 查看 **Response** 标签
5. **预期**：Response 包含完整的 HTML 内容

#### 方法 E：检查构建产物
```bash
# 查看 server 端代码
ls -la .next/server/

# 检查 server 产物大小（应该很小，不包含 react）
du -sh .next/server/
```
**预期**：
- `.next/server/` 目录存在
- Server 产物很小（只有业务代码，不包含 `react`、`react-dom`）

### 步骤 3：验证 Hydration
1. 打开浏览器 DevTools（F12）→ **Console** 标签
2. 刷新页面
3. **预期**：无 hydration 错误（如果有错误，会显示红色警告）

### 步骤 4：验证交互（如果有 Client Component）
1. 如果有交互功能（如按钮点击），验证交互是否正常
2. **预期**：交互功能正常工作

**完整验收清单**：
- ✅ 构建成功，无错误
- ✅ 页面能正常访问和渲染
- ✅ 通过查看页面源代码确认 SSR 生效（初始 HTML 包含完整内容）
- ✅ 通过 curl 确认 SSR 生效（响应包含完整 HTML）
- ✅ 浏览器控制台无 hydration 错误
- ✅ Server 产物不包含 node_modules（文件大小很小）
- ✅ 如果有交互功能，交互正常

---

## 完整配置参考（可直接复制）

### `next.config.js`（Next.js + Turbopack）
```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Turbopack 在 Next.js 13.5+ 默认启用（开发模式）
  // 生产构建使用 Turbopack 需要 Next.js 14+ 并设置 experimental.turbo
  experimental: {
    // 如果需要生产构建也用 Turbopack（Next.js 14+）
    // turbo: {}
  }
};

module.exports = nextConfig;
```

### `package.json`（scripts 配置）
```json
{
  "scripts": {
    "dev": "next dev --turbo",
    "build": "next build",
    "start": "next start",
    "bench": "node ../../scripts/benchmark.js"
  }
}
```

### `app/page.tsx`（Server Component 示例）
```tsx
// 默认是 Server Component，无需标记
export default function Page() {
  return (
    <div>
      <h1>SSR Friendly Bundle</h1>
      <p>This is rendered on the server.</p>
    </div>
  );
}
```

### `app/components/ClientButton.tsx`（Client Component 示例）
```tsx
"use client";  // 必须标记，否则无法使用 hooks

import { useState } from "react";

export function ClientButton() {
  const [count, setCount] = useState(0);
  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  );
}
```

---

## 延伸说明

### Turbopack 的当前状态

- **开发模式**：Next.js 13.5+ 已支持，通过 `--turbo` 启用
- **生产构建**：Next.js 14+ 开始支持，但仍处于实验阶段
- **独立使用**：目前 Turbopack 主要绑定 Next.js，未来可能提供独立 CLI

### 如果不需要 Next.js，如何做 SSR？

如果你需要完全独立的 SSR 构建（不依赖 Next.js），可以参考：
- **Rspack**：见其他章节，手动配置 client/server 分离
- **Webpack**：见其他章节，手动配置 client/server 分离

Turbopack 的优势在于**零配置的 SSR 构建**，但前提是使用 Next.js 框架。
