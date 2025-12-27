import { t } from "../i18n";
export function page005(){
  /* @debug:start */
  const stamp = 5 + Math.random();
  /* @debug:end */
  const a = t("page005.title");
  const b = t("common.ok");
  if (typeof __DEBUG__ !== undefined && __DEBUG__) {
    console.log("debug-page005", a, stamp);
  }
  return a + b;
}
