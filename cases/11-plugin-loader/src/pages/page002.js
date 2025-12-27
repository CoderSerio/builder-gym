import { t } from "../i18n";
export function page002(){
  /* @debug:start */
  const stamp = 2 + Math.random();
  /* @debug:end */
  const a = t("page002.title");
  const b = t("common.ok");
  if (typeof __DEBUG__ !== undefined && __DEBUG__) {
    console.log("debug-page002", a, stamp);
  }
  return a + b;
}
