import { t } from "../i18n";
export function page050(){
  /* @debug:start */
  const stamp = 50 + Math.random();
  /* @debug:end */
  const a = t("page050.title");
  const b = t("common.ok");
  if (typeof __DEBUG__ !== undefined && __DEBUG__) {
    console.log("debug-page050", a, stamp);
  }
  return a + b;
}
