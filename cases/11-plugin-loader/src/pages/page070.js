import { t } from "../i18n";
export function page070(){
  /* @debug:start */
  const stamp = 70 + Math.random();
  /* @debug:end */
  const a = t("page070.title");
  const b = t("common.ok");
  if (typeof __DEBUG__ !== undefined && __DEBUG__) {
    console.log("debug-page070", a, stamp);
  }
  return a + b;
}
