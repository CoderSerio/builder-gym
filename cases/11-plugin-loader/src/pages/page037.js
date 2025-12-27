import { t } from "../i18n";
export function page037(){
  /* @debug:start */
  const stamp = 37 + Math.random();
  /* @debug:end */
  const a = t("page037.title");
  const b = t("common.ok");
  if (typeof __DEBUG__ !== undefined && __DEBUG__) {
    console.log("debug-page037", a, stamp);
  }
  return a + b;
}
