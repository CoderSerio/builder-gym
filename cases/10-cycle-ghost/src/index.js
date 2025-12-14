// 先触发“幽灵依赖”：本文件引用 lodash，但本关卡初始不声明它
const { chunk } = require("lodash");

// 修复幽灵依赖后，这里会继续触发“循环引用”问题
const a = require("./a");
const b = require("./b");

console.log("chunks:", chunk([1, 2, 3, 4], 2));
console.log("a:", a);
console.log("b:", b);


