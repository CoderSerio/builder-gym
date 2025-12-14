# Solution - 10 循环引用 + 幽灵依赖（逐步对齐 tasks）

> 本答案的标题严格对齐 `docs/tasks.md` 的步骤。

## 1. 安装依赖

本关的“幽灵依赖”是故意制造的，所以第一次先不要安装 lodash（为了复现报错）。当你做到第 3 步时再安装/声明。

---

## 2. 复现幽灵依赖问题

**操作**：
```bash
pnpm run build
```

**预期**：
- 报错类似：`Cannot find module 'lodash'`

**解释**：
- 代码引用了 lodash，但本 package 没在 `package.json` 声明它。
- 在某些 npm/yarn hoist 场景下你可能“误以为能跑”，但在 pnpm/CI/容器环境会暴露问题。

---

## 3. 修复幽灵依赖

### 3.1 正确做法：给本 package 声明依赖
**操作（推荐）**：
```bash
pnpm --filter @build-gym/10-cycle-ghost add lodash
```

或手动修改 `cases/10-cycle-ghost/package.json`：
```json
{
  "dependencies": {
    "lodash": "^4.17.21"
  }
}
```

**解释**：
- 依赖必须就近声明，才能保证可追踪、可复现、可在 CI/生产一致运行。

---

## 4. 复现循环引用问题

**操作**：
```bash
pnpm run build
```

**预期**：
- 你会看到输出里 `fromA` 或 `fromB` 出现 `undefined`

**解释**：
- `a.js` 与 `b.js` 相互 require。
- CommonJS 会在循环依赖时返回“半初始化的 exports”，导致访问到 `undefined`。

---

## 5. 修复循环引用

### 方式 A（推荐）：提取 shared 模块
把共享常量移到 `shared.js`，让 `a.js` 和 `b.js` 都依赖 shared，而不是互相依赖。

**操作**：
- 新建 `src/shared.js`：
```js
module.exports = {
  A_VALUE: "A",
  B_VALUE: "B"
};
```
- 修改 `src/a.js` 与 `src/b.js`，移除相互 require：
```js
// a.js
const { A_VALUE, B_VALUE } = require("./shared");
module.exports = { aValue: A_VALUE, fromB: B_VALUE };
```
```js
// b.js
const { A_VALUE, B_VALUE } = require("./shared");
module.exports = { bValue: B_VALUE, fromA: A_VALUE };
```

**解释**：
- 共享依赖应该“下沉”到第三方模块，避免互相引用。
- 这也是工程里最常见、最稳定的循环依赖修复方式。

---

## 6. 验证

**操作**：
```bash
pnpm run build
```

**预期**：
- 稳定输出正确结果，不再出现 `undefined`

---

## 完整代码参考

### `src/index.js`
```js
const { chunk } = require("lodash");
const a = require("./a");
const b = require("./b");

console.log("chunks:", chunk([1, 2, 3, 4], 2));
console.log("a:", a);
console.log("b:", b);
```

### `src/shared.js`
```js
module.exports = {
  A_VALUE: "A",
  B_VALUE: "B"
};
```

### `src/a.js`
```js
const { A_VALUE, B_VALUE } = require("./shared");
module.exports = { aValue: A_VALUE, fromB: B_VALUE };
```

### `src/b.js`
```js
const { A_VALUE, B_VALUE } = require("./shared");
module.exports = { bValue: B_VALUE, fromA: A_VALUE };
```


