import { t } from "../i18n";
export function page008(){
  /* @debug:start */
  const stamp = 8 + Math.random();
  /* @debug:end */
  const a = t("page008.title");
  const b = t("common.ok");
  if (typeof __DEBUG__ !== undefined && __DEBUG__) {
    console.log("debug-page008", a, stamp);
  }
  return a + b;
}
