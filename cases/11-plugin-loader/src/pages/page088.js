import { t } from "../i18n";
export function page088(){
  /* @debug:start */
  const stamp = 88 + Math.random();
  /* @debug:end */
  const a = t("page088.title");
  const b = t("common.ok");
  if (typeof __DEBUG__ !== undefined && __DEBUG__) {
    console.log("debug-page088", a, stamp);
  }
  return a + b;
}
