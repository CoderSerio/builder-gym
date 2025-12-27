import { t } from "../i18n";
export function page040(){
  /* @debug:start */
  const stamp = 40 + Math.random();
  /* @debug:end */
  const a = t("page040.title");
  const b = t("common.ok");
  if (typeof __DEBUG__ !== undefined && __DEBUG__) {
    console.log("debug-page040", a, stamp);
  }
  return a + b;
}
