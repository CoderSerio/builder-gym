import { t } from "../i18n";
export function page081(){
  /* @debug:start */
  const stamp = 81 + Math.random();
  /* @debug:end */
  const a = t("page081.title");
  const b = t("common.ok");
  if (typeof __DEBUG__ !== undefined && __DEBUG__) {
    console.log("debug-page081", a, stamp);
  }
  return a + b;
}
