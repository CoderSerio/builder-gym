import { t } from "../i18n";
export function page007(){
  /* @debug:start */
  const stamp = 7 + Math.random();
  /* @debug:end */
  const a = t("page007.title");
  const b = t("common.ok");
  if (typeof __DEBUG__ !== undefined && __DEBUG__) {
    console.log("debug-page007", a, stamp);
  }
  return a + b;
}
