// Native-bridge variant: plugin shell in JS, core scanning in Rust (N-API)
const { RawSource } = require('@rspack/core').sources;
let native;
try {
  native = require('../native/i18n-collect-rs');
} catch (e) {
  throw new Error('[I18nCollectNativeBridge] 未找到原生模块，请先执行 pnpm run build:native');
}

function toSourceString(s) {
  try {
    if (!s) return '';
    if (typeof s.source === 'function') return s.source();
    if (typeof s === 'function') return s();
    if (typeof s === 'string') return s;
    if (Buffer.isBuffer(s)) return s.toString('utf8');
    return String(s);
  } catch (_) {
    return '';
  }
}

class I18nCollectNativeBridge {
  constructor(options = {}) {
    this.filename = options.filename || 'i18n.keys.json';
  }
  apply(compiler) {
    const name = 'I18nCollectNativeBridge';
    compiler.hooks.thisCompilation.tap(name, (compilation) => {
      const stage = compilation.constructor.PROCESS_ASSETS_STAGE_SUMMARIZE;
      compilation.hooks.processAssets.tap({ name, stage }, () => {
        const modSources = [];
        const mods = compilation.modules || [];
        for (const m of mods) {
          const srcObj = typeof m.originalSource === 'function' ? m.originalSource() : (m._source || null);
          const src = toSourceString(srcObj);
          if (src) modSources.push(src);
        }
        const fn = native.collect_i18n_keys || native.collectI18NKeys;
        if (typeof fn !== 'function') {
          throw new Error('[I18nCollectNativeBridge] 无法找到导出函数 collect_i18n_keys/collectI18NKeys');
        }
        const result = fn(modSources);
        const json = JSON.stringify({ keys: result, total: result.length }, null, 2);
        compilation.emitAsset(this.filename, new RawSource(json));
      });
    });
  }
}

module.exports = { I18nCollectNativeBridge };
