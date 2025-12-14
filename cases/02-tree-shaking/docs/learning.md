# 02 学习：Tree Shaking 为什么会失效？怎么判断是否生效？

## 本章节需要的依赖及其作用

> 这一次，我们顺便引入了 rollup 进行对比

```bash
pnpm add -D \
  webpack webpack-cli \
  rollup @rollup/plugin-node-resolve @rollup/plugin-commonjs rollup-plugin-postcss postcss \
  babel-loader @babel/core @babel/preset-env \
  style-loader css-loader 
```

- webpack/webpack-cli：构建对比组（很多业务在用）
- rollup：对照组组（天然偏 ESM/库构建友好）
- node-resolve：让 rollup 能解析 node_modules
- commonjs：把 CJS 依赖转换为可被 rollup 静态分析的形式
- postcss: css 预编译的集成库
- rollup-plugin-postcss：因为本关源码里有 `import "./styles.css"`，rollup 默认不支持 CSS（webpack也一样），需要插件才能处理这种 import
- 其他可选插件：如果还需要处理 TS/JSX 转译，可按需补充 ts/swc/babel 相关插件

## 什么是 ESM？什么是 CJS？

由于 NodeJS 诞生的时候，JS 生态还没有官方的模块化方案（也就是后来出 EcmaScript Module，简称 ESM），所以 NodeJS 自己发明了一种模块化方案叫 CommonJS （CJS）。
这样的历史原因导致了 NodeJS 生态存在两种常见的模块化方案，打包构建的时候要区分处理。

### ESM
- 语法：`import ... from "..."` / `export ...`
- 特点：**静态结构**（依赖关系在编译期可确定）
- 结果：更利于 Tree Shaking（构建器更容易判断“哪些导出没被用到”）

### CJS
- 语法：`const x = require("x")` / `module.exports = ...`
- 特点：更偏**运行时加载**（`require()` 可能是动态的）
- 结果：静态分析更困难，Tree Shaking 更容易失效或变保守

## 什么是 Tree Shaking
Tree Shaking 直译是“摇树”（或者“树摇”），本质是：**删除没有被用到的导出代码**（dead code elimination）。

要做到这一点，构建器必须能静态判断：
- 这个模块导出了哪些东西？
- 哪些导出被引用了？

## 关键前提：ESM 才是摇树的基础
ESM 的 `import/export` 是静态结构，构建器可以在编译阶段分析依赖图。
CJS 的 `require()` 可以是动态的（运行时决定加载哪个模块），静态分析能力会变差，从而影响摇树。

## sideEffects 是什么
`package.json` 中可以添加一个 `sideEffects` 字段，形如

这是用来告诉构建器：
- 哪些文件“即使看起来没被 import 使用”，也不能删（因为它们有副作用）

典型副作用：
- 引入 CSS（产生全局样式）
- polyfill（修改全局对象）
- 注册全局组件/patch 原型链

### 一个简单的 sideEffects 案例
假设你在写一个库（lib），它有 3 个文件：

- `src/index.ts`（入口，只导出方法）
- `src/init.ts`（有副作用：一 import 就会往全局挂东西）
- `src/styles.css`（有副作用：全局样式）

代码示意：

```ts
// src/index.ts
export { add } from "./math";
// 注意：这里没有 import "./init" 也没有 import "./styles.css"
```

```ts
// src/init.ts（副作用文件：一旦被打进包，就会执行）
(globalThis).__LIB_INIT__ = true;
console.log("lib init");
```

```css
/* src/styles.css（副作用文件：影响全局样式） */
body { background: #fff; }
```

场景 A：你把 sideEffects 写成 `false`（或 `[]`）

```json
{
  "sideEffects": false
}
```

含义：告诉构建器“本包没有任何副作用文件，可以大胆删”。

- 好处：摇树更激进，体积更小
- 风险：如果你其实有 `init.ts` / `styles.css` 这种副作用文件，一旦它们被错误地当作“可删”，就可能导致线上行为缺失（比如样式丢失、全局注册没执行）

场景 B：你把 sideEffects 精确白名单出来（推荐）

```json
{
  "sideEffects": [
    "*.css",
    "./src/init.ts"
  ]
}
```

含义：只有这些文件“不能被摇树删除”，其它文件可以摇树。

- 结果：`math.ts` 里未用导出可以被删除；但如果你某处 import 了 `./init.ts` 或 CSS，则它们不会被误删。

> `sideEffects` 的目标不是“越空越好”，而是“足够准确”。准确的白名单能同时保证体积与正确性。

如果你不声明 sideEffects：
- 构建器可能“保守”，不敢删 → 体积更大
如果你声明错误：
- 构建器可能“大胆”，把该保留的删了 → 运行出错

## 如何判断是否摇树成功
我们可以用最朴素的方法：
- 在源码里写一个明显不会被调用的大函数（比如本章节中的 `heavyUnused`）
- 构建后在 dist 里搜索它是否仍存在（或体积是否显著下降）

## webpack vs rollup 的差异（本章节要观察的点）
- webpack：需要配合 mode/optimization 与 sideEffects 才能最大化效果
- rollup：默认 treeshake 更激进，但遇到 CJS 依赖时必须用 commonjs 插件

### 为什么有 webpack 了还要学/用 rollup？
一句话：**两者定位不同，擅长的场景不同**，用 rollup 当对照能帮助你更好理解 Tree Shaking。

- webpack 更偏“应用构建”（App bundler）
  - 有更好的开发体验（HMR）、各种资源类型处理（CSS/图片/字体）、生态庞大，适合复杂业务应用。
  - Tree Shaking 策略更加复杂惊喜，在真实业务里经常会被 CJS、sideEffects、动态依赖等因素影响，需要配合配置才能最大化

- rollup 更偏“库构建”（Lib bundler）
  - 以 ESM 为中心，输出产物更“干净”（可以观察产物），默认 treeshake 更激进，常用于打包组件库/工具库
  - 通过 `external` 更容易做到“不要把依赖打进产物”，避免 runtime 冗余

所以本章节同时给 webpack/rollup：
- 不是为了“选边站”，而是让你看到：**同一份源码在不同 bundler 下，摇树表现为何会不同**；
- 当你遇到业务摇树失败时，也能学会用 rollup/ESM 的视角反推问题根因（CJS、副作用、配置）。 


