import { t } from "../i18n";
export function page082(){
  /* @debug:start */
  const stamp = 82 + Math.random();
  /* @debug:end */
  const a = t("page082.title");
  const b = t("common.ok");
  if (typeof __DEBUG__ !== undefined && __DEBUG__) {
    console.log("debug-page082", a, stamp);
  }
  return a + b;
}
