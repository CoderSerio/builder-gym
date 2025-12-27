import { t } from "../i18n";
export function page096(){
  /* @debug:start */
  const stamp = 96 + Math.random();
  /* @debug:end */
  const a = t("page096.title");
  const b = t("common.ok");
  if (typeof __DEBUG__ !== undefined && __DEBUG__) {
    console.log("debug-page096", a, stamp);
  }
  return a + b;
}
