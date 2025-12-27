import { t } from "../i18n";
export function page098(){
  /* @debug:start */
  const stamp = 98 + Math.random();
  /* @debug:end */
  const a = t("page098.title");
  const b = t("common.ok");
  if (typeof __DEBUG__ !== undefined && __DEBUG__) {
    console.log("debug-page098", a, stamp);
  }
  return a + b;
}
