# 09 任务：模块联邦（Module Federation）实验

## 背景
我们需要把一个"远程模块"（Remote）按独立应用发布，而 Host 应用在运行时加载它。我们还需要处理 shared 依赖、版本治理、远程不可用的降级策略。

## 现象
- 传统方式需要把公共组件打成 npm 包，每次更新都要重新构建 Host
- 模块联邦允许 Remote 独立发布，Host 在运行时动态加载
- 如果配置不当，可能出现依赖重复加载、版本冲突等问题

## 任务清单

### 1. 安装依赖
依赖安装命令请看 `learning.md`（本文件不提供答案命令）。

### 2. 用 webpack 跑通 Host + Remote（生产模式）

1. 先构建 Remote：`pnpm run build:remote`
2. 再构建 Host：`pnpm run build:host`
3. 启动 Remote 静态服务器（终端 1）：`pnpm run serve:remote`（端口 3001）
4. 启动 Host 静态服务器（终端 2）：`pnpm run serve:host`（端口 3000）
5. 访问 `http://localhost:3000`，验证 Host 能加载 Remote 的组件

> **延伸探索**：Rspack 也支持模块联邦（API 与 Webpack 基本一致）。感兴趣的读者可以参考 `src/remote/rspack.config.js` 和 `src/host/rspack.config.js` 自行探索。

### 4. shared 依赖治理（核心）
确保 shared 依赖只加载一份（以 `react`/`react-dom` 为例）。

**验收**：
- 不出现"重复 React"导致的运行异常（真实项目常见报错：`Invalid hook call`）
- 检查网络请求，确认 React 只加载一次

### 5. 远程不可用时的降级
当 Remote 服务关闭或 `remoteEntry.js` 拉取失败时，Host 应显示降级 UI，而不是白屏。

**验收步骤**：
1. 正常启动 Remote 和 Host，验证功能正常
2. 关闭 Remote 服务（停止 `serve:remote` 进程）
3. 刷新 Host 页面
4. 应该看到降级提示（如"Remote 服务不可用"），而不是白屏或报错

---

## 验证（建议验收步骤）

1. **先启动 Remote，再启动 Host**
   - 确保 Remote 的 `remoteEntry.js` 可以访问

2. **打开 Host 页面，能看到来自 Remote 的组件/字符串**
   - 访问 `http://localhost:3000`
   - 应该能看到 Remote 暴露的组件（如 `RemoteButton`）

3. **关闭 Remote，再刷新 Host，能看到降级提示（而不是报错中断）**
   - 停止 Remote 服务
   - 刷新 Host 页面
   - 应该显示降级 UI，而不是白屏

4. **（可选）探索 Rspack 版本**
   - 参考 `src/remote/rspack.config.js` 和 `src/host/rspack.config.js`
   - Rspack 的 Module Federation API 与 Webpack 基本一致
