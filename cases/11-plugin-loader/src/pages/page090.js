import { t } from "../i18n";
export function page090(){
  /* @debug:start */
  const stamp = 90 + Math.random();
  /* @debug:end */
  const a = t("page090.title");
  const b = t("common.ok");
  if (typeof __DEBUG__ !== undefined && __DEBUG__) {
    console.log("debug-page090", a, stamp);
  }
  return a + b;
}
