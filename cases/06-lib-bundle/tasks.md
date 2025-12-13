# 06 任务：库构建现代化（ESM/CJS/d.ts）

## 背景
内部 UI 组件库仅输出 CJS，缺少 d.ts，含冗余运行时代码，无法被 Tree Shaking，IDE 也没有类型提示。

## 现象
- 产物夹带大量 bundler runtime。
- 只有 CJS，缺少 ESM。
- 没有 `.d.ts`，类型缺失。

## 任务清单
### 1. 安装依赖
依赖安装命令请看 `learning.md`（本文件不提供答案命令）。

### 2. 使用 tsup 输出 ESM + CJS + d.ts
完成一次构建输出多格式与类型声明。

### 3. rollup 对比方案
配置 external（如 react/react-dom），并确保 treeshake 生效。

### 4. 验证（类型 + 摇树）
在 `consumer.example.ts` 中验证：
- IDE 能拿到类型提示
- 未使用导出尽量不进入最终产物（或体积明显下降）


