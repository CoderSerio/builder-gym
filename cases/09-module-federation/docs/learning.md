# 09 学习：什么是模块联邦？为什么它是架构能力？

## 本章节需要安装哪些依赖（以及为什么）

```bash
pnpm add -D webpack webpack-cli html-webpack-plugin
pnpm add -D swc-loader @swc/core css-loader style-loader
pnpm add react react-dom
```

> **注意**：本章节主要使用 Webpack 来学习模块联邦。Rspack 也支持模块联邦（API 与 Webpack 基本一致），感兴趣的的话可以自行探索。本章节已提供 `src/remote/rspack.config.js` 和 `src/host/rspack.config.js` 作为参考。

---

## 什么是模块联邦（Module Federation）？

**模块联邦**（Module Federation）是 Webpack 5 引入的一种**运行时模块共享机制**，允许**独立的应用程序在运行时共享代码**。

### 传统拆分方式 vs 模块联邦

**传统拆分方式**：
- 把公共组件打成 npm 包
- 需要发版、安装、重新构建 Host 才能生效
- 每次更新都要走完整的发布流程

**模块联邦的方式**：
- Remote 单独发布（一个 `remoteEntry.js` 文件）
- Host 在运行时从 URL 加载 Remote 的模块
- Remote 更新后，Host 无需重新构建即可使用新版本（取决于治理策略）

### 模块联邦的价值（架构视角）

1. **独立发布**：Remote 发版不必强制 Host 重构建（取决于治理策略）
2. **团队解耦**：不同团队可以维护不同的 Remote，互不干扰
3. **运行时组合**：按路由/场景动态加载不同的 Remote
4. **版本治理**：可以控制 Remote 的版本，支持灰度发布、回滚等策略

---

## 三个核心配置概念

### 1. exposes（Remote 暴露什么）

Remote 把内部模块暴露给外部消费。

**示例**：
```js
// remote/webpack.config.js
module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: "remoteApp",
      filename: "remoteEntry.js",
      exposes: {
        "./Button": "./src/RemoteButton.jsx",  // 暴露 Button 组件
        "./utils": "./src/utils.js"            // 暴露工具函数
      }
    })
  ]
};
```

**含义**：Host 可以通过 `remoteApp/Button` 和 `remoteApp/utils` 来使用 Remote 暴露的模块。

### 2. remotes（Host 去哪里加载 Remote）

Host 声明 remote 名字与 remoteEntry 地址。

**示例**：
```js
// host/webpack.config.js
module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: "hostApp",
      remotes: {
        remoteApp: "remoteApp@http://localhost:3001/remoteEntry.js"
        // 格式：name@url
      }
    })
  ]
};
```

**含义**：Host 可以从 `http://localhost:3001/remoteEntry.js` 加载名为 `remoteApp` 的 Remote。

### 3. shared（共享依赖）

**最容易踩坑的地方**：依赖如果重复加载，可能产生严重问题。

**经典案例**：
- React 被加载两份 → 可能出现 `Invalid hook call` 错误
- 原因：React 的 hooks 依赖于单例的 React 实例，如果加载两份，会导致状态管理混乱

**因此 shared 通常要配置**：
```js
shared: {
  react: {
    singleton: true,        // 只允许一份实例
    requiredVersion: "^18.0.0",  // 版本约束
    eager: false            // 不立即加载，按需加载
  },
  "react-dom": {
    singleton: true,
    requiredVersion: "^18.0.0"
  }
}
```

**关键配置说明**：
- `singleton: true`：确保整个应用只有一份该依赖的实例
- `requiredVersion`：版本约束，如果版本不匹配会警告或报错
- `eager: false`：按需加载，而不是立即加载所有 shared 依赖

---

## 常见问题：Eager Consumption（急切消费）

### 什么是 Eager Consumption？

**Eager Consumption**（急切消费）是指**在入口文件中同步导入 shared 模块**，导致 webpack 报错：

```
Uncaught Error: Shared module is not available for eager consumption: webpack/sharing/consume/default/react/react
```

### 为什么会报错？

当我们在入口文件中这样写时：

```js
// ❌ 错误示例：入口文件 index.jsx
import React from "react";  // 同步导入 shared 模块
import { createRoot } from "react-dom/client";

const root = createRoot(document.getElementById("app"));
root.render(<App />);
```

问题在于：
1. **Shared 模块需要异步初始化**：模块联邦的 shared 模块（如 `react`）需要在运行时异步初始化
2. **入口文件是同步执行的**：入口文件在模块加载时立即执行，此时 shared 模块可能还没准备好
3. **时机不匹配**：同步导入会在 shared 模块初始化之前就尝试使用它

### 解决方案：Bootstrap 模式

**Bootstrap 模式**是模块联邦的标准做法：将入口文件改为异步加载，实际的业务代码放在 `bootstrap` 文件中。

#### 正确的做法

**1. 入口文件（`index.jsx`）**：只做异步导入
```js
// ✅ 正确：入口文件只做异步导入
import("./bootstrap");
```

