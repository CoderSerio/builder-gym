export function add(a: number, b: number) {
  return a + b;
}

export function heavyUnused(a: number) {
  // 模拟大计算，期望被摇树掉
  return Array.from({ length: 1000 }).reduce((s, _, i) => s + a * i, 0);
}


