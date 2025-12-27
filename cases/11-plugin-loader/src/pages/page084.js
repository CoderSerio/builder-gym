import { t } from "../i18n";
export function page084(){
  /* @debug:start */
  const stamp = 84 + Math.random();
  /* @debug:end */
  const a = t("page084.title");
  const b = t("common.ok");
  if (typeof __DEBUG__ !== undefined && __DEBUG__) {
    console.log("debug-page084", a, stamp);
  }
  return a + b;
}
