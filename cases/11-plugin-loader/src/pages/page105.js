import { t } from "../i18n";
export function page105(){
  /* @debug:start */
  const stamp = 105 + Math.random();
  /* @debug:end */
  const a = t("page105.title");
  const b = t("common.ok");
  if (typeof __DEBUG__ !== undefined && __DEBUG__) {
    console.log("debug-page105", a, stamp);
  }
  return a + b;
}
