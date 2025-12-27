# 学习说明

- Loader 与 Plugin 的职责：
  - Loader 处理单个模块的源代码（本关使用注释分界剔除调试块）。
  - Plugin 参与编译生命周期（本关在 `processAssets` 阶段扫描构建产物收集 i18n keys）。
- Webpack 与 Rspack：JS 插件与 Loader 接口高度兼容；本关的 JS 插件/Loader 在两者中可复用。
- Rust 加速：
  - 现实中采用 Rspack 时常会引入 Rust 能力，本关用 `napi-rs` 写一个原生扩展，加速字符串扫描。
  - JS 插件会在 Rspack 变体中优先调用原生扩展，若不可用则退化为 JS 实现。

## 安装与构建

1) 安装依赖（需要网络）

```bash
pnpm i
```

2) 编译原生扩展（可选：用于 `rspack+rust` 变体）

- 需要本机安装 Rust 工具链（rustup/cargo）。
- 首次构建会下载 crates 依赖，耗时较长。

```bash
pnpm run build:native
```

若构建失败或未安装 Rust，`bench` 会自动降级使用 JS 实现。

## 跑分

```bash
pnpm bench
```

脚本将依次执行：
- webpack + JS 插件（webpack+js）
- Rspack + JS 插件（rspack+js）
- Rspack + JS 插件 + Rust 加速（rspack+rust，原生扩展可用则启用）
- Rspack + 原生桥接插件（rspack+native，强制使用原生扩展）
- Rspack + DefinePlugin 对照组（rspack+define）

输出包括：每个变体的构建耗时、产物总体积与 gzip 体积，以及收集到的 i18n key 数量。

### 变体分组含义与差异
- webpack+js：webpack 配置 + 自定义 Loader（注释块剔除）+ JS 插件收集 i18n key，不使用 Rust；“传统链路”对照。
- rspack+js：Rspack 配置 + 自定义 Loader + JS 插件；功能与 webpack+js 等价，用于观察 Rspack 的性能差异。
- rspack+rust：同 rspack+js，但通用 JS 插件内部优先使用 N-API 原生扩展进行字符串扫描；若原生不可用则自动回退 JS。
- rspack+native：使用“原生桥接插件”接入 Rspack 生命周期，强制调用 N-API 原生扩展（不可用则报错，不回退）。
- rspack+define：使用 Rspack 内置 DefinePlugin 常量折叠（`__DEBUG__ = false`）+ 压缩移除 `if (__DEBUG__) {}` 分支；不处理注释块分界。

## 关于 Rspack 的 Rust 插件体系 vs 本关实现

- 本关 Rust 加速主要通过 N-API 原生扩展（napi-rs）提供字符串扫描能力，再由 JS 插件（webpack/rspack 兼容）在构建生命周期中调用。
- 这样做的动机：
  - 独立发布与版本解耦：N-API 扩展只依赖 Node ABI，避免与 Rspack 内部 Rust crate 的版本耦合；升级 Rspack 时通常无需重编译绑定到特定 Rspack 版本的接口。
  - 跨工具可用性：同一段扫描逻辑既可被 Rspack 使用，也可被 webpack（或其他 Node 工具）复用，便于教学对照与回退。

- Rspack 的“原生 Rust 插件”说明（知识点）：
  - Rspack 确实提供了 Rust 侧的插件接口（面向内建/同版本编译的插件），可以在更靠近编译管线处介入（如模块解析、优化阶段），潜在开销更低、可访问更多内部数据结构。
  - 但当前生态下，面向第三方分发的“二进制动态加载”与稳定 ABI 仍在演进中；通常推荐作为内置插件或与 Rspack 源码同树/同版本构建，以避免版本失配。
  - 如果你的目标仅服务 Rspack 且能接受与其版本绑定，那么“原生 Rust 插件”是性能与可观测性更强的路线；若需要跨工具或更易分发，N-API 扩展 + JS 薄封装更务实。

### Rspack 插件形态（本关涉及与扩展）
- JS 插件（webpack 兼容）：`plugins/js/i18n-collect-plugin.js`，通过编译钩子实现功能，可在 webpack 与 Rspack 之间复用。
- JS 插件 + N-API 原生扩展：同上，但在插件内部优先调用原生扩展加速（rspack+rust 变体）。
- 原生桥接插件（Native-Bridge）：专供 Rspack 的 JS 插件外壳，生命周期中强制调用原生扩展（rspack+native 变体）。
- Rspack 原生 Rust 插件（真正内核插件）：直接使用 Rspack 的 Rust 插件接口（Trait/Hook）构建，性能/可观测性最佳，但强版本耦合、分发难。
- 内置插件：如 `DefinePlugin`，与压缩器配合移除无用分支（教学对照，不等价于注释块剔除）。

### 本关增加的“Native-Bridge”变体
- 目录：`plugins/js-native-bridge/i18n-collect-plugin.native.js`
- 思路：仍以 N-API 扩展实现核心逻辑，但以“插件外壳”的形式接入 Rspack（而非通用 JS 插件里再行判断），便于与 JS 插件和 Define 对照一起跑分。
- 命令：`pnpm run build:rspack:native`（需要先 `pnpm run build:native`）

### 进一步：真正的 Rspack 原生 Rust 插件（参考）
- 如果你要直接使用 Rspack 的 Rust 插件接口（Trait/Hook），通常需要：
  - 将插件与 Rspack 同版本构建（建议在 Rspack 源码树内，或明确 pin 到某个 git 提交）。
  - 使用 Rspack 提供的内部 crates（可能未在 crates.io 上稳定发布），例如 `rspack_plugin_*` 等。
  - 通过 Rspack 的原生插件加载机制注册（具体以官方文档/示例为准）。
- 优点：更靠近编译管线、可访问内部结构、潜在性能更优。
- 缺点：版本耦合强、分发困难、对教学环境要求高。
- 本仓库为降低复杂度与提升可移植性，未内置该实现，但在 `Native-Bridge` 变体中已经展示了“Rust 写核心逻辑 + 插件外壳接入”的方式。若你需要，我可按指定 Rspack 版本补充一个最精简的原生插件样例用于线下演示。
