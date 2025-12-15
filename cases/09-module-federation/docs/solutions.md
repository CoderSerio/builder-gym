# Solution - 09 模块联邦（Module Federation）（逐步对齐 tasks）

> 本答案的结构严格对齐 `docs/tasks.md` 的 1-5 步；每一步都包含：**操作** / **我们需要做什么** / **为什么** / **如何验收**。

---

## 1. 安装依赖

**操作**：按 `docs/learning.md` 的依赖清单安装即可。

**解释**：
- 需要 `webpack`、`webpack-cli`、`html-webpack-plugin`、`swc-loader`、`@swc/core`
- 运行时依赖需要 `react` + `react-dom`

**验收**：
```bash
pnpm -C cases/09-module-federation add -D webpack webpack-cli html-webpack-plugin swc-loader @swc/core
pnpm -C cases/09-module-federation add react react-dom
```

---

## 2. 用 webpack 跑通 Host + Remote（生产模式）

**我们需要做什么**：
1. 配置 Remote 的 `webpack.config.js`：设置 `ModuleFederationPlugin` 的 `exposes` 和 `shared`
2. 配置 Host 的 `webpack.config.js`：设置 `ModuleFederationPlugin` 的 `remotes` 和 `shared`
3. 在 Host 代码中动态导入 Remote 的模块
4. 构建并启动两个静态服务器

**关键配置点**：

### Remote 配置（`src/remote/webpack.config.js`）

```js
const { ModuleFederationPlugin } = require("webpack").container;

module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: "remoteApp",  // Remote 的名称，Host 会用到
      filename: "remoteEntry.js",  // 产出的入口文件
      exposes: {
        "./RemoteButton": "./src/RemoteButton.jsx"  // 暴露的模块路径
      },
      shared: {
        react: { singleton: true, requiredVersion: false },
        "react-dom": { singleton: true, requiredVersion: false }
      }
    })
  ]
};
```

### Host 配置（`src/host/webpack.config.js`）

```js
const { ModuleFederationPlugin } = require("webpack").container;

module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: "hostApp",
      remotes: {
        remoteApp: "remoteApp@http://localhost:3001/remoteEntry.js"
        // 格式：name@url
      },
      shared: {
        react: { singleton: true, requiredVersion: false },
        "react-dom": { singleton: true, requiredVersion: false }
      }
    })
  ]
};
```

### Host 代码中使用 Remote 模块

```jsx
// host/src/index.jsx
import React, { Suspense } from "react";
import { createRoot } from "react-dom/client";

// 动态导入 Remote 的模块
const RemoteButton = React.lazy(() => import("remoteApp/RemoteButton"));

function App() {
  return (
    <div>
      <h1>Host App</h1>
      <Suspense fallback={<div>Loading Remote Button...</div>}>
        <RemoteButton label="Loaded from Remote!" />
      </Suspense>
    </div>
  );
}

const root = createRoot(document.getElementById("app"));
root.render(<App />);
```

**为什么这样配置**：
- Remote 的 `exposes` 定义了哪些模块可以被外部使用
- Host 的 `remotes` 定义了从哪里加载 Remote 的模块
- `shared` 确保 React 等依赖只加载一份，避免版本冲突
- 使用 `React.lazy` 和 `Suspense` 实现按需加载和降级处理

**验收**：

```bash
# 终端 1：构建 Remote
pnpm run build:remote

# 终端 2：构建 Host
pnpm run build:host

# 终端 1：启动 Remote 静态服务器（端口 3001）
pnpm run serve:remote

# 终端 2：启动 Host 静态服务器（端口 3000）
pnpm run serve:host
```

**预期**：
- 访问 `http://localhost:3001` 能看到 Remote 的独立页面
- 访问 `http://localhost:3000` 能看到 Host 页面，并且能加载 Remote 的 `RemoteButton` 组件
- 浏览器 Network 标签能看到 `remoteEntry.js` 的请求

