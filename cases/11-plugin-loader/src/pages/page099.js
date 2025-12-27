import { t } from "../i18n";
export function page099(){
  /* @debug:start */
  const stamp = 99 + Math.random();
  /* @debug:end */
  const a = t("page099.title");
  const b = t("common.ok");
  if (typeof __DEBUG__ !== undefined && __DEBUG__) {
    console.log("debug-page099", a, stamp);
  }
  return a + b;
}
