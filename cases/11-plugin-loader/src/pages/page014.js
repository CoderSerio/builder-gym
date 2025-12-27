import { t } from "../i18n";
export function page014(){
  /* @debug:start */
  const stamp = 14 + Math.random();
  /* @debug:end */
  const a = t("page014.title");
  const b = t("common.ok");
  if (typeof __DEBUG__ !== undefined && __DEBUG__) {
    console.log("debug-page014", a, stamp);
  }
  return a + b;
}
