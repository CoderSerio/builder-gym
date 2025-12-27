import { t } from "../i18n";
export function page100(){
  /* @debug:start */
  const stamp = 100 + Math.random();
  /* @debug:end */
  const a = t("page100.title");
  const b = t("common.ok");
  if (typeof __DEBUG__ !== undefined && __DEBUG__) {
    console.log("debug-page100", a, stamp);
  }
  return a + b;
}
