import path from "path";
import commonjs from "@rollup/plugin-commonjs";
import nodeResolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";

/**
 * TODO: 配置 rollup 实现与 tsup 等价的库构建：
 * - external: ["react", "react-dom"]
 * - treeshake: true
 * - 输出 ESM/CJS 两种格式
 */
export default {
  input: path.resolve("src/index.ts"),
  output: [
    { file: "dist/rollup/index.cjs", format: "cjs", sourcemap: true },
    { file: "dist/rollup/index.mjs", format: "esm", sourcemap: true }
  ],
  plugins: [
    nodeResolve({ extensions: [".js", ".ts", ".tsx"] }),
    commonjs(),
    typescript({ tsconfig: "./tsconfig.json" })
  ],
  treeshake: false, // TODO: 改成 true
  external: [] // TODO: 添加 ["react", "react-dom"]
};


