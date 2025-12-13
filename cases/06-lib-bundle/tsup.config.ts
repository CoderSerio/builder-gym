import { defineConfig } from "tsup";

/**
 * TODO：完善 tsup 构建，输出 esm/cjs/dts，移除多余 runtime。
 */
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


