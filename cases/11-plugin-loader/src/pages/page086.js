import { t } from "../i18n";
export function page086(){
  /* @debug:start */
  const stamp = 86 + Math.random();
  /* @debug:end */
  const a = t("page086.title");
  const b = t("common.ok");
  if (typeof __DEBUG__ !== undefined && __DEBUG__) {
    console.log("debug-page086", a, stamp);
  }
  return a + b;
}
