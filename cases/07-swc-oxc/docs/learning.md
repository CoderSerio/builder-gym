# 07 学习：SWC/OXC 是什么？为什么比 Babel/TSC 更快？

## 本章节需要安装的依赖

```bash
# SWC 编译链路（推荐，生态成熟）
pnpm add -D @swc/cli @swc/core

# Rspack（搭配 SWC，放大性能收益）
pnpm add -D @rspack/cli @rspack/core

# 运行时依赖（本 demo 用到 React）
pnpm add react react-dom
```

> OXC 的安装与使用取决于你选择的工具/CLI（截至本章节编写时，OXC 生态仍在快速迭代），可按实际情况补充。本关重点放在 SWC（更成熟、可落地）。

## 上一世代的工具链：Babel 和 TSC

在理解 SWC/OXC 之前，先回顾一下"为什么需要编译器/转译器"：

### Babel（JS/JSX 转译器）
- **是什么**：用 JavaScript 实现的转译器，把新语法（ES6+/JSX）转成老浏览器能跑的 ES5
- **核心能力**：
  - 语法转换（箭头函数 → `function`、`class` → `function`）
  - JSX 转换（`<div>` → `React.createElement`）
  - Polyfill 注入（通过 `@babel/preset-env` + `core-js`）
- **优点**：
  - 插件生态极其丰富（几乎所有新语法都有对应 plugin）
  - 配置灵活（可以精细控制每个转换规则）
  - 社区成熟（大量业务在用，问题都踩过一遍）
- **缺点**：
  - **慢**：纯 JS 实现，大型项目编译耗时长（尤其是插件链深时）
  - **增量/热更新迟缓**：每次改动都要跑一遍完整的 Babel 管线

### TSC（TypeScript Compiler）
- **是什么**：TypeScript 官方编译器，把 `.ts` 编译成 `.js`，并生成 `.d.ts`
- **核心能力**：
  - TypeScript 语法转译
  - 类型检查
  - 生成类型声明文件
- **优点**：
  - 官方工具（和 TS 语法同步更新）
  - 类型检查精准
- **缺点**：
  - **慢**：类型检查 + 转译都在一个流程里，大项目编译耗时长
  - **不打包**：只做转译（一个 `.ts` → 一个 `.js`），不做 bundling/Tree Shaking
  - **不处理 polyfill**：只转语法，不注入 polyfill

### SWC 
**SWC**（Speedy Web Compiler）是一个用 **Rust** 实现的 JavaScript/TypeScript 编译器，目标是**替代 Babel**。

**核心定位**：
- 和 Babel 做同样的事情（语法转换、JSX 转换）
- 但编译速度快 10-100 倍（得益于 Rust 的性能）

**核心能力**：
1. **语法转换**：新语法 → 老语法（ES6+ → ES5/ES2015/...）
2. **JSX 转换**：`<div>` → `React.createElement` 或 `_jsx`（automatic runtime）
3. **TypeScript 支持**：`.ts/.tsx` 转成 `.js`（但**不做类型检查**，只做转译）
4. **Minify**：代码压缩（可选，通过 `swc-minify`）

### 为什么 SWC 比 Babel 快那么多
- **Rust vs JavaScript**：Rust 编译成原生代码，没有 JS 引擎的运行时开销
- **并行解析**：Rust 的并发模型让多文件编译可以并行处理
- **更少的插件链路**：SWC 把常用转换内置，不需要像 Babel 那样"一个转换一个插件"

### SWC 的典型使用场景
1. **CLI 直接编译**：`swc src -d dist`（类似 `tsc`，把 `.ts` 转成 `.js`）
2. **作为 loader**：在 webpack/Rspack 里用 `swc-loader` 替代 `babel-loader`
3. **作为库打包器**：有些工具（如 `@swc/pack`，不过不如 tsup/rollup 成熟）直接基于 SWC

### SWC 不做什么（重要）
- **不做类型检查**：SWC 只转译 TS 语法，不检查类型错误（你需要单独跑 `tsc --noEmit` 或在 IDE 里检查）
- **不自动注入 polyfill**：SWC 只转语法（`const` → `var`），不会像 Babel + `@babel/preset-env` 那样自动根据目标环境注入 `Promise` polyfill

---

## OXC：什么是它？和 SWC 有什么不同？

### OXC 是什么
**OXC**（The Oxidation Compiler）也是一个用 **Rust** 实现的 JavaScript 工具链，但它的**野心更大**：

**核心定位**：
- 不只是"替代 Babel"，而是想做"**整个 JS 工具链的 Rust 重写**"
- 目标包含：Parser、Transformer、Linter、Minifier、Bundler

