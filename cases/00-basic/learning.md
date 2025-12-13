# 00 学习：什么是 webpack？什么是“打包构建”？

## 我们在做什么
这一章节我们要做的是：把 `src/` 里分散的 JS、CSS 文件，通过 webpack 处理后输出到 `dist/bundle.js`，让浏览器只需要加载一个 JS 文件就能运行。

## 为什么需要“构建工具”
前端项目在开发时会写很多文件：
- JS 会拆分成多个模块（`import/export`）
- CSS 会独立成文件（`.css`）
- 还可能有图片、字体、TS、JSX…

浏览器最终只需要：更少的文件、更小的体积、更快的加载。
构建工具要做的就是把“开发形态”转换成“上线形态”。

## 所以什么是 webpack

webpack 是一个**模块打包器**（module bundler）：
- 从入口文件开始（entry）
- 递归解析依赖图（import/require）
- 根据规则处理不同类型文件（module.rules / loader）
- 输出到指定位置与文件名（output）

## 需要安装的依赖及其作用

```bash
pnpm add -D webpack webpack-cli swc-loader @swc/core style-loader css-loader
```

- `webpack`：核心打包引擎
- `webpack-cli`：命令行工具（让你能运行 `webpack --mode ...`）
- `swc-loader` + `@swc/core`：编译 JS（可理解为更快的“转译器”）
- `css-loader`：让 webpack 能理解 `import './styles.css'`
- `style-loader`：把 CSS 注入到页面（开发/简单场景常用）

## 四大核心字段（本关只学这四个）

### 1) mode：开发 vs 生产
你会在命令行里使用：
- `webpack --mode development`
- `webpack --mode production`

差异（先感受即可，后续会深入）：
- development：通常不压缩，构建更快，更适合开发
- production：默认开启压缩与优化，体积更小，更适合上线

### 2) entry：入口
入口是“依赖图的起点”。
例如 `entry: './src/index.js'` 表示从这个文件开始，把它 import 的一切都打包进去。

### 3) output：出口
告诉 webpack 输出去哪、叫什么名字：
- `path`: 输出目录（必须是绝对路径）
- `filename`: 输出文件名（本关固定 `bundle.js`，下一关再学 hash）
- `clean`: 构建前清理输出目录，避免旧文件干扰

### 4) module.rules：规则（loader）
webpack 默认只认识 JS。遇到 CSS 就需要 loader：
- `test`：匹配文件类型（正则）
- `use`：用什么 loader 处理

本关两条规则足够：
- JS → `swc-loader`
- CSS → `css-loader` + `style-loader`

## 你应该如何验证自己学会了
完成任务后：
- `pnpm run build:dev` 与 `pnpm run build` 都能输出 `dist/bundle.js`
- production 的 `bundle.js` 明显更小（压缩生效）

## 下一步
完成本章节后，你已经知道 webpack 的“最小可用配置”。下一关（01）会开始讨论：
- 为什么要改文件名（缓存）
- 为什么需要 hash（`[contenthash]`）
- 如何做开发/生产差异化配置


