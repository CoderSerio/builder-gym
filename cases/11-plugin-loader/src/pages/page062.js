import { t } from "../i18n";
export function page062(){
  /* @debug:start */
  const stamp = 62 + Math.random();
  /* @debug:end */
  const a = t("page062.title");
  const b = t("common.ok");
  if (typeof __DEBUG__ !== undefined && __DEBUG__) {
    console.log("debug-page062", a, stamp);
  }
  return a + b;
}
