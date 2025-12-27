/**
 * strip-debug-block-loader
 * 移除 /* @debug:start *\/ 与 /* @debug:end *\/ 之间的代码块。
 * 简单实现：基于正则/状态机，不做复杂 AST。
 */
module.exports = function stripDebugBlockLoader(source) {
  // 支持多段 block；不处理嵌套（教学足够）。
  const start = /\/\*\s*@debug:start\s*\*\//g;
  const end = /\/\*\s*@debug:end\s*\*\//g;
  let out = '';
  let lastIndex = 0;
  let mStart;
  while ((mStart = start.exec(source))) {
    const idxStart = mStart.index;
    const mEnd = end.exec(source);
    if (!mEnd) {
      // 没有结束标记，保守返回剩余
      break;
    }
    const idxEnd = mEnd.index + mEnd[0].length;
    // 追加 start 之前的代码
    out += source.slice(lastIndex, idxStart);
    // 跳过 [start, end]
    lastIndex = idxEnd;
  }
  out += source.slice(lastIndex);
  return out;
};
