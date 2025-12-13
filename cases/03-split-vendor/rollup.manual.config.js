import path from "path";

/**
 * TODO: 使用 manualChunks 拆分 framework/lib/commons。
 */
export default {
  input: path.resolve("src/index.js"),
  output: {
    dir: "dist",
    format: "esm",
    entryFileNames: "[name].[hash].js",
    chunkFileNames: "[name].[hash].js"
  },
  treeshake: true,
  manualChunks(id) {
    // TODO: 根据路径匹配拆分
    return null;
  },
  plugins: [
    // TODO: node-resolve/commonjs/swc
  ]
};


