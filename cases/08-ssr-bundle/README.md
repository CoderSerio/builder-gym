# 08 （可选）多入口 / SSR-friendly 打包

## 背景故事
同构/SSR 项目需要前后端分别打包：前端 browser bundle，后端 node bundle。现有配置将两端混为一谈，导致体积大、外部依赖无法 external。

## 现象
- 服务端产物包含大量 browser 依赖。
- externals 配置缺失，node_modules 被打进 server 包。
- runtime 未拆分，缓存与调试困难。

## 知识点
- 前后端双入口构建：target、externals、output。
- rollup/webpack/Rspack 在 server 端的差异。
- chunk 拆分与 runtime 稳定。

## 诊断提示
- 检查 server 产物是否包含 React/DOM。
- 观察 bundle 是否区分 node/browser target。
- 查看 externals 是否正确排除 node_modules。

## 任务
1. 分别为 client/server 配置打包（webpack 或 Rspack；server 也可用 rollup）。
2. server 产物 externalize node_modules，target=node。
3. client 侧做好 runtime 拆分与缓存策略。
4. 验证 SSR 渲染示例能正常运行。

## 验证步骤
```bash
pnpm install
pnpm run build:client
pnpm run build:server
pnpm bench   # 可针对 client 产物对比
```

## 扩展阅读
- webpack target/node externals
- rollup for SSR
- Rspack SSR 支持进展

