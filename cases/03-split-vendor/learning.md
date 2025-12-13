# 03 学习：为什么要拆 vendor？什么是“缓存稳定”？

## 本关需要安装哪些依赖（以及为什么）
```bash
pnpm add -D webpack webpack-cli rollup
```
（如果你要跑 rollup 的完整链路，通常还需要 node-resolve/commonjs 等插件；按本关实际情况补充即可。）

## 为什么要拆 vendor
当你把所有代码都打进 `main.js`：
- 只要你改了任何业务代码，`main.js` 的内容就变了
- 内容一变，hash 一变，浏览器缓存失效
- 用户要重新下载包括 React/三方库在内的所有内容

拆分 vendor 的目标是把“低频变动”的代码（框架/三方库）独立出来：
- 业务改动只影响 App chunk
- Framework/Libs chunk 保持稳定，缓存命中率高

## 什么是缓存稳定（更准确：hash 稳定）
我们希望满足：
- **改业务代码** → 只有业务相关 chunk 的 hash 改变
- **不改代码** → 重复构建产物 hash 尽量不变

注意：hash 稳定不只取决于 `[contenthash]`，还受 chunk 划分、runtime、chunkId 策略影响。
下一关（04）会专门讲 runtime chunk 对稳定性的影响。

## webpack 的 splitChunks 是什么
webpack 会根据模块依赖关系把代码拆成 chunk。
`splitChunks` 允许你通过 cacheGroups 精细控制：
- 哪些模块属于哪个层
- chunk 的命名与优先级

## rollup 的 manualChunks 是什么
rollup 更偏“库构建”与 ESM 模型。
`manualChunks` 允许你通过函数把不同模块分配到不同 chunk：
- react/react-dom → framework
- node_modules → libs
- src/components/shared → commons

## 本关验收关注点
你需要能“解释”：
- 为什么拆 vendor 能提升缓存命中
- webpack/rollup 是如何把模块分到不同 chunk 的


