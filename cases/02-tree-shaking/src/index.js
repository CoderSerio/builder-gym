import { add } from "./utils/math.js";
import "./styles.css";
// 未使用函数应被 Tree Shaking 移除
import { heavyUnused } from "./utils/unused.js";
// CJS 模块会破坏摇树
const legacy = require("./utils/legacy.cjs");

const result = add(1, 2);
document.querySelector("#app").innerHTML = `
  <h1>Tree Shaking Demo</h1>
  <p>add(1,2) = ${result}</p>
  <p>legacy side effect: ${legacy.sideEffectValue}</p>
`;

// 防止 eslint 未使用报错
console.log(heavyUnused);


