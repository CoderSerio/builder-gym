import { t } from "../i18n";
export function page083(){
  /* @debug:start */
  const stamp = 83 + Math.random();
  /* @debug:end */
  const a = t("page083.title");
  const b = t("common.ok");
  if (typeof __DEBUG__ !== undefined && __DEBUG__) {
    console.log("debug-page083", a, stamp);
  }
  return a + b;
}
