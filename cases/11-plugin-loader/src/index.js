import { t } from './i18n';
import { summary } from './summary';

/* @debug:start */
console.log('[debug] booting case11');
/* @debug:end */

if (typeof __DEBUG__ !== 'undefined' && __DEBUG__) {
  console.log('debug conditional', Date.now());
}

function run() {
  const msg = t('app.start');
  const s = summary();
  const el = document.getElementById('app');
  if (el) el.textContent = msg + ' | ' + s;
}

run();