---

## 3. shared 依赖治理（核心）

**我们需要做什么**：
1. 确保 Remote 和 Host 都配置了 `shared` 字段
2. 设置 `singleton: true` 确保依赖只加载一份
3. 验证不会出现 `Invalid hook call` 等错误

**关键配置**：

```js
shared: {
  react: {
    singleton: true,        // 只允许一份实例
    requiredVersion: false  // 不强制版本检查（开发阶段可以放宽）
  },
  "react-dom": {
    singleton: true,
    requiredVersion: false
  }
}
```

**为什么需要 shared**：
- 如果不配置 `shared`，Remote 和 Host 可能各自加载一份 React
- 这会导致 React hooks 报错：`Invalid hook call. Hooks can only be called inside the body of a function component`
- `singleton: true` 确保整个应用只有一份 React 实例

**验收**：
1. 打开浏览器 DevTools → Network 标签
2. 刷新 Host 页面
3. 检查 React 相关的请求：
   - ✅ **正确**：React 只加载一次（通常由 Host 提供，Remote 使用 Host 的 React）
   - ❌ **错误**：React 加载了两次（说明 shared 配置有问题）

4. 检查浏览器 Console：
   - ✅ **正确**：无 `Invalid hook call` 错误
   - ❌ **错误**：出现 `Invalid hook call` 错误（说明 React 被加载了多份）

---

## 4. 远程不可用时的降级

**我们需要做什么**：
1. 在 Host 代码中添加错误处理
2. 当 Remote 加载失败时，显示降级 UI 而不是白屏

**关键代码**：

```jsx
// host/src/index.jsx
import React, { Suspense } from "react";
import { createRoot } from "react-dom/client";

const RemoteButton = React.lazy(() => 
  import("remoteApp/RemoteButton").catch(() => {
    // 如果加载失败，返回一个降级组件
    return {
      default: () => (
        <div style={{ padding: "8px 12px", border: "1px solid #ccc", borderRadius: 8 }}>
          Remote 服务不可用（降级 UI）
        </div>
      )
    };
  })
);

function App() {
  return (
    <div>
      <h1>Host App</h1>
      <Suspense fallback={<div>Loading Remote Button...</div>}>
        <RemoteButton label="Loaded from Remote!" />
      </Suspense>
    </div>
  );
}

const root = createRoot(document.getElementById("app"));
root.render(<App />);
```

**为什么需要降级**：
- 在生产环境中，Remote 服务可能因为各种原因不可用（网络问题、服务故障等）
- 如果没有降级处理，Host 会白屏或报错，用户体验很差
- 降级 UI 让用户知道 Remote 不可用，但 Host 的其他功能仍然可用

**验收**：
1. **正常情况**：
   - 启动 Remote 和 Host
   - 访问 Host 页面，应该能看到 Remote 的组件

2. **降级情况**：
   - 停止 Remote 服务（关闭 `serve:remote` 进程）
   - 刷新 Host 页面
   - **预期**：应该看到降级 UI（如"Remote 服务不可用"），而不是白屏或报错

3. **恢复情况**：
   - 重新启动 Remote 服务
   - 刷新 Host 页面
   - **预期**：应该能正常加载 Remote 的组件

---

## 完整配置参考（可直接复制）

### `src/remote/webpack.config.js`（Remote）
```js
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { ModuleFederationPlugin } = require("webpack").container;

module.exports = {
  mode: "production",
  entry: path.resolve(__dirname, "src/index.js"),
  output: {
    path: path.resolve(__dirname, "dist/webpack"),
    filename: "remote.[contenthash].js",
    publicPath: "auto",
    clean: true
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "swc-loader",
          options: {
            jsc: {
              parser: { syntax: "ecmascript", jsx: true },
              target: "es2019",
              transform: { react: { runtime: "automatic" } }
            }
          }
        }
      }
    ]
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "remoteApp",
      filename: "remoteEntry.js",
      exposes: {
        "./RemoteButton": path.resolve(__dirname, "src/RemoteButton.jsx")
      },
      shared: {
        react: { singleton: true, requiredVersion: false },
        "react-dom": { singleton: true, requiredVersion: false }
      }
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "src/index.html")
    })
  ],
  resolve: {
    extensions: [".js", ".jsx"]
  }
};
```

