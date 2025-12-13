export function heavyUnused() {
  // 模拟沉重逻辑
  return Array.from({ length: 1000 }).reduce((s, _, i) => s + i, 0);
}


