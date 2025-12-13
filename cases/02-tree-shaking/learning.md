# 02 学习：Tree Shaking 为什么会失效？怎么判断是否生效？

## 本关需要安装哪些依赖（以及为什么）
```bash
pnpm add -D webpack webpack-cli rollup @rollup/plugin-node-resolve @rollup/plugin-commonjs
```

- webpack/webpack-cli：构建对比组（很多业务在用）
- rollup：对比组（天然偏 ESM/库构建友好）
- node-resolve：让 rollup 能解析 node_modules
- commonjs：把 CJS 依赖转换为可被 rollup 静态分析的形式

（如果你还需要处理 CSS/JS 转译，可按关卡需要补充 css/ts/swc/babel 相关插件。）

## 什么是 Tree Shaking
Tree Shaking 直译是“摇树”，本质是：**删除没有被用到的导出代码**（dead code elimination）。
要做到这一点，构建器必须能静态判断：
- 这个模块导出了哪些东西？
- 哪些导出被引用了？

## 关键前提：ESM 才是摇树的基础
ESM 的 `import/export` 是静态结构，构建器可以在编译阶段分析依赖图。
CJS 的 `require()` 可以是动态的（运行时决定加载哪个模块），静态分析能力会变差，从而影响摇树。

## sideEffects 是什么
`package.json` 的 `sideEffects` 用来告诉构建器：
- 哪些文件“即使看起来没被 import 使用”，也不能删（因为它们有副作用）
典型副作用：
- 引入 CSS（产生全局样式）
- polyfill（修改全局对象）
- 注册全局组件/patch 原型链

如果你不声明 sideEffects：
- 构建器可能“保守”，不敢删 → 体积更大
如果你声明错误：
- 构建器可能“大胆”，把该保留的删了 → 运行出错

## 如何判断是否摇树成功
你可以用最朴素的方法：
- 在源码里写一个明显不会被调用的大函数（heavyUnused）
- 构建后在 dist 里搜索它是否仍存在（或体积是否显著下降）

## webpack vs rollup 的差异（你本关要观察的点）
- webpack：需要配合 mode/optimization 与 sideEffects 才能最大化效果
- rollup：默认 treeshake 更激进，但遇到 CJS 依赖时必须用 commonjs 插件


