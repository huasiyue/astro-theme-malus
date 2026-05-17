import { defineMalusConfig } from "@/config/defineConfig";
import { applyPlainConfig } from "@/config/plainConfig";

const defaultAvatarUrl = "/images/avatar-default.png";
const avatarUrl = import.meta.env.PUBLIC_AVATAR_URL?.trim() || defaultAvatarUrl;
const siteName = import.meta.env.PUBLIC_SITE_NAME?.trim() || "Malus";
const brandMark = import.meta.env.PUBLIC_BRAND_MARK?.trim() || "M";
const siteDescription =
  import.meta.env.PUBLIC_SITE_DESCRIPTION?.trim() ||
  "A refined Astro blog template inspired by Malus halliana.";
const siteUrl = import.meta.env.PUBLIC_SITE_URL?.trim() || "https://example.com";
const githubUrl = import.meta.env.PUBLIC_GITHUB_URL?.trim() || "https://github.com/huasiyue/astro-theme-malus";
const authorName = import.meta.env.PUBLIC_AUTHOR_NAME?.trim() || "Malus Theme";
const authorHandle = import.meta.env.PUBLIC_AUTHOR_HANDLE?.trim() || "malus-theme";
const launchedAt = import.meta.env.PUBLIC_LAUNCHED_AT?.trim() || "2026-05-15T00:00:00+08:00";
const giscusRepo = import.meta.env.PUBLIC_GISCUS_REPO?.trim() || "";
const giscusRepoId = import.meta.env.PUBLIC_GISCUS_REPO_ID?.trim() || "";
const giscusCategory = import.meta.env.PUBLIC_GISCUS_CATEGORY?.trim() || "General";
const giscusCategoryId = import.meta.env.PUBLIC_GISCUS_CATEGORY_ID?.trim() || "";
const giscusEnabled = import.meta.env.PUBLIC_GISCUS_ENABLED !== "false";

