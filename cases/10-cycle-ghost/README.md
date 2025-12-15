## 10 循环引用 + 幽灵依赖（依赖治理入门）

本章节模拟真实业务里经常遇到的两类问题：
- **幽灵依赖（Phantom Dependency）**：代码引用了依赖，但 `package.json` 没声明；在某些环境“看起来能跑”，换个环境（pnpm/CI/容器）就直接挂。
- **循环引用（Circular Dependency）**：模块之间相互 require/import，导致运行时拿到“半初始化”的 exports，引发 `undefined`/逻辑错乱。

## 阅读顺序
- `docs/tasks.md`：任务与验收（不含答案）
- `docs/learning.md`：学习资料（概念讲解 + 安装命令）
- `docs/solutions.md`：参考答案（严格对齐 tasks 步骤，并给完整参考代码）


