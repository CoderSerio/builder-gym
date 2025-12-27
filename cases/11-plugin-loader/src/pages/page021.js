import { t } from "../i18n";
export function page021(){
  /* @debug:start */
  const stamp = 21 + Math.random();
  /* @debug:end */
  const a = t("page021.title");
  const b = t("common.ok");
  if (typeof __DEBUG__ !== undefined && __DEBUG__) {
    console.log("debug-page021", a, stamp);
  }
  return a + b;
}
