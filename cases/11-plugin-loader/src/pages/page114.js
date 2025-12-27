import { t } from "../i18n";
export function page114(){
  /* @debug:start */
  const stamp = 114 + Math.random();
  /* @debug:end */
  const a = t("page114.title");
  const b = t("common.ok");
  if (typeof __DEBUG__ !== undefined && __DEBUG__) {
    console.log("debug-page114", a, stamp);
  }
  return a + b;
}
