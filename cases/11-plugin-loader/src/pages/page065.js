import { t } from "../i18n";
export function page065(){
  /* @debug:start */
  const stamp = 65 + Math.random();
  /* @debug:end */
  const a = t("page065.title");
  const b = t("common.ok");
  if (typeof __DEBUG__ !== undefined && __DEBUG__) {
    console.log("debug-page065", a, stamp);
  }
  return a + b;
}
