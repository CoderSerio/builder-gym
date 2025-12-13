# 03 Vendor 拆分与缓存稳定

## 背景故事
单入口把框架、第三方库、业务代码全部打进一个 bundle。业务改动迫使用户重复下载 5MB 的 main.js，缓存命中极差。

## 现象

- `main.js` 体积巨大。
- 改一行业务代码，框架和库的 hash 也跟着变化。
- 浏览器缓存失效，重复下载。

## 知识点

- webpack `splitChunks` 策略与 cacheGroups。
- rollup `manualChunks`。
- contenthash/filename 稳定性。
- 浏览器长期缓存与 HTTP 缓存行为。

## 诊断提示

- 检查 chunkgraph：框架/三方是否被拆到单独 chunk。
- 观察 contenthash 是否随业务小改而波动。
- 构建两次对比产物 hash 变化。

## 任务
1. 为 React/ReactDOM 单独拆分（Framework 层）。
2. 为第三方库（如 lodash/axios）拆分（Libs 层）。
3. 业务公共组件单独 chunk（Commons 层）。
4. 业务代码保持独立 chunk（App 层），开启 contenthash。
5. Rollup 侧尝试 `manualChunks` 实现同样拆分。

## 验证步骤

```bash
pnpm install
pnpm run build   # 替换为 webpack/rollup 实际构建
pnpm bench
```

修改业务代码重新构建，检查非业务 chunk 的 hash 是否保持稳定。

## 扩展阅读

- webpack splitChunks 官方文档
- rollup manualChunks 设计
- 浏览器缓存与 contenthash 实战

