import { t } from "../i18n";
export function page003(){
  /* @debug:start */
  const stamp = 3 + Math.random();
  /* @debug:end */
  const a = t("page003.title");
  const b = t("common.ok");
  if (typeof __DEBUG__ !== undefined && __DEBUG__) {
    console.log("debug-page003", a, stamp);
  }
  return a + b;
}
