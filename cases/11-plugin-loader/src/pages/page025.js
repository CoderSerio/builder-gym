import { t } from "../i18n";
export function page025(){
  /* @debug:start */
  const stamp = 25 + Math.random();
  /* @debug:end */
  const a = t("page025.title");
  const b = t("common.ok");
  if (typeof __DEBUG__ !== undefined && __DEBUG__) {
    console.log("debug-page025", a, stamp);
  }
  return a + b;
}
