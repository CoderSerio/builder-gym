# 05 学习：为什么迁移到 Rspack？怎么做“等价迁移”？

## 本关需要安装哪些依赖（以及为什么）
```bash
pnpm add -D @rspack/cli @rspack/core
pnpm add -D webpack webpack-cli
```

你需要同时保留 webpack（对照组）与 Rspack（目标组），才能看到迁移收益。

## 为什么迁移到 Rspack
常见动机：
- 更快的编译与增量构建（Rust + SWC 生态）
- 更好的开发体验（HMR、缓存策略）
- 降低大型项目的构建成本（CI、开发机）

## 什么叫“等价迁移”
等价迁移不是“配置逐行照抄”，而是：
- 入口、输出、资源处理结果一致
- 关键 loader/plugin 行为一致（例如 JSX/TS 转译、CSS 处理）
- 运行效果一致（页面能正常运行、HMR 可用）

## 常见迁移坑
- loader 名称不同（webpack loader vs Rspack 内置 loader）
- devtool 策略不同（默认值差异）
- 缓存目录与命中策略不同

## 为什么 cache/lazyCompilation 能提升体验
- filesystem cache：避免重复编译同样的模块
- lazyCompilation：首次启动只编译必要入口，减少冷启动工作量

## 本关验收关注点
- 迁移后功能不回退（页面能跑）
- 冷启动时间下降
- 单文件修改后 HMR/增量时间下降


