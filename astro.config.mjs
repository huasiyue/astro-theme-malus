import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

function readPlainSiteUrl() {
  const configPath = resolve(process.cwd(), "malus.config.conf");
  if (!existsSync(configPath)) return "";

  let inSiteSection = false;
  for (const rawLine of readFileSync(configPath, "utf8").split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#") || line.startsWith(";")) continue;
    if (line === "[site]") {
      inSiteSection = true;
      continue;
    }
    if (line.startsWith("[") && line.endsWith("]")) {
      inSiteSection = false;
      continue;
    }
    if (inSiteSection && line.startsWith("url")) {
      const separatorIndex = line.indexOf("=");
      return separatorIndex >= 0 ? line.slice(separatorIndex + 1).trim() : "";
    }
  }

  return "";
}

const site = process.env.PUBLIC_SITE_URL?.trim() || readPlainSiteUrl() || "https://example.com";

export default defineConfig({
  site,
  integrations: [mdx(), sitemap()],
  markdown: {
    shikiConfig: {
      theme: "github-dark",
      wrap: true
    }
  }
});
