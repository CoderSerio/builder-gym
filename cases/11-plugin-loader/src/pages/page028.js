import { t } from "../i18n";
export function page028(){
  /* @debug:start */
  const stamp = 28 + Math.random();
  /* @debug:end */
  const a = t("page028.title");
  const b = t("common.ok");
  if (typeof __DEBUG__ !== undefined && __DEBUG__) {
    console.log("debug-page028", a, stamp);
  }
  return a + b;
}
