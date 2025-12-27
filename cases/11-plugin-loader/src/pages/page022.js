import { t } from "../i18n";
export function page022(){
  /* @debug:start */
  const stamp = 22 + Math.random();
  /* @debug:end */
  const a = t("page022.title");
  const b = t("common.ok");
  if (typeof __DEBUG__ !== undefined && __DEBUG__) {
    console.log("debug-page022", a, stamp);
  }
  return a + b;
}
