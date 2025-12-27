import { t } from "../i18n";
export function page066(){
  /* @debug:start */
  const stamp = 66 + Math.random();
  /* @debug:end */
  const a = t("page066.title");
  const b = t("common.ok");
  if (typeof __DEBUG__ !== undefined && __DEBUG__) {
    console.log("debug-page066", a, stamp);
  }
  return a + b;
}
