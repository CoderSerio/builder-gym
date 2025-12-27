import { t } from "../i18n";
export function page006(){
  /* @debug:start */
  const stamp = 6 + Math.random();
  /* @debug:end */
  const a = t("page006.title");
  const b = t("common.ok");
  if (typeof __DEBUG__ !== undefined && __DEBUG__) {
    console.log("debug-page006", a, stamp);
  }
  return a + b;
}
