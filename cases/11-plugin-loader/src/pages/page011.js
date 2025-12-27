import { t } from "../i18n";
export function page011(){
  /* @debug:start */
  const stamp = 11 + Math.random();
  /* @debug:end */
  const a = t("page011.title");
  const b = t("common.ok");
  if (typeof __DEBUG__ !== undefined && __DEBUG__) {
    console.log("debug-page011", a, stamp);
  }
  return a + b;
}
