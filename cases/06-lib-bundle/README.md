# 06 库构建现代化：rollup/tsup/SWC

## 背景故事
一个内部 UI 组件库仅输出 CJS，缺少 d.ts，含冗余运行时代码，无法被 Tree Shaking，IDE 也没有类型提示。

## 现象
- 产物夹带大量 bundler runtime。
- 只有 CJS，缺少 ESM。
- 没有 `.d.ts`，类型缺失。

## 知识点
- rollup/tsup 构建库的差异与配置。
- `dts: true` 生成类型声明。
- `treeshake: true` 与外部化依赖。

## 诊断提示
- 检查产物是否存在重复 runtime。
- 使用 `npm pack` 查看包内容与类型文件。
- 在示例 consumer 中验证摇树与类型提示。

## 任务
1. 使用 tsup 输出 ESM+CJS+d.ts，避免额外 runtime。
2. rollup 方案：external + manualChunks（如需），确保摇树。
3. 验证通过：在 `consumer.example.ts` 中能获得类型与摇树效果。

## 验证步骤
```bash
pnpm install
pnpm run build:tsup   # 需要你补充实际脚本
pnpm bench
```
观察 dist 体积与类型输出。

## 扩展阅读
- tsup 配置选项
- rollup external/treeshake
- package.exports 与 module/types 配置

