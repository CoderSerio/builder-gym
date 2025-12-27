import { t } from "../i18n";
export function page080(){
  /* @debug:start */
  const stamp = 80 + Math.random();
  /* @debug:end */
  const a = t("page080.title");
  const b = t("common.ok");
  if (typeof __DEBUG__ !== undefined && __DEBUG__) {
    console.log("debug-page080", a, stamp);
  }
  return a + b;
}
