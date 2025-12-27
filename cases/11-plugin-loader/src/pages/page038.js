import { t } from "../i18n";
export function page038(){
  /* @debug:start */
  const stamp = 38 + Math.random();
  /* @debug:end */
  const a = t("page038.title");
  const b = t("common.ok");
  if (typeof __DEBUG__ !== undefined && __DEBUG__) {
    console.log("debug-page038", a, stamp);
  }
  return a + b;
}
