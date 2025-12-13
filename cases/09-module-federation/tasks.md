# 09 任务：模块联邦（Module Federation）实验（webpack + Rspack）

## 背景
你要把一个“远程模块”（Remote）按独立应用发布，而 Host 应用在运行时加载它。你还需要处理 shared 依赖、版本治理、远程不可用的降级策略。

## 当前状态
- 已提供最小的 Host/Remote 示例代码与配置骨架（webpack + Rspack 两条）。
- 你需要补齐依赖安装与配置细节，并完成验收项。

## 任务清单
### 1. 安装依赖
依赖安装命令请看 `learning.md`（本文件不提供答案命令）。

### 2. 用 webpack 跑通 Host + Remote（开发/生产）
- 生产：先 build，再分别 serve host/remote（两个端口）。
- 开发：可先用 `dev:webpack`（简化版），或自己使用 dev server（加分项）。

### 3. 用 Rspack 跑通 Host + Remote（对照）
要求行为与 webpack 一致：Host 能加载 Remote 暴露的模块。

### 4. shared 依赖治理（核心）
确保 shared 依赖只加载一份（以 `react`/`react-dom` 为例，或在本关示例中用共享的“单例模块”模拟）。
验收：不出现“重复 React”导致的运行异常（真实项目常见报错：Invalid hook call）。

### 5. 远程不可用时的降级
当 remote 服务关闭或 remoteEntry 拉取失败时，Host 应显示降级 UI，而不是白屏。

## 验证（建议验收步骤）
- 先启动 remote，再启动 host
- 打开 host 页面，能看到来自 remote 的组件/字符串
- 关闭 remote，再刷新 host，能看到降级提示（而不是报错中断）
- webpack 与 rspack 两条路线都能完成以上流程


