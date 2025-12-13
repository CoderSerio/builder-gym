# 07 任务：SWC / OXC / Rspack 新兴链路对比

## 背景
希望获得极致编译与增量速度，尝试用 SWC 或 OXC 取代 Babel 管线，并在 Rspack 中落地。

## 现象
- 旧链路构建慢、热更新迟缓。
- SWC/OXC 配置不当时可能缺少 polyfill 或 JSX 转换。

## 任务清单
### 1. 安装依赖
依赖安装命令请看 `learning.md`（本文件不提供答案命令）。

### 2. 用 SWC 完成 TS/React 编译
用 CLI 或 loader 完成编译，并记录耗时。

### 3. 用 OXC（若可用）做替换对比
对比耗时与产物（行为一致性优先）。

### 4. 在 Rspack 中落地
在 Rspack 配置中启用 SWC，并结合 cache/lazyCompilation 做开发体验优化。

### 5. 记录性能数据
记录并更新本关的基线数据或对比记录。


