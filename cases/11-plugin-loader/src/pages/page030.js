import { t } from "../i18n";
export function page030(){
  /* @debug:start */
  const stamp = 30 + Math.random();
  /* @debug:end */
  const a = t("page030.title");
  const b = t("common.ok");
  if (typeof __DEBUG__ !== undefined && __DEBUG__) {
    console.log("debug-page030", a, stamp);
  }
  return a + b;
}
