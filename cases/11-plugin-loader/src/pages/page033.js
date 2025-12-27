import { t } from "../i18n";
export function page033(){
  /* @debug:start */
  const stamp = 33 + Math.random();
  /* @debug:end */
  const a = t("page033.title");
  const b = t("common.ok");
  if (typeof __DEBUG__ !== undefined && __DEBUG__) {
    console.log("debug-page033", a, stamp);
  }
  return a + b;
}
