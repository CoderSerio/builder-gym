# 04 Runtime Chunk 稳定性

## 背景故事
runtime 被打进业务 chunk，导致任何小改动都会让 runtime hash 变化，引发缓存抖动。

## 现象
- 改一行业务代码，runtime 文件 hash 也变。
- 浏览器缓存命中率低。
- source map/调试信息混乱。

## 知识点
- webpack `optimization.runtimeChunk` 与 chunkgraph。
- Rspack 对应配置与差异。
- 长期缓存策略：contenthash、immutable runtime。

## 诊断提示
- 构建两次对比 runtime 大小/哈希。
- 查看 runtime 是否单独输出。
- 检查 entryChunks 是否混入 runtime 模块。

## 任务
1. 在 `webpack.runtime.bad.js` 中分离 runtime，启用 `runtimeChunk: 'single'`。
2. 确保 contenthash 稳定，调整 chunkFilename。
3. 在 Rspack 对等配置中实现同样策略，对比产物差异。
4. 验证修改业务代码时 runtime 是否保持稳定。

## 验证步骤
```bash
pnpm install
pnpm run build     # 替换为 webpack/rspack 实际构建
pnpm bench
```
构建两次并对比 dist 文件名变化。

## 扩展阅读
- webpack runtimeChunk 文档
- Rspack runtime 处理
- 浏览器缓存最佳实践

