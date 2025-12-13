# Solution - 04 Runtime 稳定（具体改法与原因）

## 需要改什么
1) webpack（基于 `webpack.runtime.template.js`）
- `optimization.runtimeChunk: "single"`。
- `splitChunks.chunks: "all"`；如需可增加 cacheGroups 但核心是 runtime 抽离。
- `output.filename/chunkFilename: "[name].[contenthash].js"`，确保稳定命名。
- 保持 loader 精简，减少不必要的变动。

2) Rspack（基于 `rspack.runtime.template.js`）
- 同步设置 `runtimeChunk: "single"`、`splitChunks.chunks: "all"`。
- 使用内置 `builtin:swc-loader`，确保配置等价于 webpack。

3) 验证
- 连续构建两次或微调业务代码，检查 runtime 文件 hash 是否保持不变。
- 如 runtime 仍变化，检查是否有业务代码混入 runtime（如自定义插件修改 runtime）。

## 为什么这样改
- runtime 含 chunk 映射表，若与业务打包在一起，任何改动都会导致 runtime hash 变化，缓存抖动。
- 抽离 runtime + contenthash 能稳定长效缓存，仅业务 chunk 随改动更新。
