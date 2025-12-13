# Solution - 01 基础入门（参考答案与详解）

第一章是用于教学引导，目的是引导读者熟悉本教程的交互方式。

## 需要改的文件与具体位置

### 1. `package.json` - 修改构建命令

**改动**：

```json
"build:dev": "webpack --mode development",
"build": "webpack --mode production"
```

**原因**：占位脚本只是复制文件，不做打包/优化；真实构建需要调用 webpack。

---

### 2. `webpack.config.js` - 完善生产配置

**改动**：

#### 2.1 output.filename

这里有两种改法(建议使用第2种)：

1. 添加环境变量（需要在根目录下加上.env文件）
    
```js
filename: process.env.NODE_ENV === 'production' 
  ? "bundle.[contenthash].js" 
  : "bundle.js"
```
2. 或者直接添加参数 `--mode` （需要修改package.json的脚本命令）
 
```js
module.exports = (env, argv) => ({
  output: {
    filename: argv.mode === 'production' 
    ? 'bundle.[contenthash].js' 
    : 'bundle.js',
  }
})
```
**原因**：
- `[contenthash]` 是 webpack 内置的**模板占位符**（template string），构建时会被替换成实际的 hash 值（如 `bundle.a3f2b1c9.js`）。
- hash 值根据文件内容计算，内容变化 → hash 变化 → 文件名变化 → 浏览器认为是新文件重新下载；内容不变 → hash 不变 → 浏览器直接用缓存。
- **不能自定义内容！ 比如写成`[my_hash]`是不会生效的**，只能用 webpack 支持的占位符：
  - `[contenthash]`：根据文件内容生成（推荐，最精确）
  - `[chunkhash]`：根据 chunk 内容生成
  - `[hash]`：根据整个构建生成（不推荐，所有文件 hash 一起变）
  - `[name]`：chunk 名称
  - `[id]`：chunk ID
- 可指定长度：`[contenthash:8]` 只取前 8 位（如 `bundle.a3f2b1c9.js`）。


#### 2.2 devtool

**改动**（生产可关闭或改 source-map）

```js
devtool: argv.mode === 'production' 
? false 
: 'eval-cheap-module-source-map'
```

**原因**：生产环境通常不需要 source map（减小体积、保护源码）；开发环境用快速 source map 便于调试。

#### 2.3 mode

当前是硬编码为 `development`，需要改为与环境变量或者传入的参数一直。具体参考 `2.1 output.filename` 中提到的两种方法。

#### 2.4 修改 build 命令执行的脚本

在 `packages.json` 中添加（或者修改）build 相关命令：

```json
"build:dev": "webpack --mode development",
"build": "webpack --mode production"
```

### 3. 安装依赖
```bash
pnpm add -D webpack webpack-cli swc-loader @swc/core style-loader css-loader
```

---

### 4. 验证步骤
```bash
# 生产构建
pnpm run build
ls dist  # 应看到 bundle.[一串hash].js

# 修改 src/index.js 任意一行，重新构建
pnpm run build
ls dist  # hash 应该变了

# 跑 benchmark
pnpm bench  # 查看构建时间、产物体积、gzip 大小
```

---

## 完整参考配置（webpack.config.js）

```js
const path = require("path");

module.exports = (env, argv) => {
  // 或者用环境变量 process.env
  const isProd = argv.mode === 'production';
  
  return {
    entry: path.resolve(__dirname, "src/index.js"),
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: isProd ? "bundle.[contenthash].js" : "bundle.js",
      clean: true
    },
    devtool: isProd ? false : "eval-cheap-module-source-map",
    module: {
      rules: [
        {
          test: /\.(js|jsx|ts|tsx)$/,
          exclude: /node_modules/,
          use: {
            loader: "swc-loader",
            options: {
              jsc: {
                parser: { syntax: "ecmascript", jsx: true },
                target: "es2019",
                transform: { react: { runtime: "automatic" } }
              }
            }
          }
        },
        {
          test: /\.css$/,
          use: ["style-loader", "css-loader"]
        }
      ]
    }
  };
};
```

---

## 为什么这样改
- **contenthash**：浏览器能缓存不变的 bundle，只在代码变化时下载新文件，大幅减少重复流量。
- **swc-loader**：比 Babel 快 10-20 倍（Rust 实现），新人能直观感受到性能差异。
- **devtool 区分开发/生产**：开发要快速调试，生产要保护源码、减小体积。
- **接入真实 webpack**：替换占位脚本，才能体验打包优化、Tree Shaking、压缩等真实能力。
