import type { APIContext } from "astro";
import { siteConfig } from "@/config/site";

export function GET(_context: APIContext) {
  const sitemapUrl = new URL("/sitemap-index.xml", siteConfig.siteUrl).toString();
  const sitemapLine = siteConfig.plugins.sitemap ? `\nSitemap: ${sitemapUrl}\n` : "\n";

  return new Response(`User-agent: *\nAllow: /\n${sitemapLine}`, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8"
    }
  });
}
