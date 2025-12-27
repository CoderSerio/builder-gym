import { t } from "../i18n";
export function page001(){
  /* @debug:start */
  const stamp = 1 + Math.random();
  /* @debug:end */
  const a = t("page001.title");
  const b = t("common.ok");
  if (typeof __DEBUG__ !== undefined && __DEBUG__) {
    console.log("debug-page001", a, stamp);
  }
  return a + b;
}
