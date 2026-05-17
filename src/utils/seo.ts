import type { Lang } from "@/config/site";
import { siteConfig } from "@/config/site";

export function canonicalForPath(pathname: string) {
  return new URL(pathname, siteConfig.siteUrl).toString();
}

export function localeForLang(lang: Lang) {
  return lang === "en" ? "en-US" : "zh-CN";
}
