# 03 任务：Vendor 拆分与缓存稳定

## 背景
单入口把框架、第三方库、业务代码全部打进一个 bundle。业务改动迫使用户重复下载大文件，缓存命中极差。

## 现象
- `main.js` 体积巨大。
- 改一行业务代码，框架和库的 hash 也跟着变化。
- 浏览器缓存失效，重复下载。

## 任务清单
### 1. 安装依赖
依赖安装命令请看 `learning.md`（本文件不提供答案命令）。

### 2. 设计分层拆分策略
把产物按层拆分（示例）：
- Framework：React/ReactDOM
- Libs：其他第三方库
- Commons：业务公共组件
- App：业务代码

### 3. webpack 实现 splitChunks
用 `splitChunks.cacheGroups` 实现上述分层，并启用 `contenthash`。

### 4. rollup 实现 manualChunks（对比）
用 `manualChunks` 实现同样分层。

### 5. 验证缓存稳定
修改业务代码重新构建，检查非业务层 chunk 的 hash 是否保持稳定。


