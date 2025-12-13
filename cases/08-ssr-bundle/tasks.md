# 08 任务（可选）：多入口 / SSR-friendly 打包

## 背景
同构/SSR 项目需要前后端分别打包：前端 browser bundle，后端 node bundle。现有配置将两端混为一谈，导致体积大、外部依赖无法 external。

## 现象
- 服务端产物包含大量 browser 依赖。
- externals 配置缺失，node_modules 被打进 server 包。
- runtime 未拆分，缓存与调试困难。

## 任务清单
### 1. 安装依赖
依赖安装命令请看 `learning.md`（本文件不提供答案命令）。

### 2. client/server 分别打包
分别为 client 与 server 配置构建（webpack 或 Rspack；server 也可用 rollup）。

### 3. server externalize node_modules
让 server 产物不打包 node_modules（如 react/react-dom/server），并设置 `target=node`。

### 4. client 缓存策略
client 侧做好 runtime 拆分与缓存策略（contenthash/runtimeChunk）。

### 5. 验证 SSR
验证 SSR 渲染示例能正常运行。


