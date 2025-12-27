import { t } from "../i18n";
export function page093(){
  /* @debug:start */
  const stamp = 93 + Math.random();
  /* @debug:end */
  const a = t("page093.title");
  const b = t("common.ok");
  if (typeof __DEBUG__ !== undefined && __DEBUG__) {
    console.log("debug-page093", a, stamp);
  }
  return a + b;
}
