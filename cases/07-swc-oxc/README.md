# 07 新兴链路：SWC / OXC / Rspack

## 背景故事
希望获得极致编译与增量速度，尝试用 SWC 或 OXC 取代 Babel 管线，并在 Rspack 中落地。

## 现象
- 旧链路构建慢、热更新迟缓。
- SWC/OXC 配置不当时可能缺少 polyfill 或 JSX 转换。

## 知识点
- SWC 配置（jsc.parser/jsc.transform）与 JSX 支持。
- OXC 构建/转译能力与兼容性。
- Rspack 内置 swc-loader vs 独立 swc/oxc CLI。

## 诊断提示
- 对比 Babel vs SWC/OXC 冷启动与增量耗时。
- 检查产物是否符合目标浏览器/Node 版本。
- 确认 HMR 是否受益于更快的编译。

## 任务
1. 使用 SWC CLI/loader 完成 TS/React 编译，测量性能。
2. 尝试 OXC（若可用）替换 SWC/Babel，对比耗时与产物。
3. 在 Rspack 中应用 swc-loader，并启用 cache/lazyCompilation。
4. 记录性能数据，更新 baseline。

## 验证步骤
```bash
pnpm install
pnpm run build:swc   # 需自行补充脚本
pnpm bench
```

## 扩展阅读
- SWC 配置手册
- OXC 项目与 CLI
- Rspack 内置 SWC loader 说明

