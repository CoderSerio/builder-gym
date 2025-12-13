import path from "path";
import commonjs from "@rollup/plugin-commonjs";
import nodeResolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";

/**
 * 反例/待优化：可能未 external 依赖，runtime 冗余。
 * TODO: external React 等，开启 treeshake，优化输出格式。
 */
export default {
  input: path.resolve("src/index.ts"),
  output: [
    { file: "dist/index.cjs", format: "cjs", sourcemap: true },
    { file: "dist/index.mjs", format: "esm", sourcemap: true }
  ],
  plugins: [
    nodeResolve({ extensions: [".js", ".ts", ".tsx"] }),
    commonjs(),
    typescript({ tsconfig: "./tsconfig.json" })
  ],
  treeshake: false,
  external: [] // TODO: externalize react/react-dom
};


