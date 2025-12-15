// 先不要安装依赖，直接 pnpm run build，尝试触发"幽灵依赖"：
// 代码中引用了 lodash，但 package.json 中没有声明
const { chunk } = require("lodash");

// 修复幽灵依赖后，这里会继续触发“循环引用”问题
const a = require("./a");
const b = require("./b");

console.log("chunks:", chunk([1, 2, 3, 4], 2));
console.log("a:", a);
console.log("b:", b);


