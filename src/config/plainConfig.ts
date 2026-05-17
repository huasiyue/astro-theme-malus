import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import type {
  ConfigAction,
  FeatureKey,
  FriendLink,
  HomeLiquidCard,
  HomeQuickLink,
  IconName,
  InfoCard,
  Lang,
  MalusConfig,
  NavItem,
  PluginKey,
  SponsorMethod,
  SponsorThanks
} from "@/config/defineConfig";

type PlainConfigData = Record<string, Record<string, string[]>>;

const plainConfigFile = "malus.config.conf";

const featureKeys: FeatureKey[] = [
  "search",
  "github",
  "rss",
  "themeSwitch",
  "languageSwitch",
  "comments",
  "views",
  "friends",
  "sponsor",
  "projects",
  "tools",
  "imageLightbox",
  "codeCopy",
  "runtime"
];

const pluginKeys: PluginKey[] = [
  "pagefind",
  "giscus",
  "cloudflareViews",
  "mdx",
  "rss",
  "sitemap",
  "mermaid",
  "katex",
  "analytics"
];

const iconNames: IconName[] = [
  "github",
  "globe",
  "sun",
  "moon",
  "system",
  "arrow-right",
  "chevron-right",
  "search",
  "copy",
  "check",
  "eye",
  "close",
  "tag",
  "calendar",
  "clock",
  "spark",
  "grid",
  "archive",
  "book",
  "folder",
  "rss",
  "heart",
  "link",
  "external",
  "users",
  "rocket",
  "settings",
  "palette",
  "coffee"
];

function parsePlainConfig(content: string): PlainConfigData {
  const data: PlainConfigData = {};
  let section = "root";

  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#") || line.startsWith(";")) continue;

    const sectionMatch = line.match(/^\[([^\]]+)\]$/);
    if (sectionMatch) {
      section = sectionMatch[1].trim();
      data[section] ??= {};
      continue;
    }

    const separatorIndex = line.indexOf("=");
    if (separatorIndex < 0) continue;

    const key = line.slice(0, separatorIndex).trim();
    const value = normalizeValue(line.slice(separatorIndex + 1).trim());
    if (!key) continue;

    data[section] ??= {};
    data[section][key] ??= [];
    data[section][key].push(value);
  }

  return data;
}

function normalizeValue(value: string) {
  const quote = value[0];
  if ((quote === `"` || quote === `'`) && value.endsWith(quote)) {
    return value.slice(1, -1).replaceAll("\\n", "\n");
  }
  return value.replaceAll("\\n", "\n");
}

function readPlainConfig() {
  const configPath = resolve(process.cwd(), plainConfigFile);
  if (!existsSync(configPath)) return {};
  return parsePlainConfig(readFileSync(configPath, "utf8"));
}

function value(data: PlainConfigData, section: string, key: string) {
  const values = data[section]?.[key];
  const latest = values?.[values.length - 1]?.trim();
  return latest ? latest : undefined;
}

function values(data: PlainConfigData, section: string, key = "item") {
  return data[section]?.[key]?.map((item) => item.trim()).filter(Boolean) ?? [];
}

function stringValue(data: PlainConfigData, section: string, key: string, fallback: string) {
  return value(data, section, key) ?? fallback;
}

function numberValue(data: PlainConfigData, section: string, key: string, fallback: number) {
  const parsed = Number(value(data, section, key));
  return Number.isFinite(parsed) ? parsed : fallback;
}

function booleanValue(data: PlainConfigData, section: string, key: string, fallback: boolean) {
  return parseBoolean(value(data, section, key)) ?? fallback;
}

function listValue(data: PlainConfigData, section: string, key: string, fallback: readonly string[]) {
  const raw = value(data, section, key);
  if (!raw) return fallback;
  return splitList(raw);
}

