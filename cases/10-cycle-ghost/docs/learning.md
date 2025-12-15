# 10 学习：什么是幽灵依赖？什么是循环引用？

## 本章节需要安装哪些依赖（以及为什么）
先安装本关会用到的工具（推荐在仓库根目录执行，使用 filter 安装到本 package）：

```bash
pnpm add -D lodash
```

> 注意：本章节一开始“故意不装 lodash”，让你先复现幽灵依赖报错；完成任务时你才需要把它加进去。

## 幽灵依赖（Phantom Dependency）是什么
现象：代码里 `require("lodash")` 或 `import "lodash"` 能跑（或在某些机器能跑），但在另一些环境直接报：
- `Cannot find module 'lodash'`

原因：依赖在“某个地方”被装了（例如根目录、另一个包、或被 hoist 到公共 node_modules），但**当前这个 package 自己的 `package.json` 没声明它**。

为什么危险：
- 本地能跑 ≠ CI 能跑
- 机器能跑 ≠ 生产容器能跑
- 依赖关系不可追踪，升级/裁剪依赖会引发“幽灵爆炸”

为什么 pnpm 更容易暴露它：
- pnpm 默认更严格，包只能访问自己声明的依赖（能更早发现幽灵依赖）。

## 循环引用（Circular Dependency）是什么
现象：A require B，B 又 require A：
- 构建/运行不一定直接报错
- 更常见的是：某个导出值变成 `undefined`，或行为随机/时好时坏

原因：CommonJS 在循环依赖时会返回“正在初始化中的 module.exports”：
- 第一个被加载的模块还没执行完，exports 还没完全赋值
- 另一个模块在此时访问它，就拿到“半初始化”的结果

如何修：
- 提取共享模块 `shared.js`
- 让其中一方变成纯函数 + 上层注入依赖（依赖倒置）
- 最后才考虑“延迟 require”（它是在掩盖设计问题）


