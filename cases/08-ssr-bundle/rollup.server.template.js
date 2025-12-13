import commonjs from "@rollup/plugin-commonjs";
import nodeResolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";

/**
 * TODO：server 端 rollup 配置，external node_modules。
 */
export default {
  input: "src/server/index.ts",
  output: {
    file: "dist/server/server.js",
    format: "cjs",
    sourcemap: true
  },
  external: [
    // TODO: externalize react/react-dom/server 及其他 node_modules
  ],
  plugins: [nodeResolve({ preferBuiltins: true }), commonjs(), typescript()]
};


