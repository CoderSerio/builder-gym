import { t } from "../i18n";
export function page032(){
  /* @debug:start */
  const stamp = 32 + Math.random();
  /* @debug:end */
  const a = t("page032.title");
  const b = t("common.ok");
  if (typeof __DEBUG__ !== undefined && __DEBUG__) {
    console.log("debug-page032", a, stamp);
  }
  return a + b;
}
