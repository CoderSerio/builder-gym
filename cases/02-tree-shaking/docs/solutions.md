# Solution - 02 Tree Shaking（具体改法与原因）

## 改动

### 1. `package.json` - 声明 sideEffects

**改动**：

```json
{
  "name": "case-02-tree-shaking",
  // ... 其他配置
  "sideEffects": ["*.css"],
}
```

**原因**：告诉构建工具哪些文件有副作用（如 CSS、polyfill）不能删除，其他未声明的文件可以安全摇树。

---

### 2. `src/utils/legacy.cjs` - 改为 ESM

**改动（两种办法）**：

1. 改文件名为 `.js` 并使用 ESM 语法，即 `module.exports = { ... }` 改为 `export const ...`
2. 或在 webpack/rollup 中用 commonjs 插件处理

**原因**：CJS 的动态特性（`require`）会阻断静态分析，导致 Tree Shaking 失效。

---

### 3. `webpack.config.js` - 启用优化选项
**改动**：
```js
module.exports = {
  mode: 'production',
  // ...
  optimization: {
    usedExports: true,         // 标记未使用的导出
    sideEffects: true,         // 根据 package.json sideEffects 删除
    concatenateModules: true   // 模块合并（Scope Hoisting）
  },
  output: {
    filename: '[name].[contenthash].js',
    // ...
  }
}
```

**原因**：这三个选项组合能最大化 Tree Shaking 效果，contenthash 便于对比优化前后体积。

---

### 4. `rollup.config.js` - 启用 treeshake 与插件

**改动**：

```js
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import postcss from 'rollup-plugin-postcss';

export default {
  // ...
  plugins: [
    resolve(),    // 解析 node_modules
    commonjs(),   // 转换 CJS 为 ESM（也可以选择手动改 legacy.cjs 为 esm js，这样就不需要这个插件）
    postcss({ inject: true }) // 让 rollup 能处理 import "./styles.css"
  ],
  treeshake: true,  // 默认开启，显式声明更清晰
  output: {
    format: 'esm',
    dir: 'dist'
  }
}
```

**原因**：rollup 天生支持 Tree Shaking，但需要 commonjs 插件处理旧依赖。

---

## 为什么这样改

- **sideEffects 声明**：让构建器知道哪些文件可以安全删除，避免误删有副作用的代码（如样式、polyfill）。
- **统一 ESM**：静态的 `import/export` 可以在编译时分析依赖关系，`require` 的动态特性会破坏这个分析。
- **webpack 优化选项**：
  - `usedExports`：标记每个模块的哪些导出被使用
  - `sideEffects`：根据 package.json 配置删除无副作用的未使用模块
  - `concatenateModules`：把多个模块合并到一个闭包，减少包裹开销
- **rollup 插件**：虽然 rollup 默认 treeshake，但需要插件处理 node_modules 和 CJS 依赖。

---

## 完整参考配置

### `package.json`
```json
{
  "name": "case-02-tree-shaking",
  "sideEffects": ["*.css"],
  "scripts": {
    "build:webpack": "webpack --mode production",
    "build:rollup": "rollup -c",
    "build": "npm run build:webpack"
  },
  "devDependencies": {
    "webpack": "^5.x",
    "webpack-cli": "^5.x",
    "rollup": "^4.x",
    "@rollup/plugin-node-resolve": "^15.x",
    "@rollup/plugin-commonjs": "^25.x"
  }
}
```

### `webpack.config.js`
```js
const path = require('path');

module.exports = {
  mode: 'production',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash].js',
    clean: true
  },
  // 添加如下内容：
  optimization: {
    usedExports: true,
    sideEffects: true,
    concatenateModules: true
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
      // ... 其他 loader
    ]
  }
};
```

### `rollup.config.js`
```js
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default {
  input: 'src/index.js',
  output: {
    dir: 'dist',
    format: 'esm',
    entryFileNames: '[name].[hash].js'
  },
  plugins: [
    resolve(),
    commonjs()
  ],
  treeshake: true
};
```

### `src/utils/legacy.cjs` → 改为 ESM
**改前**：
```js
module.exports = {
  legacyHelper: function() { /* ... */ }
};
```
**改后**：
```js
export const legacyHelper = function() { /* ... */ };
```