const defaultMalusConfig = defineMalusConfig({
  site: {
    name: siteName,
    brandMark,
    description: siteDescription,
    url: siteUrl,
    githubUrl,
    launchedAt,
    defaultLang: "zh",
    supportedLangs: ["zh", "en"]
  },
  author: {
    name: authorName,
    handle: authorHandle,
    email: "",
    avatar: avatarUrl
  },
  features: {
    search: true,
    github: true,
    rss: true,
    themeSwitch: true,
    languageSwitch: true,
    comments: true,
    views: true,
    friends: true,
    sponsor: true,
    projects: true,
    tools: true,
    imageLightbox: true,
    codeCopy: true,
    runtime: true
  },
  plugins: {
    pagefind: true,
    giscus: true,
    cloudflareViews: true,
    mdx: true,
    rss: true,
    sitemap: true,
    mermaid: false,
    katex: false,
    analytics: false
  },
  navigation: {
    items: [
      { enabled: true, href: "/zh/blog/", label: { zh: "文章", en: "Posts" } },
      { enabled: true, href: "/zh/archive/", label: { zh: "归档", en: "Archive" } },
      { enabled: true, href: "/zh/tags/", label: { zh: "标签", en: "Tags" } },
      { enabled: true, href: "/projects/", label: { zh: "项目", en: "Projects" }, feature: "projects" },
      { enabled: true, href: "/tools/", label: { zh: "工具", en: "Tools" }, feature: "tools" },
      { enabled: true, href: "/friends/", label: { zh: "友链", en: "Friends" }, feature: "friends" },
      { enabled: true, href: "/sponsor/", label: { zh: "赞助", en: "Sponsor" }, feature: "sponsor" },
      { enabled: true, href: "/about/", label: { zh: "关于", en: "About" } }
    ]
  },
  home: {
    showFeaturedPost: true,
    showLiquidPanel: true,
    showStats: true,
    showGuideList: true,
    showProjectModules: true,
    showFriendEntry: true,
    showSponsorEntry: true,
    hero: {
      kicker: "垂丝海棠模板 / Astro Theme",
      title: siteName,
      description:
        "一套可以发布模板、也可以长期写作的 Astro 静态博客：首页展示设计思路、文章入口、友链和赞助，文章页承载教程与真实博客内容。",
      avatarAlt: `${authorName} avatar`,
      actions: [
        { label: "阅读文章", href: "/zh/blog/", icon: "arrow-right", variant: "primary" },
        { label: "友链与赞助", href: "/friends/", icon: "heart", variant: "secondary", feature: "friends" }
      ]
    },
    featuredPost: {
      label: "Featured",
      emptyTitle: "文章正在准备中",
      emptyDescription: "这里会展示配置中的精选内容入口。",
      readAriaPrefix: "阅读"
    },
    liquidPanel: {
      cards: [
        { label: "Writing", title: "Markdown / MDX" },
        { label: "Projects", title: "Astro / TypeScript" },
        { label: "Tools", title: "Theme / RSS / Search" }
      ]
    },
    stats: {
      guides: { label: "公开文章", unit: "篇内容" },
      tags: { label: "内容标签", unit: "个主题" },
      runtime: { label: "模板运行", unit: "本地预览" },
      latest: { label: "最近更新", unit: "Latest", emptyValue: "准备中" }
    },
    quickLinks: [
      { enabled: true, label: "工具", href: "/tools/", icon: "grid", feature: "tools" },
      { enabled: true, label: "RSS", href: "/rss.xml", icon: "rss", feature: "rss", plugin: "rss" },
      { enabled: true, label: "标签", href: "/zh/tags/", icon: "tag" },
      { enabled: true, label: "友链", href: "/friends/", icon: "users", feature: "friends" },
      { enabled: true, label: "赞助", href: "/sponsor/", icon: "heart", feature: "sponsor" }
    ],
    guideSection: {
      series: "Malus 模板文档",
      limit: 6,
      kicker: "Template Guide",
      title: "文章与教程路线",
      description: "默认收录模板设计、使用、配置、部署和定制教程；作为个人博客后，也可以继续展示真实写作内容。"
    },
    projectSection: {
      kicker: "Template Modules",
      allLabel: "全部模块",
      featuredLabel: "Featured",
      limit: 3
    }
  },
  pages: {
    about: {
      title: "关于",
      description: `关于 ${siteName} Astro 内容模板。`,
      kicker: "About",
      heading: `关于 ${siteName}`,
      body: `${siteName} 是一套以垂丝海棠为视觉线索的 Astro 静态博客模板，可以先作为模板仓库发布到 GitHub，也可以直接作为个人博客长期写作。`,
      cards: [
        {
          enabled: true,
          icon: "book",
          title: "模板定位",
          description: "默认提供文章、标签、归档、项目、工具、友链、赞助、搜索、RSS、主题切换和评论预留。"
        },
        {
          enabled: true,
          icon: "folder",
          title: "内容维护",
          description: "内容通过 Markdown / MDX 和配置文件维护，站点信息、页面文案和公共模块都能快速替换。"
        }
      ]
    },
    tools: {
      title: "工具",
      description: `${siteName} 的模板工具和扩展入口。`,
      kicker: "Tools",
      heading: "工具",
      body: "工具页收纳站内常用入口和后续扩展能力。",
      cards: [
        {
          enabled: true,
          icon: "tag",
          title: "标签索引",
          description: "从标签重新组织文章主题。",
          href: "/zh/tags/"
        },
        {
          enabled: true,
          icon: "archive",
          title: "时间归档",
          description: "按年份展示内容沉淀。",
          href: "/zh/archive/"
        },
        {
          enabled: true,
          icon: "rss",
          title: "RSS 订阅",
          description: "把站点更新接入阅读器。",
          href: "/rss.xml",
          feature: "rss",
          plugin: "rss"
        },
        {
          enabled: true,
          icon: "users",
          title: "友链",
          description: "维护站点伙伴和社区入口。",
          href: "/friends/",
          feature: "friends"
        },
        {
          enabled: true,
          icon: "heart",
          title: "赞助",
          description: "展示支持方式和感谢名单。",
          href: "/sponsor/",
          feature: "sponsor"
        }
      ]
    },
    projects: {
      title: "项目",
      description: `${siteName} 的项目模块展示入口。`,
      kicker: "Projects",
      heading: "项目",
      body: "这里展示项目卡片结构，可用于作品集、产品模块、案例展示或工具说明。",
      emptyText: "暂无公开项目。"
    },
    blogIndex: {
      title: "文章",
      description: `${siteName} 的中文文章列表。`,
      kicker: "Posts",
      heading: "文章",
      body: `这里默认收录 ${siteName} 的设计理念、使用方式、配置、部署和自定义教程；作为个人博客使用时，也会展示你新增的 Markdown / MDX 文章。`,
      tagLimit: 8,
      emptyText: "暂无公开文章。"
    },
    archive: {
      title: "归档",
      description: `${siteName} 的文章时间归档。`,
      kicker: "Archive",
      heading: "归档",
      body: "按年份组织所有公开文章，方便回看写作轨迹。",
      emptyText: "暂无公开文章。"
    },
    tags: {
      title: "标签",
      description: `${siteName} 的文章标签索引。`,
      kicker: "Tags",
      heading: "标签",
      body: "标签帮助内容形成多条入口：技术栈、写作主题、设计系统和项目模块都会在这里交叉。",
      emptyText: "暂无标签。"
    },
    tagDetail: {
      titleTemplate: "标签：{tag}",
      descriptionTemplate: `${siteName} 中带有 {tag} 标签的文章。`,
      kicker: "Tag",
      countTemplate: "共 {count} 篇文章。",
      emptyText: "这个标签下暂无公开文章。"
    },
    notFound: {
      title: "页面未找到",
      description: "这个页面不存在或已经移动。",
      kicker: "404",
      heading: "页面未找到",
      body: "这个地址暂时没有内容。可以回到首页，或者从文章列表重新开始。",
      actions: [
        { label: "回到首页", href: "/", icon: "arrow-right", variant: "primary" },
        { label: "文章列表", href: "/zh/blog/", icon: "book", variant: "secondary" }
      ]
    },
    english: {
      title: "English content coming soon",
      description: `${siteName} keeps fixed interface text bilingual, while long-form content stays Chinese-first by default.`,
      kicker: "English",
      heading: "English support is lightweight",
      body: `${siteName} translates fixed interface text such as navigation, search, theme controls, comments, and reading actions. Long-form pages and posts stay Chinese-first unless a specific English version is needed.`,
      actions: [
        { label: "Back to Chinese home", href: "/", icon: "arrow-right", variant: "primary" },
        { label: "Browse posts", href: "/zh/blog/", icon: "grid", variant: "secondary" }
      ]
    },
    zhRedirect: {
      title: "中文首页",
      description: `正在前往 ${siteName} 首页。`,
      kicker: "Redirect",
      heading: "正在前往首页",
      body: "如果页面没有自动跳转，可以返回首页继续阅读。",
      linkLabel: "返回首页"
    }
  },
  blog: {
    basePath: "/zh/blog",
    postsPerPage: 9,
    showReadingTime: true,
    showUpdatedDate: true,
    showToc: true,
    showRelatedPosts: true,
    showPreviousNext: true,
    draftEnabled: true
  },
  friends: {
    title: "友链",
    description: "放置常访问的站点、作品与社区链接。",
    kicker: "Friends",
    actions: [
      { label: "查看友链", href: "#friend-list", icon: "users", variant: "primary" },
      { label: "申请格式", href: "#friend-apply", icon: "link", variant: "secondary" }
    ],
    ownerSection: {
      kicker: "Site Card",
      title: "本站信息",
      description: "用于交换友链时复制站点信息。"
    },
    listSection: {
      kicker: "Directory",
      title: "友链列表",
      description: "按配置文件维护的站点列表。"
    },
    applySection: {
      kicker: "Apply",
      title: "友链申请格式",
      description: "复制下方格式，通过你选择的渠道发送即可。"
    },
    showApply: true,
    links: [
      {
        name: "Astro",
        description: "静态优先的现代 Web 框架。",
        url: "https://astro.build/",
        tags: ["Framework", "Static"]
      },
      {
        name: "Pagefind",
        description: "静态站点全文搜索方案，适合内容模板和个人博客。",
        url: "https://pagefind.app/",
        tags: ["Search", "Static"]
      },
      {
        name: "giscus",
        description: "基于 GitHub Discussions 的轻量评论系统。",
        url: "https://giscus.app/",
        tags: ["Comments", "GitHub"]
      }
    ],
    applyTemplate: `站点名称：${siteName}
站点地址：${siteUrl}
站点描述：${siteDescription}
头像地址：${siteUrl}/images/avatar.png
主要标签：Astro / Blog / Template`
  },
  sponsor: {
    title: `赞助 ${siteName}`,
    description: "放置赞赏码、长期赞助链接与感谢名单。",
    kicker: "Sponsor",
    actions: [
      { label: "支持模板", href: "#sponsor-methods", icon: "heart", variant: "primary" },
      { label: "感谢名单", href: "#sponsor-thanks", icon: "coffee", variant: "secondary" }
    ],
    methodsSection: {
      kicker: "Methods",
      title: "赞助方式",
      description: "可选的支持方式。"
    },
    thanksSection: {
      kicker: "Thanks",
      title: "感谢名单",
      description: "记录支持、反馈和共建。"
    },
    linkLabel: "打开赞助链接",
    qrAltSuffix: "二维码",
    methods: [
      {
        name: "微信赞赏",
        description: "适合放置微信赞赏码。",
        image: "/images/sponsor-placeholder.svg",
        note: "示例"
      },
      {
        name: "爱发电 / GitHub Sponsors",
        description: "适合放长期赞助链接、会员页或 GitHub Sponsors 主页。",
        url: "https://example.com",
        note: "链接"
      }
    ],
    thanks: [
      {
        name: `${siteName} Supporter`,
        message: "感谢每一次下载、使用、反馈和二次创作。"
      }
    ]
  },
  comments: {
    provider: "giscus",
    enabled: giscusEnabled,
    giscus: {
      showSetup: import.meta.env.PUBLIC_GISCUS_SHOW_SETUP === "true" || import.meta.env.DEV,
      repo: giscusRepo,
      repoId: giscusRepoId,
      category: giscusCategory,
      categoryId: giscusCategoryId,
      mapping: import.meta.env.PUBLIC_GISCUS_MAPPING?.trim() || "pathname",
      strict: import.meta.env.PUBLIC_GISCUS_STRICT?.trim() || "0",
      reactionsEnabled: import.meta.env.PUBLIC_GISCUS_REACTIONS_ENABLED?.trim() || "1",
      emitMetadata: import.meta.env.PUBLIC_GISCUS_EMIT_METADATA?.trim() || "0",
      inputPosition: import.meta.env.PUBLIC_GISCUS_INPUT_POSITION?.trim() || "bottom",
      lightTheme: import.meta.env.PUBLIC_GISCUS_LIGHT_THEME?.trim() || "noborder_light",
      darkTheme: import.meta.env.PUBLIC_GISCUS_DARK_THEME?.trim() || "noborder_dark"
    }
  },
  views: {
    endpoint: import.meta.env.PUBLIC_VIEW_COUNTER_ENDPOINT?.trim() || "/api/views",
    localFallback: import.meta.env.PUBLIC_VIEW_COUNTER_LOCAL_FALLBACK !== "false"
  },
  analytics: {
    provider: "none",
    enabled: false
  }
});

export const malusConfig = applyPlainConfig(defaultMalusConfig);
