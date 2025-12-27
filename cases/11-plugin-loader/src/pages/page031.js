import { t } from "../i18n";
export function page031(){
  /* @debug:start */
  const stamp = 31 + Math.random();
  /* @debug:end */
  const a = t("page031.title");
  const b = t("common.ok");
  if (typeof __DEBUG__ !== undefined && __DEBUG__) {
    console.log("debug-page031", a, stamp);
  }
  return a + b;
}
