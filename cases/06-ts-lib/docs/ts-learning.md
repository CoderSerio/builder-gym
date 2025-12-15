## tsconfig.json 常见配置详解（库构建场景）

本章节的 `tsconfig.json` 已经包含了库构建常用的配置，下面逐个解释：

> 当然了，tsup.config.ts 几乎是同理

### 基础字段（本章节已有）

#### `"jsx": "react-jsx"`
- **作用**：告诉 tsc 如何处理 JSX 语法
- **可选值**：
  - `"react"`：经典模式，需要手动 `import React from "react"`
  - `"react-jsx"`：自动模式（React 17+），不需要手动引入 React
  - `"preserve"`：保留 JSX 不转换（交给后续 bundler 处理）
- **本次选择**：`"react-jsx"`（自动模式，更简洁）

#### `"target": "ES2019"`
- **作用**：指定编译后的 JavaScript 语法级别
- **常见值**：`"ES5"` / `"ES2015"` / `"ES2019"` / `"ES2022"` / `"ESNext"`
- **影响**：
  - 越低（如 ES5）：兼容性越好，但产物越大（需要转换更多新语法）
  - 越高（如 ESNext）：产物越小，但老浏览器跑不起来
- **本次选择**：`"ES2019"`（兼顾兼容性与现代语法）

#### `"module": "ESNext"`
- **作用**：指定生成的模块系统
- **常见值**：
  - `"CommonJS"`：输出 CJS（`require/exports`）
  - `"ESNext"`：输出 ESM（`import/export`）
  - `"UMD"`：通用模块定义（浏览器/Node 都能用，但体积大）
- **本次选择**：`"ESNext"`（因为我们用 tsup/rollup 做 bundling，tsc 只负责类型检查）

#### `"declaration": true`
- **作用**：生成 `.d.ts` 类型声明文件
- **库构建必开**：否则消费方拿不到类型提示
- **配合字段**：
  - `"declarationDir": "./dist/types"`：指定类型文件输出目录（可选）
  - `"emitDeclarationOnly": true`：只生成类型文件，不生成 JS（如果你只用 tsc 做类型声明、用其他工具做 JS 打包时可开）

#### `"emitDeclarationOnly": false`
- **作用**：是否只生成类型文件（不生成 JS）
- **本次场景**：`false`（因为我们用 tsup/rollup 做 JS 打包，tsc 负责检查+生成类型）
- **何时用 `true`**：当你用 webpack/esbuild 做 JS 打包，但需要单独用 tsc 生成 `.d.ts` 时

#### `"moduleResolution": "Node"`
- **作用**：告诉 tsc 如何解析模块路径（也就是：当你写 `import { foo } from "my-lib"` 时，tsc 怎么找到 `my-lib` 对应的文件）

**常见值对比**：

##### `"Node"` 策略（经典模式）
按照 Node.js 的经典解析规则：
1. 先看 `my-lib` 的 `package.json` 的 `main` 字段
2. 如果没有 `main`，尝试 `index.js`
3. 在 `node_modules` 里逐级向上查找

**特点**：
- **不认 `exports` 字段**（这是 Node 策略的历史遗留）
- 兼容性最好（所有版本的 Node/工具链都认）
- 但对现代 `package.json` 的 `exports` 条件导出支持不完整

##### `"Bundler"` 策略（TS 4.7+ 新增）
更符合现代 bundler（webpack/Vite/Rspack）的行为：
1. **优先看 `exports` 字段**（支持条件导出）
2. 回退到 `module`（ESM 入口）
3. 再回退到 `main`（CJS 入口）

**特点**：
- 完整支持 `exports` 的条件导出（`import/require/types`）
- 更符合现代工具链的实际行为
- 但老版本 Node/工具链可能不认（TS 4.7 之前不支持）

**本次为什么选 `"Node"`**：
- 兼容性优先（确保在各种环境都能正常类型检查）
- 本次主要用 tsup/rollup 做打包，tsc 只负责类型检查，所以 `moduleResolution` 对产物影响不大
- 如果你的库只面向现代工具链（Vite/Rspack），可以改成 `"Bundler"` 获得更精确的 `exports` 支持

#### `"skipLibCheck": true`
- **作用**：跳过对 `node_modules` 里 `.d.ts` 的类型检查
- **好处**：加速编译（不检查三方库的类型错误）
- **风险**：如果三方库类型声明有问题，你可能发现不了
- **库构建推荐**：开启（加速 + 你无法控制三方库的类型质量）

#### `"esModuleInterop": true`
- **作用**：让 ESM 的 `import` 和 CJS 的 `require` 能更好地互操作
- **典型场景**：当你 `import React from "react"` 但 React 是 CJS 导出时，这个选项能让你少写一些 `* as` 的别扭语法
- **推荐**：开启（特别是混用 ESM/CJS 依赖时）

### 其他库构建常见配置（本章节未用但值得知道）

#### `"outDir": "./dist"`
- **作用**：指定 tsc 输出目录
- **何时用**：如果你用 `tsc` 直接编译（不用 tsup/rollup），这个字段必填

#### `"rootDir": "./src"`
- **作用**：指定源码根目录（影响输出的目录结构）
- **配合 `outDir` 使用**：保持输出目录结构和源码一致

#### `"strict": true`
- **作用**：启用所有严格类型检查（包括 `strictNullChecks`、`noImplicitAny` 等）
- **库构建推荐**：开启（保证类型质量，减少消费方遇到的类型问题）

#### `"lib": ["ES2019", "DOM"]`
- **作用**：指定编译时可用的内置类型库
- **常见值**：
  - `"ES2019"`：ES2019 的内置类型（Promise、Array.from 等）
  - `"DOM"`：浏览器 DOM 类型（document、window 等）
  - `"ESNext"`：最新标准库类型
- **何时配**：如果你的库只在 Node 环境用，可以不要 `"DOM"`

#### `"sourceMap": true`
- **作用**：生成 `.js.map` sourcemap 文件（方便调试）
- **库构建推荐**：开启（让消费方在 dev 时能断点到你的库源码）

## 本章节的 tsconfig.json 为什么这么配

本次的配置针对"库构建 + React 组件"场景优化：
- `jsx: "react-jsx"`：自动 JSX runtime（不需要手动 import React）
- `target: "ES2019"`：兼顾现代语法与老浏览器
- `module: "ESNext"`：输出 ESM（配合 bundler）
- `declaration: true`：必须生成类型声明
- `skipLibCheck: true`：加速编译
- `esModuleInterop: true`：兼容 CJS 依赖

如果你的库不用 React，可以去掉 `jsx` 字段；如果只在 Node 环境用，可以调整 `lib` 字段。
