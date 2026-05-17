import { malusConfig } from "@/config/malus.config";
import type { ConfigGate, Lang } from "@/config/defineConfig";

export type { Lang };

const giscus = malusConfig.comments.giscus;
const giscusReady = Boolean(giscus.repo && giscus.repoId && giscus.category && giscus.categoryId);

export function isConfigItemEnabled(item: ConfigGate) {
  return (
    item.enabled !== false &&
    (!item.feature || malusConfig.features[item.feature]) &&
    (!item.plugin || malusConfig.plugins[item.plugin])
  );
}

export const siteConfig = {
  siteName: malusConfig.site.name,
  brandMark: malusConfig.site.brandMark,
  siteDescription: malusConfig.site.description,
  siteUrl: malusConfig.site.url,
  githubUrl: malusConfig.features.github ? malusConfig.site.githubUrl : "",
  launchedAt: malusConfig.site.launchedAt,
  features: malusConfig.features,
  plugins: malusConfig.plugins,
  home: malusConfig.home,
  pages: malusConfig.pages,
  blog: malusConfig.blog,
  viewCounter: {
    endpoint: malusConfig.views.endpoint,
    localFallback: malusConfig.views.localFallback
  },
  comments: {
    provider: malusConfig.comments.provider,
    giscus: {
      enabled:
        malusConfig.features.comments &&
        malusConfig.plugins.giscus &&
        malusConfig.comments.enabled &&
        malusConfig.comments.provider === "giscus" &&
        giscusReady,
      showSetup:
        malusConfig.features.comments &&
        malusConfig.plugins.giscus &&
        malusConfig.comments.provider === "giscus" &&
        giscus.showSetup,
      repo: giscus.repo,
      repoId: giscus.repoId,
      category: giscus.category,
      categoryId: giscus.categoryId,
      mapping: giscus.mapping,
      strict: giscus.strict,
      reactionsEnabled: giscus.reactionsEnabled,
      emitMetadata: giscus.emitMetadata,
      inputPosition: giscus.inputPosition,
      lightTheme: giscus.lightTheme,
      darkTheme: giscus.darkTheme
    }
  },
  defaultLang: malusConfig.site.defaultLang,
  supportedLangs: malusConfig.site.supportedLangs,
  author: {
    name: malusConfig.author.name,
    handle: malusConfig.author.handle,
    email: malusConfig.author.email ?? "",
    avatarUrl: malusConfig.author.avatar
  }
};

export const navItems = malusConfig.navigation.items
  .filter(isConfigItemEnabled)
  .map(({ href, label }) => ({ href, label }));
