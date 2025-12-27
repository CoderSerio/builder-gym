import { t } from "../i18n";
export function page004(){
  /* @debug:start */
  const stamp = 4 + Math.random();
  /* @debug:end */
  const a = t("page004.title");
  const b = t("common.ok");
  if (typeof __DEBUG__ !== undefined && __DEBUG__) {
    console.log("debug-page004", a, stamp);
  }
  return a + b;
}
