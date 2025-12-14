# 01 学习：为什么需要 contenthash？为什么要区分开发/生产？

## 本章节会解决什么问题
我们上线了一个网站，用户第一次访问会下载 `bundle.js`。
但是，如果文件一直叫做 `bundle.js`这种固定的名字，那就完全无法体现它是否有更新。
那么，为了保证用户总是能访问到最新的内容，通常只能每一次都下载这个 `bundle.js`.

因此, 我们需要找一个办法显示文件内容是否发生了变更。

### contenthash 的解法
把文件名和“内容”绑定：
- 旧版本：`bundle.aaaa1111.js`
- 新版本：`bundle.bbbb2222.js`

好处是：
- **内容不变 → 文件名不变 → 浏览器可以长期强缓存**
- **内容变化 → 文件名变化 → 浏览器自动下载新文件**

你无需让 `bundle.js` 这种“稳定 URL”去承受版本变更压力。

### 配合实现版本控制与回滚
一般会配合一个 `mainfest.json` 来指定到底用哪一个产物作为当前版本。

比如现在有
- 第一版：`dist/good/bundle.aaaa1111.js`
- 第二版：`dist/good/bundle.bbbb2222.js`

此时：
- 老用户的 HTML 可能仍引用 `bundle.aaaa1111.js`（因为它已被缓存/已部署过）
- 两个版本可以在发布窗口期同时存在，便于平滑发布与回滚（真正的长效缓存）
- `mainfest.json` 指定使用第一版或者第二版，即可实现版本回滚

## 本章节需要的依赖意及其作用

> 与上一章节一致

```bash
pnpm add -D webpack webpack-cli swc-loader @swc/core style-loader css-loader
```

## 为什么是 [contenthash]
webpack 的输出文件名支持模板占位符：
- `[contenthash]`：根据文件内容计算 hash（内容变 → hash 变）
- `[chunkhash]`：根据 chunk 计算
- `[hash]`：整个构建的 hash（不推荐，容易“全变”）

你要的效果是：**内容不变就复用缓存，内容变化才下载新文件**，因此 `[contenthash]` 最符合直觉。

## 为什么要区分 dev/prod
开发（dev）更关注：
- 快
- 好调试
- 文件名固定、简单

生产（prod）更关注：
- 体积小
- 可长期缓存
- 可控的 source map（通常关闭或单独上传）

因此常见做法是：
- dev：`bundle.js`
- prod：`bundle.[contenthash].js`

## 你最终要做到什么（验收标准）
- `pnpm run build` 产出带 hash 的文件名
- 修改源代码再构建，hash 改变
- 不改代码重复构建，hash 尽量保持稳定（后续关卡会深入“为什么有时不稳定”）


