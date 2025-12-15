# 06 库构建现代化：TypeScript + ESM/CJS + Tree Shaking

本关聚焦"库构建"：同时输出 ESM/CJS/d.ts，externalize 外部依赖，确保可 Tree Shaking。

## 核心目标
- ✅ 一次构建产出 ESM + CJS 两种格式（兼容不同消费方）
- ✅ 产出 `.d.ts` 类型声明（让 TypeScript 项目能拿到类型提示）
- ✅ externalize React 等依赖（避免重复打包）
- ✅ Tree Shaking 生效（未使用导出不进入产物）

## 阅读顺序
- `docs/tasks.md`：任务与验收（不含答案）
- `docs/learning.md`：学习资料（含依赖安装命令、概念讲解、配置思路）
- `docs/solutions.md`：参考答案（逐步骤对齐 tasks，并附完整代码参考）
