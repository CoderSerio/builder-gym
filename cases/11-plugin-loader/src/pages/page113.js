import { t } from "../i18n";
export function page113(){
  /* @debug:start */
  const stamp = 113 + Math.random();
  /* @debug:end */
  const a = t("page113.title");
  const b = t("common.ok");
  if (typeof __DEBUG__ !== undefined && __DEBUG__) {
    console.log("debug-page113", a, stamp);
  }
  return a + b;
}
