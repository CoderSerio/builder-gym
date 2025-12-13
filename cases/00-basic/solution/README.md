# Solution - 00 基础入门（参考答案与详解）

本关是真正的入门关，目的是让你认识 webpack 最核心的四个字段，能跑起来即可。

## 需要改的文件与具体位置

### 1. `package.json` - 修改构建命令

**改动**：
```json
{
  "scripts": {
    "build:dev": "webpack --mode development",
    "build": "webpack --mode production",
    "bench": "node ../../scripts/benchmark.js"
  }
}
```

**原因**：
- 占位脚本只是复制文件，不做真实打包。
- `--mode` 参数会传给 webpack 配置（通过 `argv.mode`），控制是否压缩、优化。

---

### 2. 安装依赖
```bash
pnpm add -D webpack webpack-cli swc-loader @swc/core style-loader css-loader
```

---

### 3. 理解 `webpack.config.js` 的四大字段（无需修改）

#### 3.1 mode
```js
mode: argv.mode || 'development'
```
- `development`：不压缩代码，便于调试，构建快。
- `production`：压缩代码，移除注释/空格，体积小，适合上线。
- `argv.mode` 来自 CLI 参数 `--mode`。

#### 3.2 entry
```js
entry: './src/index.js'
```
- 指定打包的起点文件，webpack 会从这里开始分析依赖。
- 可以是单个文件（字符串）或多个入口（对象）。

#### 3.3 output
```js
output: {
  path: path.resolve(__dirname, 'dist'),
  filename: 'bundle.js',
  clean: true
}
```
- `path`：产物输出目录（绝对路径）。
- `filename`：产物文件名（这里是固定的 `bundle.js`，后续关卡会学习动态 hash）。
- `clean: true`：每次构建前清理 dist 目录，避免旧文件残留。

#### 3.4 module.rules
```js
module: {
  rules: [
    {
      test: /\.js$/,
      exclude: /node_modules/,
      use: 'swc-loader'
    },
    {
      test: /\.css$/,
      use: ['style-loader', 'css-loader']
    }
  ]
}
```
- **test**：正则匹配文件类型。
- **exclude**：排除 node_modules，加快构建。
- **use**：指定 loader（处理器）：
  - `swc-loader`：编译 JS（比 babel 快 10-20 倍）
  - `style-loader` + `css-loader`：处理 CSS（css-loader 解析，style-loader 注入到 HTML）

---

## 为什么这样设计

### mode 的作用
- **development**：
  - 不压缩，代码可读
  - 包含详细错误信息
  - 构建快（适合开发调试）
- **production**：
  - 压缩、混淆，体积小
  - 移除 console.log（可选）
  - 代码优化（tree shaking、scope hoisting 等，后续关卡学习）

### entry/output 的关系
- entry 是"入口"，output 是"出口"
- webpack 从 entry 开始，递归找到所有依赖（import/require），打包成 output 指定的文件

### loader 的作用
- webpack 默认只认识 JS，其他文件（CSS/图片/TS）需要 loader 转换
- loader 从右到左执行（如 `['style-loader', 'css-loader']`：先 css-loader 解析，再 style-loader 注入）

---

## 完整参考配置

### `package.json`
```json
{
  "name": "case-00-basic",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "build:dev": "webpack --mode development",
    "build": "webpack --mode production",
    "bench": "node ../../scripts/benchmark.js"
  },
  "devDependencies": {
    "webpack": "^5.90.0",
    "webpack-cli": "^5.1.4",
    "swc-loader": "^0.2.6",
    "@swc/core": "^1.4.0",
    "style-loader": "^3.3.4",
    "css-loader": "^6.10.0"
  }
}
```

### `webpack.config.js`（已完整，无需修改）
```js
const path = require('path');

module.exports = (env, argv) => {
  return {
    mode: argv.mode || 'development',
    entry: './src/index.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'bundle.js',
      clean: true
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: 'swc-loader'
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader']
        }
      ]
    }
  };
};
```

---

## 验证步骤

### 1. 开发构建（不压缩）
```bash
pnpm run build:dev
cat dist/bundle.js  # 应该可以看到可读的代码
```

### 2. 生产构建（压缩）
```bash
pnpm run build
cat dist/bundle.js  # 代码被压缩成一行
```

### 3. 对比大小
```bash
pnpm run build:dev && du -h dist/bundle.js  # 例如 5KB
pnpm run build && du -h dist/bundle.js      # 例如 2KB
```

### 4. 跑基准
```bash
pnpm bench  # 查看构建时间和产物体积
```

---

## 常见问题

**Q: 为什么用 `(env, argv) => {}` 而不是直接导出对象？**  
A: 函数形式可以访问 CLI 参数（`argv.mode`），实现动态配置。直接导出对象无法获取命令行参数。

**Q: 为什么用 swc-loader 而不是 babel-loader？**  
A: swc 用 Rust 编写，编译速度快 10-20 倍，适合新项目。老项目可能仍用 babel（插件生态更丰富）。

**Q: style-loader 和 css-loader 有什么区别？**  
A: 
- `css-loader`：解析 CSS 文件（处理 @import、url()）
- `style-loader`：把 CSS 注入到 HTML 的 `<style>` 标签

**Q: 为什么 output.clean 要设为 true？**  
A: 避免旧文件残留在 dist 目录，导致 benchmark 统计不准确。

---

## 下一步
完成本关后，你已经掌握 webpack 基础。下一关 **01-cache** 会学习：
- 用 `[contenthash]` 实现文件名缓存
- 开发/生产环境的 devtool 差异
- 更精细的优化策略

