import { t } from "../i18n";
export function page064(){
  /* @debug:start */
  const stamp = 64 + Math.random();
  /* @debug:end */
  const a = t("page064.title");
  const b = t("common.ok");
  if (typeof __DEBUG__ !== undefined && __DEBUG__) {
    console.log("debug-page064", a, stamp);
  }
  return a + b;
}
