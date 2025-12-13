# 05 任务：webpack → Rspack 迁移与性能优化

## 背景
一个使用 Babel+webpack 的老项目，构建慢、HMR 慢。你需要在保持功能的情况下迁移到 Rspack，压缩构建时间。

## 现象
- Babel pipeline 深、插件多，构建耗时长。
- `devtool: source-map` 使增量与 HMR 迟缓。
- 缓存未开启或未落盘。

## 任务清单
### 1. 安装依赖
依赖安装命令请看 `learning.md`（本文件不提供答案命令）。

### 2. 迁移配置：webpack → Rspack
将 `webpack.legacy.js` 的关键能力迁移到 Rspack（入口、loader、样式处理等）。

### 3. 开发体验优化
调整：
- devtool
- 持久化 cache
- lazyCompilation（按需编译）

### 4. 记录迁移前后数据
记录冷启动与 HMR 耗时（并更新 baseline.json/本关记录）。


