import { t } from "../i18n";
export function page101(){
  /* @debug:start */
  const stamp = 101 + Math.random();
  /* @debug:end */
  const a = t("page101.title");
  const b = t("common.ok");
  if (typeof __DEBUG__ !== undefined && __DEBUG__) {
    console.log("debug-page101", a, stamp);
  }
  return a + b;
}
