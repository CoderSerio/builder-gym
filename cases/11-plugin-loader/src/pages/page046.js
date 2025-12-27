import { t } from "../i18n";
export function page046(){
  /* @debug:start */
  const stamp = 46 + Math.random();
  /* @debug:end */
  const a = t("page046.title");
  const b = t("common.ok");
  if (typeof __DEBUG__ !== undefined && __DEBUG__) {
    console.log("debug-page046", a, stamp);
  }
  return a + b;
}
