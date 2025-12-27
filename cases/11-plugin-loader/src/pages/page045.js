import { t } from "../i18n";
export function page045(){
  /* @debug:start */
  const stamp = 45 + Math.random();
  /* @debug:end */
  const a = t("page045.title");
  const b = t("common.ok");
  if (typeof __DEBUG__ !== undefined && __DEBUG__) {
    console.log("debug-page045", a, stamp);
  }
  return a + b;
}
