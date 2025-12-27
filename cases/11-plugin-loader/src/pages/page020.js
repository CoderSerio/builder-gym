import { t } from "../i18n";
export function page020(){
  /* @debug:start */
  const stamp = 20 + Math.random();
  /* @debug:end */
  const a = t("page020.title");
  const b = t("common.ok");
  if (typeof __DEBUG__ !== undefined && __DEBUG__) {
    console.log("debug-page020", a, stamp);
  }
  return a + b;
}
