# 00 任务：认识 webpack 核心字段（mode/entry/output/module）

## 背景
你是一个刚接触构建工具的新人，需要把一个简单的 JS + CSS 项目“打包”成浏览器可以直接使用的产物。

## 当前状态
- `package.json` 的 `build` 命令调用占位脚本，没有真实打包。
- `webpack.config.js` 已有框架，但 build 命令未接入。
- 缺少 webpack 相关依赖。

## 任务清单
### 1. 安装依赖
本关依赖安装命令请看 `learning.md`（本文件不提供答案命令）。

### 2. 修改 `package.json` 的 build 命令
将占位脚本替换为真实 webpack 构建，并且提供两个脚本：
- `build:dev`（development）
- `build`（production）

### 3. 理解 `webpack.config.js` 的四大字段
阅读并能解释这四个字段各自的作用：
- `mode`
- `entry`
- `output`
- `module.rules`

### 4. 验证
你需要能完成以下验收：
- `pnpm run build:dev` 与 `pnpm run build` 都能成功产出 `dist/bundle.js`
- 对比 `dist/bundle.js`：production 产物应明显更小（被压缩）


