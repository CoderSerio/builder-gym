import { Button, add } from "./dist"; // 构建后验证 Tree Shaking 与类型

const result = add(1, 2);
console.log("result", result);
console.log(Button);


