import { t } from "../i18n";
export function page018(){
  /* @debug:start */
  const stamp = 18 + Math.random();
  /* @debug:end */
  const a = t("page018.title");
  const b = t("common.ok");
  if (typeof __DEBUG__ !== undefined && __DEBUG__) {
    console.log("debug-page018", a, stamp);
  }
  return a + b;
}