### `src/host/webpack.config.js`（Host）
```js
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { ModuleFederationPlugin } = require("webpack").container;

module.exports = {
  mode: "production",
  entry: path.resolve(__dirname, "src/index.jsx"),
  output: {
    path: path.resolve(__dirname, "dist/webpack"),
    filename: "host.[contenthash].js",
    publicPath: "auto",
    clean: true
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "swc-loader",
          options: {
            jsc: {
              parser: { syntax: "ecmascript", jsx: true },
              target: "es2019",
              transform: { react: { runtime: "automatic" } }
            }
          }
        }
      }
    ]
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "hostApp",
      remotes: {
        remoteApp: "remoteApp@http://localhost:3001/remoteEntry.js"
      },
      shared: {
        react: { singleton: true, requiredVersion: false },
        "react-dom": { singleton: true, requiredVersion: false }
      }
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "src/index.html")
    })
  ],
  resolve: {
    extensions: [".js", ".jsx"]
  }
};
```

### `src/host/src/index.jsx`（Host 代码示例）
```jsx
import React, { Suspense } from "react";
import { createRoot } from "react-dom/client";

const RemoteButton = React.lazy(() => 
  import("remoteApp/RemoteButton").catch(() => {
    return {
      default: () => (
        <div style={{ padding: "8px 12px", border: "1px solid #ccc", borderRadius: 8 }}>
          Remote 服务不可用（降级 UI）
        </div>
      )
    };
  })
);

function App() {
  return (
    <div style={{ fontFamily: "sans-serif", padding: 24 }}>
      <h1>Host App</h1>
      <Suspense fallback={<div>Loading Remote Button...</div>}>
        <RemoteButton label="Loaded from Remote!" />
      </Suspense>
    </div>
  );
}

const root = createRoot(document.getElementById("app"));
root.render(<App />);
```

---

## 延伸说明

### Module Federation 的适用场景

- **微前端架构**：多个独立团队维护不同的应用，通过 Module Federation 组合
- **组件库共享**：大型组织内部共享组件库，无需发 npm 包
- **渐进式迁移**：逐步将旧应用迁移到新架构，新旧应用共存

### 注意事项

1. **版本治理**：生产环境应该设置 `requiredVersion`，避免版本冲突
2. **网络依赖**：Remote 的可用性直接影响 Host，需要做好降级和监控
3. **性能考虑**：Remote 模块是运行时加载的，首次加载可能有延迟
4. **安全性**：确保 Remote 的来源可信，避免加载恶意代码

---

## 延伸探索：Rspack 版本

Rspack 也支持模块联邦，API 与 Webpack 基本一致。感兴趣的读者可以参考以下文件自行探索：

- `src/remote/rspack.config.js`：Remote 的 Rspack 配置
- `src/host/rspack.config.js`：Host 的 Rspack 配置

**主要差异**：
- 导入路径：`require("@rspack/core").container` 而不是 `require("webpack").container`
- 使用 `HtmlRspackPlugin` 而不是 `HtmlWebpackPlugin`
- 使用 `builtin:swc-loader` 而不是 `swc-loader`
- 其他配置基本一致

**构建命令**（需要自行添加到 `package.json`）：
```bash
# 构建
rspack build -c src/remote/rspack.config.js
rspack build -c src/host/rspack.config.js

# 启动静态服务器（使用相同的 serve-static.js）
node serve-static.js --dir src/remote/dist/rspack --port 3001 --cors
node serve-static.js --dir src/host/dist/rspack --port 3000 --cors
```