**当前状态（截至本关编写时）**：
- **Parser/Transformer**：相对成熟，可以做 TS/JSX 转译
- **Linter**（oxlint）：已可用，号称比 ESLint 快 50-100 倍
- **Bundler**（oxc rolldown）：在开发中，目标是"Rollup 的 Rust 实现"

### OXC vs SWC
| 维度 | SWC | OXC |
|------|-----|-----|
| **成熟度** | 生产可用（Next.js、Vercel 等在用） | 部分能力可用（Parser/Linter 稳定，Bundler 在开发） |
| **定位** | 专注编译/转译（替代 Babel） | 整个工具链（编译+lint+bundle+minify） |
| **生态集成** | webpack/Rspack/Turbopack 都支持 | 部分工具在集成（如 Rspack 可能未来原生支持 OXC） |
| **配置复杂度** | 和 Babel 类似（熟悉后容易上手） | 仍在迭代，API 可能变化 |

**一句话总结**：
- **SWC**：现在就能用，替代 Babel，稳定可靠
- **OXC**：更激进的未来方案，如果你愿意尝鲜/贡献社区可以试试

---

## 上一世代 vs 新世代：完整对比表

| 工具 | 底层语言 | 核心能力 | 速度 | 类型检查 | Polyfill | 适用场景 |
|------|----------|----------|------|----------|----------|----------|
| **Babel** | JavaScript | 语法转换+JSX | 慢（基准） | ❌ | ✅（配合 preset-env） | 需要极致配置灵活性的项目 |
| **TSC** | TypeScript | TS 转译+类型检查 | 慢 | ✅ | ❌ | 需要精准类型检查的场景 |
| **SWC** | Rust | 语法转换+JSX+TS | 快 10-100x | ❌ | ❌（需手动配） | 大型项目、追求冷启动/HMR 速度 |
| **OXC** | Rust | 转译+Lint+Minify+Bundle（部分） | 快 50-100x | ❌ | ❌ | 愿意尝鲜、参与开源的团队 |

**关键takeaway**：
- Babel/TSC：**灵活、成熟、慢**
- SWC/OXC：**快、行为对齐（大部分场景）、但配置/生态不如 Babel 丰富**

---

## SWC 的核心配置（本章节重点）

本关的 `swc.config.json` 示例：

```json
{
  "jsc": {
    "parser": {
      "syntax": "typescript",
      "tsx": true
    },
    "transform": {
      "react": {
        "runtime": "automatic"
      }
    },
    "target": "es2019"
  },
  "module": {
    "type": "es6"
  },
  "sourceMaps": true
}
```

### 关键字段解释

#### `jsc.parser`
- **作用**：告诉 SWC 源码用的是什么语法
- **常见值**：
  - `"syntax": "ecmascript"`：纯 JS（不含 TS 类型注解）
  - `"syntax": "typescript"`：TS 语法（含类型注解）
  - `"tsx": true`：支持 JSX（React）
  - `"decorators": true`：支持装饰器（实验性语法）

#### `jsc.transform.react`
- **作用**：控制 JSX 怎么转换
- **关键选项**：
  - `"runtime": "automatic"`：React 17+ 自动 runtime（不需要 `import React`）
  - `"runtime": "classic"`：经典模式（需要手动 `import React from "react"`）
  - `"refresh": true`：启用 React Refresh（开发模式热更新，生产关掉）

#### `jsc.target`
- **作用**：指定输出的 JS 语法级别
- **常见值**：`"es5"` / `"es2015"` / `"es2019"` / `"es2020"`
- **影响**：和 TSC 的 `target` 类似，越低兼容性越好，但产物越大

#### `module.type`
- **作用**：输出的模块格式
- **常见值**：
  - `"es6"` 或 `"esnext"`：输出 ESM（`import/export`）
  - `"commonjs"`：输出 CJS（`require/exports`）
  - `"umd"`：通用模块（浏览器/Node 都能用）

### SWC CLI 的典型用法
```bash
# 把 src/ 下的所有文件编译到 dist/
swc src -d dist --config-file swc.config.json

# 监听模式（改动自动重新编译）
swc src -d dist --watch
```

---

## OXC 的配置与使用（尝鲜）

OXC 目前主要通过 CLI 或 Rust API 使用，配置文件格式可能随版本变化。本关的 `oxc.config.json` 示例：

```json
{
  "target": "es2020",
  "jsx": "automatic",
  "modules": "esnext"
}
```

**注意**：
- OXC 的 CLI/配置 API 仍在快速迭代（可能和你看到的文档不完全一致）
- **建议策略**：先用 SWC 跑通，再尝试 OXC 对比（避免因工具不稳定影响学习进度）

