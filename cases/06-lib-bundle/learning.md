# 06 学习：什么是“库构建”？为什么要 ESM/CJS/d.ts？

## 本关需要安装哪些依赖（以及为什么）
```bash
pnpm add -D tsup typescript
pnpm add -D rollup @rollup/plugin-node-resolve @rollup/plugin-commonjs @rollup/plugin-typescript
```

## 库构建和应用构建的区别
- 应用（App）：面向最终用户，通常会把依赖一起打包，追求首屏与加载体验
- 库（Lib）：面向开发者与其他项目复用，通常要 **externalize** 依赖，避免重复打包

## 为什么要同时输出 ESM 和 CJS
现实中消费方可能是：
- 现代工具链（Vite/Rollup/Rspack）更偏好 ESM，Tree Shaking 更好
- 老项目/Node 环境仍需要 CJS（require）

因此常见做法是：一个包同时提供 import/require 两种入口。

## 为什么要输出 d.ts
TypeScript 的类型声明文件：
- 让 IDE 能正确提示与跳转
- 让 TS 项目能进行类型检查
库没有 d.ts，会极大影响“可用性”

## external 的意义（非常重要）
以 react 为例：
- 如果你把 react 打进库产物，消费方项目里也有 react，就可能重复/冲突
- 更理想的是 externalize，让消费方复用自己的 react

## tsup 与 rollup 的定位
- tsup：基于 esbuild，配置少、速度快，适合内部库/快速迭代
- rollup：更细粒度可控，生态成熟，适合对输出结构要求严格的库


