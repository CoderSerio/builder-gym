import { t } from "../i18n";
export function page103(){
  /* @debug:start */
  const stamp = 103 + Math.random();
  /* @debug:end */
  const a = t("page103.title");
  const b = t("common.ok");
  if (typeof __DEBUG__ !== undefined && __DEBUG__) {
    console.log("debug-page103", a, stamp);
  }
  return a + b;
}
