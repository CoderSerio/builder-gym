# 05 学习：为什么迁移到 Rspack？怎么做“等价迁移”？

## 本章节需要安装的依赖

可以把这一章节是：**同一份业务代码**，但我们准备两套构建方案：
- **webpack（对照组）**：老项目常见的 Babel + webpack
- **Rspack（目标组）**：尽量等价迁移后，再做“开发体验优化”

```bash
# 两组通用的依赖
pnpm add -D style-loader css-loader

# webpack 对照组
pnpm add -D webpack webpack-cli webpack-dev-server babel-loader @babel/core @babel/preset-env @babel/preset-react html-webpack-plugin

# Rspack 核心
pnpm add -D @rspack/cli @rspack/core @rspack/plugin-react-refresh react-refresh
```

- `@rspack/plugin-react-refresh 和 react-refresh`：用于热更新

## 先认识一下 Rspack：它是什么？
面向没接触过 Rspack 的同学，只要先记住：
- **Rspack 是“对齐 webpack5 生态/配置习惯”的 bundler**（很多概念同名：entry/output/module.rules/optimization…）
- **它的核心编译链路由 Rust/SWC 驱动**，目标是让冷启动、增量构建、HMR 更快

## 什么叫“等价迁移”
等价迁移不是“配置逐行照抄”，而是：
- 入口、输出、资源处理结果一致
- 关键 loader/plugin 行为一致（例如 JSX/TS 转译、CSS 处理）
- 运行效果一致（页面能正常运行、HMR 可用）

## 核心思路
对应 `docs/tasks.md` 的核心思路如下：

### 1. 先把“对照组”跑起来（webpack）
你会看到本章节的 `webpack.config.js` 是典型的老项目套路：
- `devtool: "source-map"`：调试好，但对开发构建/增量会比较重
- `babel-loader`：链路长（尤其在大项目里 + 插件多时）

你要做的不是在这里优化 webpack，而是把它当作“对照基线”。

### 2. 迁移到 Rspack
可以按下面这个“翻译表”去检查 `rspack.config.js`：
- **entry**：`src/index.jsx`（保持一致）
- **JSX 转译**：
  - webpack：`babel-loader` + `@babel/preset-react`
  - Rspack：`builtin:swc-loader`，并打开 JSX 解析（`parser.jsx: true`）
- **CSS 处理**：
  - 两边都可以保持 `style-loader` + `css-loader`（先追求等价）

迁移完成后，验收标准是：**页面行为一致**（而不是“配置长得一样”）。

## 使用插件： `HtmlRspackPlugin({ template })` / `HtmlWebpackPlugin({ template })`？

> tips：Rspack 的 `HtmlRspackPlugin` 在你当前使用的版本里已经由 `@rspack/core` 直接提供

### 这个插件做了什么？
- 读取模板 `src/index.html`
- 在构建/开发时生成最终的 `index.html`
- **自动把打包出来的 JS（以及需要的 chunk）注入到 HTML 里**

> 对比一下三类配置的分工：  
> - `resolve.extensions`：解决“import 不写后缀时，怎么找到文件”  
> - `module.rules (loader)`：解决“找到文件后，怎么把它变成可打包的模块”  
> - `HtmlxxxPlugin`：解决“如何产出可访问的首页，并把脚本挂上去”

### 不写会怎样？
当你只配置了 `entry`，但没有提供/生成 `index.html`：
- `webpack serve` / `rspack dev` 可能能启动
- 但访问根路径 `/` 会看到 **`Cannot GET /`**（因为 dev server 没有 html 可以返回）

### 插件（plugins）和 loaders 的区别是什么
- **Loader**：更像“文件转换器”，主要解决“**某一种类型的文件**怎么变成 JS 模块让 bundler 能打包”。  
  - 典型例子：`babel-loader` 把 JSX/新语法转成浏览器能跑的 JS；`css-loader` 把 CSS 变成 JS 可理解的依赖；`style-loader` 把 CSS 在运行时注入到页面。
  - 配置位置：`module.rules`
  - 触发方式：当模块图里出现“import 某个文件”时，命中 `test` 规则就会走对应 loader

- **Plugin**：更像“构建流程的钩子/扩展点”，可以在**打包的不同阶段**做更宏观的事情（产物生成、注入、优化、注入环境变量等）。  
  - 典型例子：`HtmlWebpackPlugin` / `HtmlRspackPlugin` 负责“生成最终的 `index.html` 并把打包出来的脚本自动插进去”，解决你访问 `/` 没有 HTML 可返回的问题。
  - 配置位置：`plugins`

一句话记忆：**loader 处理‘某个文件怎么进模块图’，plugin 处理‘整个构建过程/产物怎么被组织起来’**。

### 3. 再做“开发体验优化”（Rspack 侧）
本章节要你重点关注三个字段（在 `rspack.config.js` 中）：
- **devtool**：开发模式尽量用 `eval-cheap-module-source-map` 这类更快的方案（生产模式则是 
- **cache（filesystem）**：让重复启动/重复编译更快
- **lazyCompilation**：把“首次启动要编译的东西”变少，提升冷启动体验

另外，Rspack 更主张“内置化”，例如 `builtin:swc-loader`、`builtins.react` 的 refresh、以及部分构建优化能力。
**但仍然有不少插件形式提供的部分**，比如更偏“产物组织/工程集成”的能力（比如 HTML 生成、PWA、某些资源注入）通常不会硬塞进 `@rspack/core`，而是拆成**官方插件**。


## 常见迁移问题
- **loader 名称/能力不完全等价**：Rspack 有内置 loader（如 `builtin:swc-loader`），不要硬把 webpack loader 逐个搬过去
- **devtool 默认策略差异**：对比时记得明确写出来，否则性能对比不公平
- **“跑得起来”不等于“等价”**：要用同样的入口、同样的资源处理方式做对照

## 常见迁移坑
- loader 名称不同（webpack loader vs Rspack 内置 loader）
- devtool 策略不同（默认值差异）
- 缓存目录与命中策略不同

## 为什么 cache/lazyCompilation 能提升体验
- filesystem cache：避免重复编译同样的模块
- lazyCompilation：首次启动只编译必要入口，减少冷启动工作量

## 本章节验收关注点
- 迁移后功能不回退（页面能跑）
- 冷启动时间下降
- 单文件修改后 HMR/增量时间下降


