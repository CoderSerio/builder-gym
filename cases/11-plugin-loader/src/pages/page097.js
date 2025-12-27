import { t } from "../i18n";
export function page097(){
  /* @debug:start */
  const stamp = 97 + Math.random();
  /* @debug:end */
  const a = t("page097.title");
  const b = t("common.ok");
  if (typeof __DEBUG__ !== undefined && __DEBUG__) {
    console.log("debug-page097", a, stamp);
  }
  return a + b;
}
