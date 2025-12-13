# 05 旧项目迁移：webpack → Rspack

## 背景故事
一个使用 Babel+webpack 的老项目，构建慢、HMR 慢。需要在保持功能的情况下迁移到 Rspack，压缩构建时间。

## 现象
- Babel pipeline 深、插件多，构建耗时长。
- `devtool: source-map` 使增量与 HMR 迟缓。
- 缓存未开启或未落盘。

## 知识点
- Rspack 构建管线与 webpack 差异。
- `devtool` 取舍：`eval-cheap-module-source-map` 等。
- 持久化缓存：filesystem cache。
- Lazy Compilation / Incremental 编译。

## 诊断提示
- 比较 webpack 与 Rspack 的冷启动时间。
- 检查缓存目录是否被创建，命中率如何。
- 修改单文件，观察 HMR 耗时。

## 任务
1. 将 `webpack.legacy.js` 的配置迁移到 Rspack，对齐 loader/plugin。
2. 调整 devtool、cache、lazyCompilation 以优化开发体验。
3. 记录迁移前后冷启动与 HMR 耗时（更新 baseline.json）。

## 验证步骤
```bash
pnpm install
pnpm run build   # 替换为 Rspack 构建
pnpm bench
```
比较迁移前后的 time/size。

## 扩展阅读
- Rspack 与 webpack 配置对照
- Rspack cache/lazyCompilation 文档
- SWC 与 Babel 差异

