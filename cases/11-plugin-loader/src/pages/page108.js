import { t } from "../i18n";
export function page108(){
  /* @debug:start */
  const stamp = 108 + Math.random();
  /* @debug:end */
  const a = t("page108.title");
  const b = t("common.ok");
  if (typeof __DEBUG__ !== undefined && __DEBUG__) {
    console.log("debug-page108", a, stamp);
  }
  return a + b;
}
