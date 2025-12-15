# 06 学习：库构建的关键点（TypeScript + external + 多格式输出）

## 本章节需要安装的依赖

```bash
# TypeScript 编译基础（必需）
pnpm add -D typescript

# 方案 A：tsup（推荐，基于 esbuild，配置少、速度快）
pnpm add -D tsup

# 方案 B：rollup（可选，更细粒度控制）
pnpm add -D rollup @rollup/plugin-node-resolve @rollup/plugin-commonjs @rollup/plugin-typescript

# 运行时依赖（本 demo 库用到了 React）
pnpm add react react-dom
```

## 库构建 vs 应用构建：为什么要区分

### 应用（App）构建
- **目标用户**：最终用户（浏览器访客）
- **产物特点**：把所有依赖打包成可直接运行的 bundle（带 bundler runtime）
- **典型工具**：webpack、Rspack（之前章节用的都是"应用构建"思路）

### 库（Lib）构建
- **目标用户**：开发者（其他项目的 `node_modules`）
- **产物特点**：只打包自己的代码，**不包含外部依赖**（让消费方复用自己的依赖）
- **典型工具**：rollup、tsup、tsc

**一句话记忆**：应用是"全家桶打包"，库是"只打包自己、依赖留给消费方"。

## 什么是 tsc（TypeScript Compiler）

`tsc` 是 TypeScript 官方编译器：
- 把 `.ts` 编译成 `.js`
- 同时生成 `.d.ts` 类型声明文件

但 `tsc` 本身**只转译、不打包**：
- 一个 `.ts` 文件对应一个 `.js` 文件（保持目录结构）
- 适合"源码目录结构不想被打平"的库

缺点：
- 不能做 Tree Shaking
- 不能 bundling（多文件合并）
- 输出产物通常比较碎片化

所以实际库构建更常用 **bundler + tsc**（或者用 tsup/rollup 这种已经集成 TS 能力的工具）。

## 什么是 tsup

`tsup` 是基于 **esbuild** 的零配置库打包工具：
- 底层编译用 esbuild（极快）
- 自动支持 TypeScript（无需手动配 tsc）
- 一行命令就能输出 ESM/CJS/d.ts

特点：
- **配置少**：大部分场景只需要几个字段
- **速度快**：esbuild 是用 Go 写的 bundler，比 webpack/babel 快很多
- **开箱即用**：自动处理 TS、JSX、类型声明

适用场景：
- 内部库（不需要极致控制产物结构）
- 快速迭代（配置成本低）
- 中小型库（大型开源库可能还是用 rollup 获得更细粒度控制）

## 拆分 vendor（应用构建）vs external（库构建）：两者的区别

### 拆分 vendor（03 章节讲过的"应用构建"策略）
- **目标**：把应用代码拆成多个 chunk（framework/libs/commons/app），利用浏览器缓存
- **产物**：所有依赖最终都被打包进产物（只是拆到不同文件里）
- **典型工具**：webpack 的 `splitChunks`
- **消费方式**：浏览器直接加载这些 chunk（`framework.xxx.js` + `app.xxx.js`）

### external（本章节的"库构建"策略）
- **目标**：把外部依赖**完全排除在产物之外**（不打包）
- **产物**：只包含库自己的代码，依赖变成 `import React from "react"` 这种引用
- **典型工具**：rollup/tsup 的 `external` 配置
- **消费方式**：消费方项目在自己的构建里负责提供这些依赖（或从 CDN 加载）

### 一句话对比
- **拆分 vendor**：依赖仍然被打包（只是拆到不同文件），适合应用
- **external**：依赖根本不打包（留给消费方处理），适合库

## external + CDN 的实际场景

当你把库发布到 npm，并在 `package.json` 里声明：
```json
{
  "peerDependencies": {
    "react": "^18.0.0"
  }
}
```

消费方项目在使用你的库时，可以选择：

### 场景 A：消费方自己打包 React（常见）
- 消费方在自己的 `package.json` 里安装 `react`
- 消费方的 webpack/Vite 会把 React 打包进自己的 bundle
- 你的库和消费方的业务共用同一份 React

### 场景 B：消费方用 CDN 外链 React（更极致）
消费方在 HTML 里直接用 CDN 加载 React：
```html
<script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
<script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
```

