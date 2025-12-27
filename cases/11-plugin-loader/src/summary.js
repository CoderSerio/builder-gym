import * as pages from './pages/index';
export function summary() {
  let n = 0; let acc = '';
  for (const k of Object.keys(pages)) {
    const f = pages[k];
    acc += f();
    n++;
  }
  return `pages:${n},len:${acc.length}`;
}
