# 08 学习（可选）：SSR 为什么要分 client/server？什么是 external？

## 本关需要安装哪些依赖（以及为什么）
```bash
pnpm add -D webpack webpack-cli
pnpm add -D rollup
```
（如使用 Rspack，请额外安装 `@rspack/cli`/`@rspack/core`。）

## SSR/同构的直觉
SSR 至少有两端：
- **server**：Node 环境，把 React 组件渲染成 HTML
- **client**：浏览器环境，把 HTML “hydrate” 成可交互的应用

因此通常需要两份产物：
- server bundle：运行在 Node
- client bundle：运行在浏览器

## 为什么要 externalize server 的 node_modules
server 端的依赖（react、react-dom/server、各类 node 包）在部署环境通常已经存在：
- 如果你把它们打进 server bundle，会导致体积膨胀
- 还可能产生重复依赖/版本冲突

externalize 的目标是：server bundle 只打包你的业务代码，依赖由运行环境提供。

## client 侧为什么还要做缓存策略
client 面向用户网络与加载速度：
- contenthash + runtime 拆分能提高缓存命中
- 业务更新只影响业务 chunk，不影响框架/三方库 chunk

## 本关验收关注点
- server 产物不应包含整个 node_modules（至少 react 不应被重复打进）
- client 产物能正常 hydrate
- client 产物具备较好的缓存稳定性（hash 变化范围可控）


