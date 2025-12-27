import { t } from "../i18n";
export function page034(){
  /* @debug:start */
  const stamp = 34 + Math.random();
  /* @debug:end */
  const a = t("page034.title");
  const b = t("common.ok");
  if (typeof __DEBUG__ !== undefined && __DEBUG__) {
    console.log("debug-page034", a, stamp);
  }
  return a + b;
}
