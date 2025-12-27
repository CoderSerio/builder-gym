import { t } from "../i18n";
export function page087(){
  /* @debug:start */
  const stamp = 87 + Math.random();
  /* @debug:end */
  const a = t("page087.title");
  const b = t("common.ok");
  if (typeof __DEBUG__ !== undefined && __DEBUG__) {
    console.log("debug-page087", a, stamp);
  }
  return a + b;
}
