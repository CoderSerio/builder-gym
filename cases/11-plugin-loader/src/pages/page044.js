import { t } from "../i18n";
export function page044(){
  /* @debug:start */
  const stamp = 44 + Math.random();
  /* @debug:end */
  const a = t("page044.title");
  const b = t("common.ok");
  if (typeof __DEBUG__ !== undefined && __DEBUG__) {
    console.log("debug-page044", a, stamp);
  }
  return a + b;
}
