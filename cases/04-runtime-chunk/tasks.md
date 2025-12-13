# 04 任务：Runtime Chunk 稳定性

## 背景
runtime 被打进业务 chunk，导致任何小改动都会让 runtime hash 变化，引发缓存抖动。

## 现象
- 改一行业务代码，runtime 文件 hash 也变。
- 浏览器缓存命中率低。

## 任务清单
### 1. 安装依赖
依赖安装命令请看 `learning.md`（本文件不提供答案命令）。

### 2. webpack 抽离 runtime
在 webpack 配置中启用 runtime 抽离（目标：runtime 单独输出）。

### 3. Rspack 做等价实现（对比）
在 Rspack 中实现同样的 runtime 抽离策略。

### 4. 验证 hash 稳定性
修改业务代码重新构建，检查 runtime 文件的 hash 是否保持稳定。


