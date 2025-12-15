import { defineConfig } from "tsup";

/**
 * tsup 配置示例（已完成，可作为参考）：
 * - 同时输出 ESM/CJS 两种格式
 * - 生成 .d.ts 类型声明
 * - externalize React 等依赖
 * - 启用 Tree Shaking
 */
export default defineConfig({
  entry: ["src/index.ts"], // 入口文件
  format: ["esm", "cjs"], // 同时输出 ESM 和 CJS
  dts: true, // 生成 .d.ts 类型声明
  sourcemap: true, // 生成 sourcemap
  clean: true, // 构建前清空 dist
  treeshake: true, // 启用 Tree Shaking
  minify: false, // 不压缩（保持可读性）
  external: ["react", "react-dom"], // 不把 React 打进产物
});
