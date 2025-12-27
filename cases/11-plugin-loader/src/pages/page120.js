import { t } from "../i18n";
export function page120(){
  /* @debug:start */
  const stamp = 120 + Math.random();
  /* @debug:end */
  const a = t("page120.title");
  const b = t("common.ok");
  if (typeof __DEBUG__ !== undefined && __DEBUG__) {
    console.log("debug-page120", a, stamp);
  }
  return a + b;
}
