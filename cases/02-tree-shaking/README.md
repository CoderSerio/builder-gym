# 02 Tree Shaking & sideEffects

## 背景故事
一个组件包全量引入，产物里留下大量未使用的函数；同时 package.json 缺少 sideEffects 声明，导致摇树失效。

## 现象
- 打包后含未使用的 util 函数。
- 有的模块是 CJS，阻断摇树。
- 依赖含副作用文件（样式/全局注册）混在一起。

## 知识点
- ESM vs CJS 对 Tree Shaking 的影响。
- package.json `sideEffects` 字段的语义与写法。
- webpack `usedExports`/`concatenateModules`；rollup 默认摇树。

## 诊断提示
- 在源码中标记一个未使用函数，观察产物是否被删除。
- 检查是否存在 `require`/动态导入破坏静态分析。
- 检查样式、polyfill 等是否应列入 sideEffects 白名单。

## 任务
1. 修正 package.json 的 `sideEffects` 标记，确保纯 ESM 模块可被摇树。
2. 将示例中的 CJS util 改为 ESM，或通过 `type: module`/`exports` 配置。
3. 分别用 webpack 与 rollup 生成产物，对比摇树结果和体积。

## 验证步骤
```bash
pnpm install
pnpm run build         # 替换为 webpack/rollup 实际构建命令
pnpm bench
```
观察 dist 里 `unused` 是否被移除，体积是否下降。

## 扩展阅读
- webpack Tree Shaking 文档
- rollup treeshake 选项
- sideEffects 与 CSS/Polyfill 的处理


