# 06 任务：库构建现代化（ESM/CJS/d.ts）

## 背景
内部 UI 组件库仅输出 CJS，缺少 d.ts，含冗余运行时代码，无法被 Tree Shaking，IDE 也没有类型提示。

## 现象
- 产物夹带大量 bundler runtime
- 只有 CJS，缺少 ESM（现代工具链无法 Tree Shaking）
- 没有 `.d.ts`，TypeScript 项目使用时缺少类型提示
- React 等依赖被打进产物，消费方可能加载多份依赖

## 任务清单

### 1. 安装依赖
依赖安装命令请看 `learning.md`（含 TypeScript 基础 + tsup/rollup 工具链）。

### 2. 使用 tsup 输出 ESM + CJS + d.ts
配置 `tsup.config.ts`，一次构建产出：
- ESM 格式（`dist/index.mjs` 或 `dist/index.js`）
- CJS 格式（`dist/index.cjs`）
- TypeScript 类型声明（`dist/index.d.ts`）

并且确保：
- `external: ["react", "react-dom"]`（不把 React 打进产物）
- `treeshake: true`（未使用导出不进入产物）

### 3. rollup 对比方案（选做）
配置 `rollup.config.js`，实现与 tsup 等价的产物：
- 同样输出 ESM/CJS
- 同样 external React
- 同样开启 treeshake

### 4. 验证（类型 + 摇树 + external）
#### 4.1 类型提示验证
在 IDE 里打开 `consumer.example.ts`，输入 `add(` 查看是否有参数提示。

#### 4.2 Tree Shaking 验证
构建后检查产物 `dist/index.mjs`（或 `dist/index.js`），搜索 `heavyUnused` 是否存在：
- **不存在** → Tree Shaking 生效 ✅
- **存在** → 配置有问题，回头检查 `treeshake` 和 `format`

#### 4.3 external 验证
检查产物大小或内容，确认 React 没有被打进来：
- 产物体积应该很小（几 KB 到几十 KB）
- 产物里只有 `import React from "react"` 这类引用，没有 React 的源码实现


