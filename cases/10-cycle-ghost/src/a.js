// 循环引用反例：a -> b -> a
const b = require("./b");

module.exports = {
  aValue: "A",
  // 这里在循环依赖下可能拿到 undefined（因为 b 读取 a 的 exports 时 a 还没初始化完）
  fromB: b.bValue
};


