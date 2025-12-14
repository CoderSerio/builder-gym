# 04 学习：什么是 runtime？为什么会导致缓存抖动？

## 本章节需要安装的依赖

除了 rspack 之外，都是之前几个章节的老熟人了：

```bash
pnpm add -D webpack webpack-cli babel-loader @babel/core @babel/preset-env style-loader css-loader

# 可选⬇️
pnpm add -D @rspack/cli @rspack/core
```

- rspack: 简单概括可以称之为 rust 重构版的 webpack5，但是性能比 webpack 优秀非常之多。后续章节会着重介绍。

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

更糟的是：runtime 里可能包含 chunkID、chunk顺序 等信息，导致微小变化也会扩大影响范围。

## runtimeChunk 的核心思路
思路和之前一样，把 runtime 单独抽出来：
- 通过设置 `optimization.runtimeChunk: "single"` 
- 同时结合 `[contenthash]` 才能真正做到“只变该变的文件”


> 本章节算是对之前章节的一个复习回顾 🦊, 想一下如何用之前所学到的知识完成这一切？
> 当然啦，也可以选择在 Rspack 上实现这一切



## 本章节验收关注点
- 要能解释：runtime 是什么、为什么抽离有用
- 要能验证：改业务代码后 runtime 的 hash 尽量不变


