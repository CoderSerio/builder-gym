import { t } from "../i18n";
export function page010(){
  /* @debug:start */
  const stamp = 10 + Math.random();
  /* @debug:end */
  const a = t("page010.title");
  const b = t("common.ok");
  if (typeof __DEBUG__ !== undefined && __DEBUG__) {
    console.log("debug-page010", a, stamp);
  }
  return a + b;
}
