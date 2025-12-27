const path = require('path');
const { RawSource } = (() => {
  try { return require('webpack').sources; } catch (_) {}
  try { return require('@rspack/core').sources; } catch (_) {}
  return { RawSource: class { constructor(content){ this._c = content; } source(){ return this._c; } size(){ return Buffer.byteLength(this._c); } } };
})();

function tryLoadNative() {
  try {
    // 尝试加载本地构建的 N-API 扩展
    return require('../rust-napi/i18n-collect-rs');
  } catch (e) {
    return null;
  }
}

function collectByJS(sources) {
  const re = /\bt\(\s*(["\'])((?:\\\1|[^\1])+?)\1\s*[,)]/g;
  const map = new Map();
  for (const src of sources) {
    const text = typeof src === 'string' ? src : String(src);
    let m;
    while ((m = re.exec(text))) {
      const key = m[2];
      map.set(key, (map.get(key) || 0) + 1);
    }
  }
  return Array.from(map, ([key, count]) => ({ key, count }));
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

class I18nCollectPlugin {
  constructor(options = {}) {
    this.filename = options.filename || 'i18n.keys.json';
    this.impl = options.impl || 'auto'; // auto | js | rust
  }
  apply(compiler) {
    const pluginName = 'I18nCollectPlugin';
    const useRust = this.impl === 'rust' || (this.impl === 'auto' && !!tryLoadNative());
    const native = useRust ? tryLoadNative() : null;
    const tap = (compilation) => {
      // 优先扫描模块原始源码，避免压缩/打包改写导致的误判
      const modSources = [];
      const mods = compilation.modules || (compilation._modules ? Array.from(compilation._modules) : []);
      if (mods && typeof mods[Symbol.iterator] === 'function') {
        for (const m of mods) {
          try {
            const srcObj = typeof m.originalSource === 'function' ? m.originalSource() : (m._source || null);
            const src = toSourceString(srcObj);
            if (src && typeof src === 'string') modSources.push(src);
          } catch (_) {}
        }
      }

      // 兜底：扫描产物（若原始源码为空/不可获得）
      let sources = modSources;
      if (!sources.length) {
        const assets = compilation.getAssets ? compilation.getAssets() : Object.keys(compilation.assets).map(name => ({ name, source: compilation.assets[name] }));
        const jsAssets = assets.filter(a => a.name.endsWith('.js'));
        sources = jsAssets.map(a => toSourceString(a.source));
      }
      let result = [];
      const nativeFn = native && (native.collect_i18n_keys || native.collectI18NKeys);
      if (typeof nativeFn === 'function') {
        try {
          result = nativeFn(sources);
        } catch (e) {
          compilation.warnings.push(new Error(`[${pluginName}] Rust 扩展调用失败，降级到 JS：` + e.message));
          result = collectByJS(sources);
        }
      } else {
        result = collectByJS(sources);
      }
      const json = JSON.stringify({ keys: result, total: result.length }, null, 2);
      const { RawSource } = require(compiler.webpack ? 'webpack' : '@rspack/core').sources || { RawSource };
      const content = new (RawSource || (class { constructor(c){ this._c=c;} source(){return this._c;} size(){return Buffer.byteLength(this._c);} })) (json);
      if (compilation.emitAsset) {
        compilation.emitAsset(this.filename, content);
      } else {
        compilation.assets[this.filename] = content;
      }
    };

    // 兼容 webpack 与 rspack 的钩子
    if (compiler.hooks && compiler.hooks.thisCompilation) {
      compiler.hooks.thisCompilation.tap(pluginName, (compilation) => {
        const stage = (compilation.constructor && compilation.constructor.PROCESS_ASSETS_STAGE_SUMMARIZE) || 1000;
        if (compilation.hooks && compilation.hooks.processAssets) {
          compilation.hooks.processAssets.tap({ name: pluginName, stage }, () => tap(compilation));
        } else if (compilation.hooks && compilation.hooks.optimizeAssets) {
          compilation.hooks.optimizeAssets.tap(pluginName, () => tap(compilation));
        } else {
          // 最后兜底
          tap(compilation);
        }
      });
    } else if (compiler.plugin) {
      compiler.plugin('this-compilation', (compilation) => tap(compilation));
    }
  }
}

module.exports = { I18nCollectPlugin };
