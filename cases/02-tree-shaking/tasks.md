# 02 任务：修复 Tree Shaking（sideEffects / ESM vs CJS）

## 背景
一个组件包全量引入，产物里留下大量未使用的函数；同时 `package.json` 缺少 `sideEffects` 声明，导致 Tree Shaking 失效。

## 现象
- 打包后含未使用的 util 函数。
- 有的模块是 CJS，阻断摇树。
- 依赖含副作用文件（样式/全局注册）混在一起。

## 任务清单
### 1. 安装依赖
请阅读 `learning.md`。

### 2. 修正 `package.json` 的 `sideEffects`
正确标记哪些文件“有副作用不能删”，其余文件应允许摇树。

### 3. 解决 CJS 阻断摇树问题
让示例中的 CJS util 不再阻断（改为 ESM 或引入对应转换方案）。

### 4. 分别用 webpack 与 rollup 构建并对比
对比产物体积与“未使用代码是否被移除”。

## 验证
- dist 中未使用的函数不应出现在最终产物（或显著减少）
- 体积较反例明显下降


