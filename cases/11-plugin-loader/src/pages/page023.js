import { t } from "../i18n";
export function page023(){
  /* @debug:start */
  const stamp = 23 + Math.random();
  /* @debug:end */
  const a = t("page023.title");
  const b = t("common.ok");
  if (typeof __DEBUG__ !== undefined && __DEBUG__) {
    console.log("debug-page023", a, stamp);
  }
  return a + b;
}