**2. Bootstrap 文件（`bootstrap.jsx`）**：包含实际的业务代码
```js
// ✅ 正确：bootstrap.jsx 包含业务代码
import React, { Suspense } from "react";
import { createRoot } from "react-dom/client";

// 这里可以安全地使用 React，因为是在异步加载后执行的
const RemoteButton = React.lazy(() => import("remoteApp/RemoteButton"));

function App() {
  return (
    <div>
      <h1>Host App</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <RemoteButton />
      </Suspense>
    </div>
  );
}

const root = createRoot(document.getElementById("app"));
root.render(<App />);
```

#### 为什么这样能解决问题？

1. **异步加载时机正确**：`import("./bootstrap")` 是异步的，会在 shared 模块初始化完成后才执行
2. **执行顺序正确**：先初始化 shared 模块，再执行 bootstrap 代码
3. **符合模块联邦的设计**：模块联邦本身就是基于异步加载的，bootstrap 模式与之完美契合

### 其他解决方案（不推荐）

虽然可以通过设置 `eager: true` 来避免这个错误，但**不推荐**：

```js
// ⚠️ 不推荐：设置 eager: true
shared: {
  react: { 
    singleton: true,
    eager: true  // 立即加载，但会失去按需加载的优势
  }
}
```

**为什么不推荐**：
- 失去了按需加载的优势（所有 shared 模块都会立即加载）
- 增加了初始 bundle 大小
- 不符合模块联邦的最佳实践

### 总结

- **问题**：在入口文件中同步导入 shared 模块会报 "eager consumption" 错误
- **原因**：Shared 模块需要异步初始化，但入口文件是同步执行的
- **解决**：使用 Bootstrap 模式，入口文件只做异步导入，业务代码放在 bootstrap 文件中
- **最佳实践**：这是模块联邦的标准做法，所有使用模块联邦的项目都应该采用这种方式

---

## dev vs prod 两种运行方式

### 开发（dev）

**目标**：改 Remote/Host 都能快速看到变化

**常见做法**：
- Host 和 Remote 各自起 dev server（更贴近真实场景）
- Remote 运行在 `http://localhost:3001`
- Host 运行在 `http://localhost:3000`
- Host 通过 `remotes` 配置指向 Remote 的 dev server

**启动步骤**（手动启动两个终端）：
```bash
# 终端 1：启动 Remote
cd remote
pnpm run dev  # 或 webpack serve --config webpack.config.js

# 终端 2：启动 Host
cd host
pnpm run dev  # 或 webpack serve --config webpack.config.js
```

### 生产（prod）

**目标**：稳定、可回滚、可治理

**常见做法**：
1. Remote build 后静态部署到 CDN 或静态服务器
2. Host 固定加载某个版本 URL（或通过配置中心/灰度策略切换）
3. 支持版本回滚：如果新版本有问题，可以快速切回旧版本

**启动步骤**（手动启动两个终端）：
```bash
# 终端 1：构建并启动 Remote
pnpm run build:remote:webpack
pnpm run serve:remote:webpack  # 静态服务器，端口 3001

# 终端 2：构建并启动 Host
pnpm run build:host:webpack
pnpm run serve:host:webpack    # 静态服务器，端口 3000
```

---

## 本章节我们需要完成什么（直觉）

1. **让 Remote 产出 `remoteEntry.js`**
   - 配置 `ModuleFederationPlugin` 的 `exposes`
   - 构建后应该能看到 `remoteEntry.js` 文件

2. **让 Host 能加载并渲染 Remote 暴露的模块**
   - 配置 `ModuleFederationPlugin` 的 `remotes`
   - 使用 Bootstrap 模式（入口文件异步加载 bootstrap，避免 eager consumption 错误）
   - 在 Host 代码中动态导入 Remote 的模块
   - 验证 Host 页面能正常显示 Remote 的组件

3. **处理 shared（避免重复依赖）**
   - 配置 `shared` 字段，确保 React 等依赖只加载一份
   - 验证不会出现 `Invalid hook call` 等错误

4. **Remote 挂了 Host 也不白屏（降级）**
   - 当 Remote 服务关闭或 `remoteEntry.js` 拉取失败时，Host 应显示降级 UI
   - 而不是白屏或报错中断

---

## 本章节验收关注点

1. **Remote 能独立运行**：访问 Remote 的 URL 能看到 Remote 的页面
2. **Host 能加载 Remote**：访问 Host 的 URL 能看到来自 Remote 的组件
3. **Shared 依赖只加载一份**：不会出现 `Invalid hook call` 等错误
4. **降级策略生效**：关闭 Remote 后，Host 显示降级提示而不是白屏
5. **Webpack 和 Rspack 两条路线都能完成以上流程**

---

## 延伸阅读

- [Webpack Module Federation 官方文档](https://webpack.js.org/concepts/module-federation/)
- [Rspack Module Federation 文档](https://rspack.dev/guide/module-federation)
- [微前端架构实践](https://micro-frontends.org/)
