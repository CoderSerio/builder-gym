import { t } from "../i18n";
export function page072(){
  /* @debug:start */
  const stamp = 72 + Math.random();
  /* @debug:end */
  const a = t("page072.title");
  const b = t("common.ok");
  if (typeof __DEBUG__ !== undefined && __DEBUG__) {
    console.log("debug-page072", a, stamp);
  }
  return a + b;
}
