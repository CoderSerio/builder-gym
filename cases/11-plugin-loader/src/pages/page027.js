import { t } from "../i18n";
export function page027(){
  /* @debug:start */
  const stamp = 27 + Math.random();
  /* @debug:end */
  const a = t("page027.title");
  const b = t("common.ok");
  if (typeof __DEBUG__ !== undefined && __DEBUG__) {
    console.log("debug-page027", a, stamp);
  }
  return a + b;
}
