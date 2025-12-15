# 07 学习：为什么 SWC/OXC 会更快？有哪些坑？

## 本关需要安装哪些依赖（以及为什么）
```bash
pnpm add -D @swc/cli @swc/core
pnpm add -D @rspack/cli @rspack/core
```
（OXC 是否安装取决于你选择的 oxc 工具/CLI，可按实际情况补充。）

## 先建立直觉：Babel vs SWC/OXC
- Babel：JS 实现，插件生态非常丰富，但编译开销较大
- SWC/OXC：Rust 实现，编译速度更快，适合大型项目与高频增量

## SWC 的关键配置点
- parser：要明确 typescript/tsx、jsx 等语法开关
- transform.react：runtime automatic、是否 refresh（开发）
- target：决定输出语法级别（影响兼容性）

## OXC 的定位（新人视角）
你可以把 OXC 理解为“更快的 JS/TS 工具链”，可能包含：
- 解析/转换
- lint/minify/bundle 等能力（取决于具体组件）

但要注意：不同版本/组件成熟度不同，**行为一致性比速度更重要**。

## 常见坑（务必提前知道）
- **polyfill**：SWC/OXC 负责“语法转换”，不等于自动注入 polyfill
- **JSX runtime**：automatic/classic 配错会导致运行时错误
- **目标环境**：target 配得太新，老浏览器会跑不起来

## 为什么 Rspack 能进一步放大收益
Rspack 与 SWC 同生态/同语言栈，loader 更轻，配合：
- filesystem cache
- lazyCompilation
能把“编译快”转化为“开发体验快”。