---

## 在 Rspack 中落地 SWC（本章节核心实践）

Rspack 内置了 `builtin:swc-loader`，让你不需要手动装 `swc-loader`，直接用：

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        exclude: /node_modules/,
        loader: "builtin:swc-loader",
        options: {
          jsc: {
            parser: { syntax: "typescript", tsx: true },
            target: "es2019",
            transform: { react: { runtime: "automatic" } }
          }
        }
      }
    ]
  }
};
```

### 为什么在 Rspack 里用 SWC 收益更大
- **Rspack 本身就是 Rust 写的**：和 SWC 同语言栈，调用开销更小
- **配合 filesystem cache**：编译结果缓存到磁盘，二次启动更快
- **配合 lazyCompilation**：按需编译，减少首次启动工作量
- 三者叠加 → **冷启动从几分钟降到几秒，热更新从秒级降到毫秒级**

---

## 常见坑与注意事项（务必提前知道）

### 1) SWC 不做类型检查
**现象**：
- 你写了明显的类型错误（如 `const x: string = 123`），`swc` 编译不会报错
- 产物能正常生成，但运行时可能炸

**解决**：
- 在 CI 或本地额外跑 `tsc --noEmit`（只做类型检查，不生成文件）
- 或在 IDE 里开启 TypeScript 类型检查

### 2) SWC 不自动注入 polyfill
**现象**：
- 你用了 `Promise`、`Array.from` 等 ES6+ API
- `swc` 会把 `const` 转成 `var`（语法层面），但不会注入 `Promise` 的 polyfill
- 老浏览器运行时报错：`Promise is not defined`

**解决**：
- 手动在入口 `import "core-js/stable"`（或按需引入）
- 或在 HTML 里加 polyfill CDN：`<script src="https://cdn.jsdelivr.net/npm/core-js-bundle/minified.js"></script>`

### 3) JSX runtime 配错会炸
**现象**：
- 你用了 React 17+，但 SWC 配成 `runtime: "classic"`
- 运行时报错：`React is not defined`（因为你没手动 `import React`）

**解决**：
- React 17+ 统一用 `runtime: "automatic"`
- React 16 及以下用 `runtime: "classic"`（并确保每个文件都 `import React`）

### 4) target 配太新，老浏览器跑不起来
**现象**：
- `target: "es2020"`，产物里有 `?.`（可选链）
- IE 11 / 老版 Safari 不认这个语法，直接报 SyntaxError

**解决**：
- 根据你的目标浏览器设置 `target`（需要兼容 IE 就用 `es5`，只管现代浏览器可以用 `es2020`）

### 5) OXC 工具链不稳定
**现象**：
- 按文档配置后跑不起来 / CLI 参数变了 / 产物行为不一致

**解决**：
- 优先用 SWC（生产可用）
- OXC 目前更适合"尝鲜/贡献社区"，不建议直接上生产

---

## SWC vs Babel：迁移检查清单

如果你要把现有 Babel 配置迁移到 SWC，检查这些点：

| Babel 配置 | SWC 等价配置 | 注意事项 |
|-----------|-------------|----------|
| `@babel/preset-env` | `jsc.target` | SWC 不自动 polyfill，需手动加 |
| `@babel/preset-react` | `jsc.transform.react` | 注意 runtime automatic/classic |
| `@babel/preset-typescript` | `jsc.parser.syntax: "typescript"` | SWC 不做类型检查 |
| `babel-plugin-xxx`（自定义插件） | 可能没等价实现 | 检查 SWC 是否内置或有替代方案 |

---

## 为什么在本章节同时提 SWC/OXC/Rspack

这三者是"同一代技术栈"，组合使用收益更大：

- **SWC**：编译链路（把 TS/JSX 转成 JS）
- **Rspack**：打包工具（用 SWC 做编译，用 Rust 做打包）
- **OXC**：未来可能的"全家桶"（编译+lint+bundle 都在一个工具里）

本章节的练习思路：
1. 先用 SWC CLI 跑通（感受编译速度）
2. 再把 SWC 集成到 Rspack（感受"编译快 + 打包快"的叠加收益）
3. 有余力可以试试 OXC（了解未来方向）

---

## 本章节验收关注点
- 能用 SWC 成功编译 TS/JSX（产物能跑）
- 冷启动/热更新速度显著提升（对比 Babel 基准）
- 理解 SWC 的局限性（不做类型检查、不自动 polyfill）
- 能在 Rspack 里正确配置 `builtin:swc-loader`
- 了解 OXC 的定位与适用场景
