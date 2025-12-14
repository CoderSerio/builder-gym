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
  // TODO: 对比 treeshake: true 和 false 的产物，看看 sub 等没有被使用的函数是否被移除
  treeshake: true,
  plugins: [
    // TODO: 补全 resolve, commonjs, postcss 等
  ]
};


