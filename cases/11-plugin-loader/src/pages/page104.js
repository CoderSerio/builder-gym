import { t } from "../i18n";
export function page104(){
  /* @debug:start */
  const stamp = 104 + Math.random();
  /* @debug:end */
  const a = t("page104.title");
  const b = t("common.ok");
  if (typeof __DEBUG__ !== undefined && __DEBUG__) {
    console.log("debug-page104", a, stamp);
  }
  return a + b;
}
