## 09 模块联邦（Module Federation）实验

本章节聚焦"微前端运行时集成"：Host 在运行时加载 Remote 的模块，并正确处理 shared 依赖、版本治理、故障降级与发布回滚。

## 阅读顺序
- `docs/tasks.md`：任务与验收（不含答案）
- `docs/learning.md`：学习资料（含依赖安装命令与概念讲解）
- `docs/solutions.md`：参考答案（逐步骤对齐 tasks，并附完整代码参考）

## 快速开始

```bash
# 安装依赖
pnpm install

# 构建 Remote 和 Host
pnpm run build:remote
pnpm run build:host

# 启动 Remote 静态服务器（终端 1，端口 3001）
pnpm run serve:remote

# 启动 Host 静态服务器（终端 2，端口 3000）
pnpm run serve:host

# 访问 http://localhost:3000 查看 Host 页面
```

> **延伸探索**：本章节主要使用 Webpack 学习模块联邦。Rspack 也支持模块联邦（API 与 Webpack 基本一致），感兴趣的读者可以参考 `src/remote/rspack.config.js` 和 `src/host/rspack.config.js` 自行探索。


