# Solution - 06 库构建

> 本答案的结构严格对齐 `docs/tasks.md` 的 1-4 步；每一步都包含：**操作** / **需要改哪里** / **为什么** / **如何验收**。

## 1. 安装依赖

**操作**：按 `docs/learning.md` 的依赖清单安装即可。

**解释**：
- 本关提供 **tsup**（推荐，快速上手）和 **rollup**（可选，对比学习）两条路线
- tsup 需要 `tsup` + `typescript`
- rollup 需要 `rollup` + 相关插件（`@rollup/plugin-typescript` 等）
- 运行时依赖（本 demo 用到了 React）需要 `react` + `react-dom`

**验收**：
- 安装后 `pnpm build:tsup` 能正常执行（即使产物可能还不完美）

---

## 2. 使用 tsup 输出 ESM + CJS + d.ts

**我们需要改的文件**：`tsup.config.ts`

**关键配置点**：
- `entry: ["src/index.ts"]`：入口文件
- `format: ["esm", "cjs"]`：同时输出两种格式
- `dts: true`：生成 `.d.ts` 类型声明
- `external: ["react", "react-dom"]`：把 React 标记为外部依赖，不打进产物
- `treeshake: true`：启用摇树（让未使用导出不进入产物）
- `clean: true`：构建前清空 dist

**为什么这样配**：
- `format: ["esm", "cjs"]` 让一次构建产出两种格式，兼容不同消费场景
- `external` 避免把 React 打进库（否则消费方会加载两份 React）
- `dts: true` 让 TypeScript 消费方能拿到类型提示


**预期**：
- `dist/index.js`（或 `index.mjs`）：ESM 格式
- `dist/index.cjs`：CJS 格式
- `dist/index.d.ts`：类型声明
- 产物里不应该包含 React 的源码（体积小）

---

## 3. rollup 对比方案（可选）

**我们需要改的文件**：`rollup.config.js`

**关键配置点**：
- `external: ["react", "react-dom"]`：与 tsup 保持一致
- `treeshake: true`：启用摇树（反例中是 `false`，需要改成 `true`）
- `output`：分别输出 `dist/index.cjs`（CJS）和 `dist/index.mjs`（ESM）
- `plugins`：
  - `@rollup/plugin-node-resolve`：解析 node_modules
  - `@rollup/plugin-commonjs`：把 CJS 转成 ESM（rollup 只认 ESM）
  - `@rollup/plugin-typescript`：处理 TypeScript

**为什么用 rollup 对比**：
- tsup 虽然快，但 rollup 让你更清楚"库构建的每个环节"（external 怎么声明、类型怎么生成、多格式怎么输出）
- 开源库通常用 rollup 以获得更细粒度的控制（比如 `preserveModules` 保持目录结构，利于按需加载）

**验收**：
```bash
pnpm -C cases/06-ts-lib run build:rollup
ls cases/06-ts-lib/dist
```
**预期**：和 tsup 类似，产出 ESM/CJS/d.ts。

---

## 4. 验证（类型 + 摇树）

### 4.1 验证类型提示

**操作**：
- 用 IDE 打开 `consumer.example.ts`
- 输入 `add(` 后看是否有参数提示（`a: number, b: number`）
- 悬停在 `Button` 上看是否能跳转到类型定义

**预期**：
- IDE 能正确提示 `add` 的类型签名
- `Button` 能跳转到 `.d.ts` 或源码

### 4.2 验证 Tree Shaking

**操作**：
- 查看构建产物 `dist/index.js` 或 `dist/index.mjs`
- 搜索 `heavyUnused` 字符串

**预期**：
- 如果 Tree Shaking 生效：**找不到 `heavyUnused`**（它没被 `consumer.example.ts` 用到，被摇掉了）
- 如果没生效：产物里会有 `heavyUnused` 的实现（说明配置有问题，回头检查 `treeshake: true` 和 `format: "esm"` 是否正确）

### 4.3 验证 external 生效

**操作**：
- 查看构建产物大小（`ls -lh dist/`）
- 或者直接打开产物搜索 `react` 的源码关键字（如 `useState` 的实现）

**预期**：
- 产物体积小（几 KB 到几十 KB，而不是几百 KB）
- 产物里**没有** React 的源码实现（只有 `import React from "react"` 这类引用）

---

## 补充：配置 package.json 的入口字段

虽然 tasks.md 里没有单独列这一步，但它是"库能被正确消费"的关键。

**你需要在 `package.json` 里添加**：
```json
{
  "main": "./dist/index.cjs",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.mjs",
      "require": "./dist/index.cjs"
    }
  }
}
```

**为什么要这些字段**：
- `main`：老工具链（CJS 为主）的默认入口
- `module`：老版本 webpack/rollup 识别 ESM 入口的方式
- `types`：告诉 TypeScript 类型声明文件在哪
- `exports`：现代推荐写法，明确告诉工具链"import 走哪个文件、require 走哪个文件"
- **⚠️ `exports` 里的 `types` 必须放在最前面**（条件按顺序匹配，放后面会被 import/require 先命中）

---

## 完整配置参考（可直接复制）

### `tsup.config.ts`（推荐方案）
```ts
import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: true,
  sourcemap: true,
  clean: true,
  treeshake: true,
  minify: false,
  external: ["react", "react-dom"]
});
```

### `rollup.config.js`（对比方案）
```js
import path from "path";
import commonjs from "@rollup/plugin-commonjs";
import nodeResolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";

export default {
  input: path.resolve("src/index.ts"),
  output: [
    { file: "dist/index.cjs", format: "cjs", sourcemap: true },
    { file: "dist/index.mjs", format: "esm", sourcemap: true }
  ],
  plugins: [
    nodeResolve({ extensions: [".js", ".ts", ".tsx"] }),
    commonjs(),
    typescript({ tsconfig: "./tsconfig.json" })
  ],
  treeshake: true,
  external: ["react", "react-dom"]
};
```

### `package.json`（关键字段）
```json
{
  "name": "@build-gym/06-lib-bundle",
  "version": "0.0.0",
  "main": "./dist/index.cjs",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.mjs",
      "require": "./dist/index.cjs"
    }
  }
}
```
> 注意：`exports` 里的 `"types"` 必须放在最前面，否则会被 `import/require` 先命中，导致 TypeScript 拿不到类型声明。
