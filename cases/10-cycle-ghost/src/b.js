// 循环引用反例：b -> a -> b
const a = require("./a");

module.exports = {
  bValue: "B",
  // 在循环依赖下，这里很容易是 undefined（因为 a 的 aValue 可能还没来得及赋值）
  fromA: a.aValue
};


