# 参考答案（要点）

- Loader：使用正则/状态机移除 `/* @debug:start */ ... /* @debug:end */`，注意嵌套与跨行匹配；保留 SourceMap 可选。
- 插件：在 `thisCompilation -> processAssets` 钩子中遍历 `.js` 产物，以 `/t\(\s*([\'\"])((?:\\\1|[^\1])+?)\1\s*[,)]/g` 进行匹配；`Map` 聚合计数，写入 `compilation.emitAsset('i18n.keys.json', RawSource(...))`。
- Rust：使用 `napi-rs` 暴露 `collect_i18n_keys(sources: Vec<String>) -> Vec<{key,count}>`，内部用 `regex` crate 聚合；JS 插件中优先调用原生实现。
- Rspack 对照：`DefinePlugin({ __DEBUG__: false })` + 压缩可移除 `if (__DEBUG__) {...}` 分支，功能不等价于注释剔除，但具有教学意义。
