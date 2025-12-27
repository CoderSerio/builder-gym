import { t } from "../i18n";
export function page091(){
  /* @debug:start */
  const stamp = 91 + Math.random();
  /* @debug:end */
  const a = t("page091.title");
  const b = t("common.ok");
  if (typeof __DEBUG__ !== undefined && __DEBUG__) {
    console.log("debug-page091", a, stamp);
  }
  return a + b;
}
