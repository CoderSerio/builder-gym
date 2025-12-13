# 01 基础入门：最小化打包

## 背景故事
你接手一个零配置的小项目，需要让它产出可上线的 JS/CSS/静态资源，并了解 webpack 的最基本入口/输出/调试配置。

## 现象
- 构建脚本缺失，dist 目录为空。
- 没有 devtool，调试困难。
- babel-loader 过慢，等待体验差。

## 知识点
- entry/output 与 mode 的作用。
- loader 基础：`swc-loader` vs `babel-loader` 性能差异。
- devtool 选择：`eval-cheap-module-source-map` 等。

## 诊断提示
- 对比 swc 与 babel 构建时间。
- 检查产物路径、文件名是否合理（contenthash?）。

## 任务
1. 完善 `webpack.config.js`：设置入口、输出、模式、devtool。
2. 切换到 `swc-loader`（或保持 babel 作为对比）。
3. 生成基础样式/资源，确保能成功打包到 dist。

## 验证步骤
```bash
pnpm install         # 安装所需 loader/plugin
pnpm run build       # 运行你的 webpack 构建
pnpm bench           # 查看耗时与体积（基线仅占位）
```

## 扩展阅读
- webpack 官方入门文档
- SWC loader 配置指南


