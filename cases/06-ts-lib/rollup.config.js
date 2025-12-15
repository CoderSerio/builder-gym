const path = require("path");
const commonjs = require("@rollup/plugin-commonjs");
const { default: nodeResolve } = require("@rollup/plugin-node-resolve");
const typescript = require("@rollup/plugin-typescript");

/**
 * TODO: 配置 rollup 实现与 tsup 等价的库构建：
 * - external: ["react", "react-dom"]
 * - treeshake: true
 * - 输出 ESM/CJS 两种格式
 */
module.exports = {
  input: path.resolve(__dirname, "src/index.ts"),
  output: [
    { file: "dist/rollup/index.cjs", format: "cjs", sourcemap: true },
    { file: "dist/rollup/index.mjs", format: "esm", sourcemap: true }
  ],
  plugins: [
    nodeResolve({ extensions: [".js", ".ts", ".tsx"] }),
    commonjs(),
    // 关闭 declaration（类型声明交给 tsup，rollup 这边主要对比 external/treeshake）
    typescript({ tsconfig: "./tsconfig.json", declaration: false })
  ],
  treeshake: false, // TODO: 改成 true
  external: [] // TODO: 添加 ["react", "react-dom"]
};


