import { t } from "../i18n";
export function page073(){
  /* @debug:start */
  const stamp = 73 + Math.random();
  /* @debug:end */
  const a = t("page073.title");
  const b = t("common.ok");
  if (typeof __DEBUG__ !== undefined && __DEBUG__) {
    console.log("debug-page073", a, stamp);
  }
  return a + b;
}
