import { t } from "../i18n";
export function page060(){
  /* @debug:start */
  const stamp = 60 + Math.random();
  /* @debug:end */
  const a = t("page060.title");
  const b = t("common.ok");
  if (typeof __DEBUG__ !== undefined && __DEBUG__) {
    console.log("debug-page060", a, stamp);
  }
  return a + b;
}
