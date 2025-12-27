import { t } from "../i18n";
export function page106(){
  /* @debug:start */
  const stamp = 106 + Math.random();
  /* @debug:end */
  const a = t("page106.title");
  const b = t("common.ok");
  if (typeof __DEBUG__ !== undefined && __DEBUG__) {
    console.log("debug-page106", a, stamp);
  }
  return a + b;
}