然后在构建配置里也把 React 标记为 external：
```js
// 消费方的 webpack.config.js
module.exports = {
  externals: {
    react: "React",           // 告诉 webpack：遇到 import 'react' 就用全局变量 React
    "react-dom": "ReactDOM"
  }
};
```

**好处**：
- React 从 CDN 加载（可能被浏览器缓存/更快）
- 多个库都用 CDN 的同一份 React，不会重复加载
- 减少自己 bundle 的体积

**你的库因为已经 externalize React**，所以在这两种场景下都能正常工作（不会和消费方的 React 冲突）。

## package.json 的关键字段（库发布必看）

当你构建出 `dist/index.mjs`（ESM）、`dist/index.cjs`（CJS）、`dist/index.d.ts`（类型）后，还需要在 `package.json` 里告诉工具链"怎么找到这些文件"：

### 1) `exports`（现代推荐写法）
```json
{
  "exports": {
    ".": {
      "import": "./dist/index.mjs",
      "require": "./dist/index.cjs",
      "types": "./dist/index.d.ts"
    }
  }
}
```
- `import`：当消费方用 `import` 时，走这个入口（ESM）
- `require`：当消费方用 `require` 时，走这个入口（CJS）
- `types`：告诉 TypeScript 类型声明文件在哪

### 2) `main` / `module` / `types`（兼容老工具链）
```json
{
  "main": "./dist/index.cjs",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts"
}
```
- 老版本的 webpack/rollup 可能不认 `exports`，还需要这套字段兜底

### 3) `peerDependencies`（声明"消费方需要提供哪些依赖"）
```json
{
  "peerDependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0"
  }
}
```
- 告诉 npm/pnpm："这个库需要 React 18，但我不会把它打包进来，请消费方自己提供"

## tsup 的核心配置（本章节重点）

```ts
import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],           // 入口文件
  format: ["esm", "cjs"],             // 同时输出 ESM 和 CJS
  dts: true,                          // 生成 .d.ts 类型声明
  external: ["react", "react-dom"],   // 不把 React 打进产物
  treeshake: true,                    // 启用 Tree Shaking
  clean: true                         // 构建前清空 dist
});
```

关键点：
- `format: ["esm", "cjs"]`：一次构建产出两种格式
- `dts: true`：自动调用 tsc 生成类型声明（无需手动配 tsconfig 的 `declaration`）
- `external`：标记哪些依赖"不打包"

## rollup 的库构建配置（对比学习）

```js
export default {
  input: "src/index.ts",
  output: [
    { file: "dist/index.cjs", format: "cjs" },
    { file: "dist/index.mjs", format: "esm" }
  ],
  external: ["react", "react-dom"],
  treeshake: true,
  plugins: [
    nodeResolve(),
    commonjs(),
    typescript({ tsconfig: "./tsconfig.json" })
  ]
};
```

和 tsup 的对比：
- rollup 需要手动配 plugins（`@rollup/plugin-typescript` 处理 TS）
- rollup 的 `external` 写法和 tsup 一致
- rollup 更显式（每个环节都看得见），但配置更多

## 如何验证三件事（类型/摇树/external）

### 1) 验证类型提示
- 用 IDE 打开 `consumer.example.ts`
- 输入 `add(` 看是否有参数提示
- **预期**：IDE 能提示 `a: number, b: number`

### 2) 验证 Tree Shaking
- 查看构建产物 `dist/index.mjs`
- 搜索 `heavyUnused` 字符串
- **预期**：找不到 `heavyUnused`（它未被使用，应该被摇掉）

### 3) 验证 external
- 查看产物大小（`ls -lh dist/`）
- 或打开产物搜索 React 的源码实现
- **预期**：
  - 产物体积小（几 KB 到几十 KB）
  - 产物里只有 `import React from "react"`，没有 React 的源码

## 本章节验收关注点
- 能产出 ESM/CJS 两种格式
- 能产出 `.d.ts` 类型声明
- IDE 能正确提示类型
- Tree Shaking 能生效（未使用导出不出现在产物里）
- external 生效（React 不被打进库产物）
- `package.json` 的入口字段配置正确（main/module/types/exports）
