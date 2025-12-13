# 09 学习：什么是模块联邦？为什么它是架构能力？

## 本关需要安装哪些依赖（以及为什么）
> 本关同时提供 webpack 与 Rspack 两条路线（对照学习）。你可以先把 webpack 跑通，再切到 Rspack。

### webpack 路线
```bash
pnpm add -D webpack webpack-cli html-webpack-plugin
pnpm add -D swc-loader @swc/core css-loader style-loader
pnpm add react react-dom
```

### Rspack 路线
```bash
pnpm add -D @rspack/cli @rspack/core @rspack/plugin-react-refresh
pnpm add react react-dom
```

## 模块联邦（Module Federation）在解决什么问题
传统拆分方式：
- 你把公共组件打成 npm 包 → 需要发版/安装/重新构建 Host 才能生效

模块联邦的方式：
- Remote 单独发布（一个 `remoteEntry.js`）
- Host 在运行时从 URL 加载 Remote 的模块

价值（架构视角）：
- **独立发布**：Remote 发版不必强制 Host 重构建（取决于治理策略）
- **团队解耦**：不同团队可以维护不同 Remote
- **运行时组合**：按路由/场景动态加载

## 三个核心配置概念
### exposes（Remote 暴露什么）
Remote 把内部模块暴露给外部消费，例如：
- `./Button` → `src/RemoteButton.tsx`

### remotes（Host 去哪里加载 Remote）
Host 声明 remote 名字与 remoteEntry 地址，例如：
- `remoteApp@http://localhost:3001/remoteEntry.js`

### shared（共享依赖）
最容易踩坑的地方：依赖如果重复加载，可能产生严重问题。
经典案例：
- React 被加载两份 → 可能出现 `Invalid hook call`

因此 shared 通常要配置：
- `singleton: true`（只允许一份实例）
- `requiredVersion`（版本约束）

## dev vs prod 两种运行方式
### 开发（dev）
目标：改 Remote/Host 都能快速看到变化
常见做法：host/remote 各自起 dev server（更贴近真实）

### 生产（prod）
目标：稳定、可回滚、可治理
常见做法：remote build 后静态部署，Host 固定加载某个版本 URL（或通过配置中心/灰度策略切换）

## 本关你需要完成什么（直觉）
1. 让 Remote 产出 `remoteEntry.js`
2. 让 Host 能加载并渲染 Remote 暴露的模块
3. 处理 shared（避免重复依赖）
4. Remote 挂了 Host 也不白屏（降级）


