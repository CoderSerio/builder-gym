import { t } from "../i18n";
export function page089(){
  /* @debug:start */
  const stamp = 89 + Math.random();
  /* @debug:end */
  const a = t("page089.title");
  const b = t("common.ok");
  if (typeof __DEBUG__ !== undefined && __DEBUG__) {
    console.log("debug-page089", a, stamp);
  }
  return a + b;
}
