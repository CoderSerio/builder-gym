# 04 学习：什么是 runtime？为什么会导致缓存抖动？

## 本关需要安装哪些依赖（以及为什么）
```bash
pnpm add -D webpack webpack-cli
pnpm add -D @rspack/cli @rspack/core
```

## 什么是 runtime
在 webpack/Rspack 这类 bundler 中，runtime 通常包含：
- 模块加载器（类似 `__webpack_require__`）
- chunk 映射表（哪个 chunk 对应哪个文件名/ID）
- 动态加载逻辑（懒加载时如何拉取 chunk）

这些代码不属于你的业务逻辑，但对运行时“把模块拼起来”很关键。

## 为什么 runtime 会导致 hash 抖动
当 runtime 和业务代码混在同一个 chunk 里：
- 业务模块变化 → chunk 内容变化
- runtime 也在同一个文件里 → 文件内容整体变化
最终表现为：你改了业务代码，runtime 文件也变了，缓存命中变差。

更糟的是：runtime 里可能包含 chunk ID、chunk 顺序等信息，导致微小变化也会扩大影响范围。

## runtimeChunk 的核心思路
把 runtime 单独抽出来：
- runtime 变动更少、更可控
- 业务变动只影响业务 chunk
- 结合 `[contenthash]` 才能真正做到“只变该变的文件”

## 本关验收关注点
- 你要能解释：runtime 是什么、为什么抽离有用
- 你要能验证：改业务代码后 runtime 的 hash 尽量不变


