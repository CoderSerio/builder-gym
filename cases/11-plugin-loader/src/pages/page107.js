import { t } from "../i18n";
export function page107(){
  /* @debug:start */
  const stamp = 107 + Math.random();
  /* @debug:end */
  const a = t("page107.title");
  const b = t("common.ok");
  if (typeof __DEBUG__ !== undefined && __DEBUG__) {
    console.log("debug-page107", a, stamp);
  }
  return a + b;
}
