# Solution - 06 库构建（具体改法与原因）

## 需要改什么
1) `tsup.config.ts`
- `entry: ["src/index.ts"]`
- `format: ["esm", "cjs"]`
- `dts: true` 生成声明。
- `treeshake: true`, `minify: false`（保读性；可视需要开启）。
- `external: ["react", "react-dom"]` 避免把外部依赖打进产物。
- `sourcemap: true`, `clean: true`

2) `rollup.config.js`
- `external: ["react", "react-dom"]`
- `treeshake: true`
- `plugins`: `nodeResolve({ extensions: [".js", ".ts", ".tsx"] })`, `commonjs()`, `typescript(...)`
- 输出：`dist/index.cjs` (cjs), `dist/index.mjs` (esm)，需要时可加 `preserveModules` 保持模块结构以利摇树。

3) `package.json`
- 添加 `"exports"`:
  ```json
  {
    ".": {
      "import": "./dist/index.mjs",
      "require": "./dist/index.cjs",
      "types": "./dist/index.d.ts"
    }
  }
  ```
- 声明 `"types": "./dist/index.d.ts"`, `"module": "./dist/index.mjs"`, `"main": "./dist/index.cjs"`.

4) 验证
- `pnpm run build:tsup`（需自行在 scripts 添加）或 rollup 版本。
- 在 `consumer.example.ts` 中仅导入 `add`，构建后检查未使用的 `heavyUnused` 是否被摇掉；IDE 能提供类型。

## 为什么这样改
- ESM+CJS+d.ts 兼容现代 tree-shaking 与旧环境，同时提供类型体验。
- external React 避免重复打包 runtime，保持库体积小、可共享依赖。
- exports 正确声明入口，工具链与 IDE 才能选对格式与类型。
