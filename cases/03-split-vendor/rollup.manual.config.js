const path = require("path");
const resolve = require("@rollup/plugin-node-resolve").default;
const commonjs = require("@rollup/plugin-commonjs");
const postcss = require("rollup-plugin-postcss");

/**
 * Rollup 对照方案：
 * - 用 manualChunks 把 framework/libs 分组
 * - 用 postcss 处理 CSS import（本案例有 import "./styles.css"）
 */
module.exports = {
  input: path.resolve("src/index.js"),
  output: {
    dir: "dist/rollup",
    format: "esm",
    entryFileNames: "[name].[hash].js",
    chunkFileNames: "[name].[hash].js"
  },
  treeshake: true,
  manualChunks(id) {
    if (id.includes("node_modules")) {
      if (id.includes(`${path.sep}react${path.sep}`) || id.includes(`${path.sep}react-dom${path.sep}`)) {
        return "framework";
      }
      return "libs";
    }
    if (id.endsWith(`${path.sep}src${path.sep}app.js`)) return "app";
    return null;
  },
  plugins: [
    resolve({ browser: true }),
    commonjs(),
    postcss({ inject: true })
  ]
};


