import { t } from "../i18n";
export function page017(){
  /* @debug:start */
  const stamp = 17 + Math.random();
  /* @debug:end */
  const a = t("page017.title");
  const b = t("common.ok");
  if (typeof __DEBUG__ !== undefined && __DEBUG__) {
    console.log("debug-page017", a, stamp);
  }
  return a + b;
}
