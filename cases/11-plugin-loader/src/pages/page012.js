import { t } from "../i18n";
export function page012(){
  /* @debug:start */
  const stamp = 12 + Math.random();
  /* @debug:end */
  const a = t("page012.title");
  const b = t("common.ok");
  if (typeof __DEBUG__ !== undefined && __DEBUG__) {
    console.log("debug-page012", a, stamp);
  }
  return a + b;
}
