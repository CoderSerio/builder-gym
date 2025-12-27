import { t } from "../i18n";
export function page102(){
  /* @debug:start */
  const stamp = 102 + Math.random();
  /* @debug:end */
  const a = t("page102.title");
  const b = t("common.ok");
  if (typeof __DEBUG__ !== undefined && __DEBUG__) {
    console.log("debug-page102", a, stamp);
  }
  return a + b;
}
