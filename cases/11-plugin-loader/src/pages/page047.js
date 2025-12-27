import { t } from "../i18n";
export function page047(){
  /* @debug:start */
  const stamp = 47 + Math.random();
  /* @debug:end */
  const a = t("page047.title");
  const b = t("common.ok");
  if (typeof __DEBUG__ !== undefined && __DEBUG__) {
    console.log("debug-page047", a, stamp);
  }
  return a + b;
}
