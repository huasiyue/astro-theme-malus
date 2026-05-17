export type Lang = "zh" | "en";

export type LocalizedText = Record<Lang, string>;

export type IconName =
  | "github"
  | "globe"
  | "sun"
  | "moon"
  | "system"
  | "arrow-right"
  | "chevron-right"
  | "search"
  | "copy"
  | "check"
  | "eye"
  | "close"
  | "tag"
  | "calendar"
  | "clock"
  | "spark"
  | "grid"
  | "archive"
  | "book"
  | "folder"
  | "rss"
  | "heart"
  | "link"
  | "external"
  | "users"
  | "rocket"
  | "settings"
  | "palette"
  | "coffee";

export type FeatureKey =
  | "search"
  | "github"
  | "rss"
  | "themeSwitch"
  | "languageSwitch"
  | "comments"
  | "views"
  | "friends"
  | "sponsor"
  | "projects"
  | "tools"
  | "imageLightbox"
  | "codeCopy"
  | "runtime";

export type PluginKey =
  | "pagefind"
  | "giscus"
  | "cloudflareViews"
  | "mdx"
  | "rss"
  | "sitemap"
  | "mermaid"
  | "katex"
  | "analytics";

export interface ConfigGate {
  enabled?: boolean;
  feature?: FeatureKey;
  plugin?: PluginKey;
}

export interface NavItem extends ConfigGate {
  href: string;
  label: LocalizedText;
}

export interface ConfigAction extends ConfigGate {
  label: string;
  href: string;
  icon?: IconName;
  variant?: "primary" | "secondary";
}

export interface SectionCopy {
  kicker: string;
  title: string;
  description: string;
}

export interface PageHeroConfig {
  title: string;
  description: string;
  kicker: string;
  heading: string;
  body: string;
  actions?: ConfigAction[];
}

export interface InfoCard extends ConfigGate {
  icon: IconName;
  title: string;
  description: string;
  href?: string;
}

export interface HomeLiquidCard {
  label: string;
  title: string;
}

export interface HomeQuickLink extends ConfigGate {
  label: string;
  href: string;
  icon: IconName;
}

export interface HomeStatText {
  label: string;
  unit: string;
}

export interface HomeConfig {
  showFeaturedPost: boolean;
  showLiquidPanel: boolean;
  showStats: boolean;
  showGuideList: boolean;
  showProjectModules: boolean;
  showFriendEntry: boolean;
  showSponsorEntry: boolean;
  hero: {
    kicker: string;
    title: string;
    description: string;
    avatarAlt: string;
    actions: ConfigAction[];
  };
  featuredPost: {
    label: string;
    emptyTitle: string;
    emptyDescription: string;
    readAriaPrefix: string;
  };
  liquidPanel: {
    cards: HomeLiquidCard[];
  };
  stats: {
    guides: HomeStatText;
    tags: HomeStatText;
    runtime: HomeStatText;
    latest: HomeStatText & {
      emptyValue: string;
    };
  };
  quickLinks: HomeQuickLink[];
  guideSection: SectionCopy & {
    series: string;
    limit: number;
  };
  projectSection: {
    kicker: string;
    allLabel: string;
    featuredLabel: string;
    limit: number;
  };
}

export interface PagesConfig {
  about: PageHeroConfig & {
    cards: InfoCard[];
  };
  tools: PageHeroConfig & {
    cards: InfoCard[];
  };
  projects: PageHeroConfig & {
    emptyText: string;
  };
  blogIndex: PageHeroConfig & {
    tagLimit: number;
    emptyText: string;
  };
  archive: PageHeroConfig & {
    emptyText: string;
  };
  tags: PageHeroConfig & {
    emptyText: string;
  };
  tagDetail: {
    titleTemplate: string;
    descriptionTemplate: string;
    kicker: string;
    countTemplate: string;
    emptyText: string;
  };
  notFound: PageHeroConfig;
  english: PageHeroConfig;
  zhRedirect: PageHeroConfig & {
    linkLabel: string;
  };
}

export interface FriendLink {
  name: string;
  description: string;
  url: string;
  avatar?: string;
  tags?: string[];
  featured?: boolean;
}

export interface SponsorMethod {
  name: string;
  description: string;
  url?: string;
  image?: string;
  note?: string;
}

export interface SponsorThanks {
  name: string;
  message: string;
  date?: string;
}

export interface MalusConfig {
  site: {
    name: string;
    brandMark: string;
    description: string;
    url: string;
    githubUrl: string;
    launchedAt: string;
    defaultLang: Lang;
    supportedLangs: readonly Lang[];
  };
  author: {
    name: string;
    handle: string;
    email?: string;
    avatar: string;
  };
  features: Record<FeatureKey, boolean>;
  plugins: Record<PluginKey, boolean>;
  navigation: {
    items: NavItem[];
  };
  home: HomeConfig;
  pages: PagesConfig;
  blog: {
    basePath: string;
    postsPerPage: number;
    showReadingTime: boolean;
    showUpdatedDate: boolean;
    showToc: boolean;
    showRelatedPosts: boolean;
    showPreviousNext: boolean;
    draftEnabled: boolean;
  };
  friends: {
    title: string;
    description: string;
    kicker: string;
    actions: ConfigAction[];
    ownerSection: SectionCopy;
    listSection: SectionCopy;
    applySection: SectionCopy;
    showApply: boolean;
    owner?: FriendLink;
    links: FriendLink[];
    applyTemplate: string;
  };
  sponsor: {
    title: string;
    description: string;
    kicker: string;
    actions: ConfigAction[];
    methodsSection: SectionCopy;
    thanksSection: SectionCopy;
    linkLabel: string;
    qrAltSuffix: string;
    methods: SponsorMethod[];
    thanks: SponsorThanks[];
  };
  comments: {
    provider: "giscus" | "none";
    enabled: boolean;
    giscus: {
      showSetup: boolean;
      repo: string;
      repoId: string;
      category: string;
      categoryId: string;
      mapping: string;
      strict: string;
      reactionsEnabled: string;
      emitMetadata: string;
      inputPosition: string;
      lightTheme: string;
      darkTheme: string;
    };
  };
  views: {
    endpoint: string;
    localFallback: boolean;
  };
  analytics: {
    provider: "none" | "umami" | "plausible";
    enabled: boolean;
    scriptUrl?: string;
    websiteId?: string;
    domain?: string;
  };
}

export function defineMalusConfig(config: MalusConfig) {
  return config;
}
