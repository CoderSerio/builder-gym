import path from "path";

/**
 * 反例/待优化：未明确 treeshake 选项，CJS 处理缺失。
 * 按 README 尝试使用 ESM 输入、manualChunks/treeshake 配置。
 */
export default {
  input: path.resolve("src/index.js"),
  output: {
    file: "dist/rollup-bundle.js",
    format: "esm",
    sourcemap: false
  },
  treeshake: false,
  plugins: [
    // TODO: @rollup/plugin-node-resolve, commonjs, babel/swc 等
  ]
};


