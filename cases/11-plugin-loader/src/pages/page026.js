import { t } from "../i18n";
export function page026(){
  /* @debug:start */
  const stamp = 26 + Math.random();
  /* @debug:end */
  const a = t("page026.title");
  const b = t("common.ok");
  if (typeof __DEBUG__ !== undefined && __DEBUG__) {
    console.log("debug-page026", a, stamp);
  }
  return a + b;
}