function splitList(raw: string) {
  return raw
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function splitRecord(raw: string) {
  return raw.split("|").map((field) => field.trim());
}

function parseBoolean(raw?: string) {
  if (!raw) return undefined;
  const normalized = raw.trim().toLowerCase();
  if (["true", "yes", "1", "on", "enable", "enabled", "开启", "是"].includes(normalized)) return true;
  if (["false", "no", "0", "off", "disable", "disabled", "关闭", "否"].includes(normalized)) return false;
  return undefined;
}

function asFeatureKey(raw?: string) {
  return featureKeys.includes(raw as FeatureKey) ? (raw as FeatureKey) : undefined;
}

function asPluginKey(raw?: string) {
  return pluginKeys.includes(raw as PluginKey) ? (raw as PluginKey) : undefined;
}

function asIconName(raw?: string) {
  return iconNames.includes(raw as IconName) ? (raw as IconName) : undefined;
}

function asLangList(raw: readonly string[]): readonly Lang[] {
  const langs = raw.filter((item): item is Lang => item === "zh" || item === "en");
  return langs.length ? langs : ["zh"];
}

function gateFromFields(enabled?: string, feature?: string, plugin?: string) {
  return {
    enabled: parseBoolean(enabled),
    feature: asFeatureKey(feature),
    plugin: asPluginKey(plugin)
  };
}

function parseActionRecord(raw: string): ConfigAction | undefined {
  const [label, href, icon, variant, enabled, feature, plugin] = splitRecord(raw);
  if (!label || !href) return undefined;
  return {
    label,
    href,
    icon: asIconName(icon),
    variant: variant === "secondary" ? "secondary" : "primary",
    ...gateFromFields(enabled, feature, plugin)
  };
}

function parseQuickLinkRecord(raw: string): HomeQuickLink | undefined {
  const [label, href, icon, enabled, feature, plugin] = splitRecord(raw);
  const parsedIcon = asIconName(icon);
  if (!label || !href || !parsedIcon) return undefined;
  return {
    label,
    href,
    icon: parsedIcon,
    ...gateFromFields(enabled, feature, plugin)
  };
}

function parseInfoCardRecord(raw: string): InfoCard | undefined {
  const [icon, title, description, href, enabled, feature, plugin] = splitRecord(raw);
  const parsedIcon = asIconName(icon);
  if (!parsedIcon || !title || !description) return undefined;
  return {
    icon: parsedIcon,
    title,
    description,
    href: href || undefined,
    ...gateFromFields(enabled, feature, plugin)
  };
}

function parseNavRecord(raw: string): NavItem | undefined {
  const [href, zh, en, enabled, feature, plugin] = splitRecord(raw);
  if (!href || !zh || !en) return undefined;
  return {
    href,
    label: { zh, en },
    ...gateFromFields(enabled, feature, plugin)
  };
}

function parseLiquidCardRecord(raw: string): HomeLiquidCard | undefined {
  const [label, title] = splitRecord(raw);
  if (!label || !title) return undefined;
  return { label, title };
}

function parseFriendRecord(raw: string): FriendLink | undefined {
  const [name, description, url, avatar, tags, featured] = splitRecord(raw);
  if (!name || !description || !url) return undefined;
  return {
    name,
    description,
    url,
    avatar: avatar || undefined,
    tags: tags ? splitList(tags) : undefined,
    featured: parseBoolean(featured)
  };
}

function parseSponsorMethodRecord(raw: string): SponsorMethod | undefined {
  const [name, description, url, image, note] = splitRecord(raw);
  if (!name || !description) return undefined;
  return {
    name,
    description,
    url: url || undefined,
    image: image || undefined,
    note: note || undefined
  };
}

function parseSponsorThanksRecord(raw: string): SponsorThanks | undefined {
  const [name, message, date] = splitRecord(raw);
  if (!name || !message) return undefined;
  return {
    name,
    message,
    date: date || undefined
  };
}

function compact<T>(items: (T | undefined)[]) {
  return items.filter((item): item is T => Boolean(item));
}

function applyPageHero(data: PlainConfigData, section: string, page: { title: string; description: string; kicker: string; heading: string; body: string }) {
  page.title = stringValue(data, section, "title", page.title);
  page.description = stringValue(data, section, "description", page.description);
  page.kicker = stringValue(data, section, "kicker", page.kicker);
  page.heading = stringValue(data, section, "heading", page.heading);
  page.body = stringValue(data, section, "body", page.body);
}

function applySectionCopy(data: PlainConfigData, section: string, copy: { kicker: string; title: string; description: string }) {
  copy.kicker = stringValue(data, section, "kicker", copy.kicker);
  copy.title = stringValue(data, section, "title", copy.title);
  copy.description = stringValue(data, section, "description", copy.description);
}

function applyActions(data: PlainConfigData, section: string, fallback: ConfigAction[]) {
  const parsed = compact(values(data, section).map(parseActionRecord));
  return parsed.length ? parsed : fallback;
}

function applyInfoCards(data: PlainConfigData, section: string, fallback: InfoCard[]) {
  const parsed = compact(values(data, section).map(parseInfoCardRecord));
  return parsed.length ? parsed : fallback;
}

function interpolateConfig(config: MalusConfig) {
  const tokens: Record<string, string> = {
    siteName: config.site.name,
    siteDescription: config.site.description,
    siteUrl: config.site.url,
    githubUrl: config.site.githubUrl,
    authorName: config.author.name,
    authorHandle: config.author.handle,
    avatarUrl: config.author.avatar
  };

  const interpolate = (input: unknown): unknown => {
    if (typeof input === "string") {
      return input.replace(/\{([a-zA-Z0-9]+)\}/g, (match, key) => tokens[key] ?? match);
    }
    if (Array.isArray(input)) return input.map(interpolate);
    if (input && typeof input === "object") {
      for (const [key, item] of Object.entries(input)) {
        (input as Record<string, unknown>)[key] = interpolate(item);
      }
    }
    return input;
  };

  return interpolate(config) as MalusConfig;
}

export function applyPlainConfig(defaultConfig: MalusConfig) {
  const data = readPlainConfig();
  const config = structuredClone(defaultConfig);

  config.site.name = stringValue(data, "site", "name", config.site.name);
  config.site.brandMark = stringValue(data, "site", "brandMark", config.site.brandMark);
  config.site.description = stringValue(data, "site", "description", config.site.description);
  config.site.url = stringValue(data, "site", "url", config.site.url);
  config.site.githubUrl = stringValue(data, "site", "githubUrl", config.site.githubUrl);
  config.site.launchedAt = stringValue(data, "site", "launchedAt", config.site.launchedAt);
  config.site.defaultLang = stringValue(data, "site", "defaultLang", config.site.defaultLang) === "en" ? "en" : "zh";
  config.site.supportedLangs = asLangList(listValue(data, "site", "supportedLangs", config.site.supportedLangs));

  config.author.name = stringValue(data, "author", "name", config.author.name);
  config.author.handle = stringValue(data, "author", "handle", config.author.handle);
  config.author.email = stringValue(data, "author", "email", config.author.email ?? "");
  config.author.avatar = stringValue(data, "author", "avatar", config.author.avatar);

  for (const key of featureKeys) {
    config.features[key] = booleanValue(data, "features", key, config.features[key]);
  }

  for (const key of pluginKeys) {
    config.plugins[key] = booleanValue(data, "plugins", key, config.plugins[key]);
  }

  const navItems = compact(values(data, "navigation.items").map(parseNavRecord));
  if (navItems.length) config.navigation.items = navItems;

  config.home.showFeaturedPost = booleanValue(data, "home", "showFeaturedPost", config.home.showFeaturedPost);
  config.home.showLiquidPanel = booleanValue(data, "home", "showLiquidPanel", config.home.showLiquidPanel);
  config.home.showStats = booleanValue(data, "home", "showStats", config.home.showStats);
  config.home.showGuideList = booleanValue(data, "home", "showGuideList", config.home.showGuideList);
  config.home.showProjectModules = booleanValue(data, "home", "showProjectModules", config.home.showProjectModules);
  config.home.showFriendEntry = booleanValue(data, "home", "showFriendEntry", config.home.showFriendEntry);
  config.home.showSponsorEntry = booleanValue(data, "home", "showSponsorEntry", config.home.showSponsorEntry);

  config.home.hero.kicker = stringValue(data, "home.hero", "kicker", config.home.hero.kicker);
  config.home.hero.title = stringValue(data, "home.hero", "title", config.home.hero.title);
  config.home.hero.description = stringValue(data, "home.hero", "description", config.home.hero.description);
  config.home.hero.avatarAlt = stringValue(data, "home.hero", "avatarAlt", config.home.hero.avatarAlt);
  config.home.hero.actions = applyActions(data, "home.hero.actions", config.home.hero.actions);

  config.home.featuredPost.label = stringValue(data, "home.featuredPost", "label", config.home.featuredPost.label);
  config.home.featuredPost.emptyTitle = stringValue(data, "home.featuredPost", "emptyTitle", config.home.featuredPost.emptyTitle);
  config.home.featuredPost.emptyDescription = stringValue(
    data,
    "home.featuredPost",
    "emptyDescription",
    config.home.featuredPost.emptyDescription
  );
  config.home.featuredPost.readAriaPrefix = stringValue(data, "home.featuredPost", "readAriaPrefix", config.home.featuredPost.readAriaPrefix);

  const liquidCards = compact(values(data, "home.liquidPanel.cards").map(parseLiquidCardRecord));
  if (liquidCards.length) config.home.liquidPanel.cards = liquidCards;

  config.home.stats.guides.label = stringValue(data, "home.stats.guides", "label", config.home.stats.guides.label);
  config.home.stats.guides.unit = stringValue(data, "home.stats.guides", "unit", config.home.stats.guides.unit);
  config.home.stats.tags.label = stringValue(data, "home.stats.tags", "label", config.home.stats.tags.label);
  config.home.stats.tags.unit = stringValue(data, "home.stats.tags", "unit", config.home.stats.tags.unit);
  config.home.stats.runtime.label = stringValue(data, "home.stats.runtime", "label", config.home.stats.runtime.label);
  config.home.stats.runtime.unit = stringValue(data, "home.stats.runtime", "unit", config.home.stats.runtime.unit);
  config.home.stats.latest.label = stringValue(data, "home.stats.latest", "label", config.home.stats.latest.label);
  config.home.stats.latest.unit = stringValue(data, "home.stats.latest", "unit", config.home.stats.latest.unit);
  config.home.stats.latest.emptyValue = stringValue(data, "home.stats.latest", "emptyValue", config.home.stats.latest.emptyValue);

  const quickLinks = compact(values(data, "home.quickLinks").map(parseQuickLinkRecord));
  if (quickLinks.length) config.home.quickLinks = quickLinks;

  config.home.guideSection.series = stringValue(data, "home.guideSection", "series", config.home.guideSection.series);
  config.home.guideSection.limit = numberValue(data, "home.guideSection", "limit", config.home.guideSection.limit);
  applySectionCopy(data, "home.guideSection", config.home.guideSection);

  config.home.projectSection.kicker = stringValue(data, "home.projectSection", "kicker", config.home.projectSection.kicker);
  config.home.projectSection.allLabel = stringValue(data, "home.projectSection", "allLabel", config.home.projectSection.allLabel);
  config.home.projectSection.featuredLabel = stringValue(data, "home.projectSection", "featuredLabel", config.home.projectSection.featuredLabel);
  config.home.projectSection.limit = numberValue(data, "home.projectSection", "limit", config.home.projectSection.limit);

  applyPageHero(data, "pages.about", config.pages.about);
  config.pages.about.cards = applyInfoCards(data, "pages.about.cards", config.pages.about.cards);

  applyPageHero(data, "pages.tools", config.pages.tools);
  config.pages.tools.cards = applyInfoCards(data, "pages.tools.cards", config.pages.tools.cards);

  applyPageHero(data, "pages.projects", config.pages.projects);
  config.pages.projects.emptyText = stringValue(data, "pages.projects", "emptyText", config.pages.projects.emptyText);
  applyPageHero(data, "pages.blogIndex", config.pages.blogIndex);
  config.pages.blogIndex.tagLimit = numberValue(data, "pages.blogIndex", "tagLimit", config.pages.blogIndex.tagLimit);
  config.pages.blogIndex.emptyText = stringValue(data, "pages.blogIndex", "emptyText", config.pages.blogIndex.emptyText);
  applyPageHero(data, "pages.archive", config.pages.archive);
  config.pages.archive.emptyText = stringValue(data, "pages.archive", "emptyText", config.pages.archive.emptyText);
  applyPageHero(data, "pages.tags", config.pages.tags);
  config.pages.tags.emptyText = stringValue(data, "pages.tags", "emptyText", config.pages.tags.emptyText);

  config.pages.tagDetail.titleTemplate = stringValue(data, "pages.tagDetail", "titleTemplate", config.pages.tagDetail.titleTemplate);
  config.pages.tagDetail.descriptionTemplate = stringValue(data, "pages.tagDetail", "descriptionTemplate", config.pages.tagDetail.descriptionTemplate);
  config.pages.tagDetail.kicker = stringValue(data, "pages.tagDetail", "kicker", config.pages.tagDetail.kicker);
  config.pages.tagDetail.countTemplate = stringValue(data, "pages.tagDetail", "countTemplate", config.pages.tagDetail.countTemplate);
  config.pages.tagDetail.emptyText = stringValue(data, "pages.tagDetail", "emptyText", config.pages.tagDetail.emptyText);

  applyPageHero(data, "pages.notFound", config.pages.notFound);
  config.pages.notFound.actions = applyActions(data, "pages.notFound.actions", config.pages.notFound.actions ?? []);
  applyPageHero(data, "pages.english", config.pages.english);
  config.pages.english.actions = applyActions(data, "pages.english.actions", config.pages.english.actions ?? []);
  applyPageHero(data, "pages.zhRedirect", config.pages.zhRedirect);
  config.pages.zhRedirect.linkLabel = stringValue(data, "pages.zhRedirect", "linkLabel", config.pages.zhRedirect.linkLabel);

  config.blog.basePath = stringValue(data, "blog", "basePath", config.blog.basePath);
  config.blog.postsPerPage = numberValue(data, "blog", "postsPerPage", config.blog.postsPerPage);
  config.blog.showReadingTime = booleanValue(data, "blog", "showReadingTime", config.blog.showReadingTime);
  config.blog.showUpdatedDate = booleanValue(data, "blog", "showUpdatedDate", config.blog.showUpdatedDate);
  config.blog.showToc = booleanValue(data, "blog", "showToc", config.blog.showToc);
  config.blog.showRelatedPosts = booleanValue(data, "blog", "showRelatedPosts", config.blog.showRelatedPosts);
  config.blog.showPreviousNext = booleanValue(data, "blog", "showPreviousNext", config.blog.showPreviousNext);
  config.blog.draftEnabled = booleanValue(data, "blog", "draftEnabled", config.blog.draftEnabled);

  config.friends.title = stringValue(data, "friends", "title", config.friends.title);
  config.friends.description = stringValue(data, "friends", "description", config.friends.description);
  config.friends.kicker = stringValue(data, "friends", "kicker", config.friends.kicker);
  config.friends.showApply = booleanValue(data, "friends", "showApply", config.friends.showApply);
  config.friends.actions = applyActions(data, "friends.actions", config.friends.actions);
  applySectionCopy(data, "friends.ownerSection", config.friends.ownerSection);
  applySectionCopy(data, "friends.listSection", config.friends.listSection);
  applySectionCopy(data, "friends.applySection", config.friends.applySection);
  const friendLinks = compact(values(data, "friends.links").map(parseFriendRecord));
  if (friendLinks.length) config.friends.links = friendLinks;
  config.friends.applyTemplate = values(data, "friends.applyTemplate", "line").join("\n") || config.friends.applyTemplate;

  const ownerName = value(data, "friends.owner", "name");
  if (ownerName) {
    config.friends.owner = {
      name: ownerName,
      description: stringValue(data, "friends.owner", "description", config.site.description),
      url: stringValue(data, "friends.owner", "url", config.site.url),
      avatar: value(data, "friends.owner", "avatar"),
      tags: splitList(stringValue(data, "friends.owner", "tags", "")),
      featured: booleanValue(data, "friends.owner", "featured", true)
    };
  }

  config.sponsor.title = stringValue(data, "sponsor", "title", config.sponsor.title);
  config.sponsor.description = stringValue(data, "sponsor", "description", config.sponsor.description);
  config.sponsor.kicker = stringValue(data, "sponsor", "kicker", config.sponsor.kicker);
  config.sponsor.actions = applyActions(data, "sponsor.actions", config.sponsor.actions);
  applySectionCopy(data, "sponsor.methodsSection", config.sponsor.methodsSection);
  applySectionCopy(data, "sponsor.thanksSection", config.sponsor.thanksSection);
  config.sponsor.linkLabel = stringValue(data, "sponsor", "linkLabel", config.sponsor.linkLabel);
  config.sponsor.qrAltSuffix = stringValue(data, "sponsor", "qrAltSuffix", config.sponsor.qrAltSuffix);
  const methods = compact(values(data, "sponsor.methods").map(parseSponsorMethodRecord));
  if (methods.length) config.sponsor.methods = methods;
  const thanks = compact(values(data, "sponsor.thanks").map(parseSponsorThanksRecord));
  if (thanks.length) config.sponsor.thanks = thanks;

  config.comments.provider = stringValue(data, "comments", "provider", config.comments.provider) === "none" ? "none" : "giscus";
  config.comments.enabled = booleanValue(data, "comments", "enabled", config.comments.enabled);
  config.comments.giscus.showSetup = booleanValue(data, "comments.giscus", "showSetup", config.comments.giscus.showSetup);
  config.comments.giscus.repo = stringValue(data, "comments.giscus", "repo", config.comments.giscus.repo);
  config.comments.giscus.repoId = stringValue(data, "comments.giscus", "repoId", config.comments.giscus.repoId);
  config.comments.giscus.category = stringValue(data, "comments.giscus", "category", config.comments.giscus.category);
  config.comments.giscus.categoryId = stringValue(data, "comments.giscus", "categoryId", config.comments.giscus.categoryId);
  config.comments.giscus.mapping = stringValue(data, "comments.giscus", "mapping", config.comments.giscus.mapping);
  config.comments.giscus.strict = stringValue(data, "comments.giscus", "strict", config.comments.giscus.strict);
  config.comments.giscus.reactionsEnabled = stringValue(data, "comments.giscus", "reactionsEnabled", config.comments.giscus.reactionsEnabled);
  config.comments.giscus.emitMetadata = stringValue(data, "comments.giscus", "emitMetadata", config.comments.giscus.emitMetadata);
  config.comments.giscus.inputPosition = stringValue(data, "comments.giscus", "inputPosition", config.comments.giscus.inputPosition);
  config.comments.giscus.lightTheme = stringValue(data, "comments.giscus", "lightTheme", config.comments.giscus.lightTheme);
  config.comments.giscus.darkTheme = stringValue(data, "comments.giscus", "darkTheme", config.comments.giscus.darkTheme);

  config.views.endpoint = stringValue(data, "views", "endpoint", config.views.endpoint);
  config.views.localFallback = booleanValue(data, "views", "localFallback", config.views.localFallback);

  const analyticsProvider = stringValue(data, "analytics", "provider", config.analytics.provider);
  config.analytics.provider = analyticsProvider === "umami" || analyticsProvider === "plausible" ? analyticsProvider : "none";
  config.analytics.enabled = booleanValue(data, "analytics", "enabled", config.analytics.enabled);
  config.analytics.scriptUrl = stringValue(data, "analytics", "scriptUrl", config.analytics.scriptUrl ?? "");
  config.analytics.websiteId = stringValue(data, "analytics", "websiteId", config.analytics.websiteId ?? "");
  config.analytics.domain = stringValue(data, "analytics", "domain", config.analytics.domain ?? "");

  return interpolateConfig(config);
}
