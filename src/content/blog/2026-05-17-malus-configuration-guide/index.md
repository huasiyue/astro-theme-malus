---
title: "Malus 配置项完整说明"
description: "说明站点信息、导航、友链、赞助、评论、浏览量和搜索相关配置应该放在哪里、怎么改。"
pubDate: 2026-05-17
updatedDate: 2026-05-17
lang: "zh"
tags:
  - Astro
  - 配置
  - 模板
category: "工程化"
series: "Malus 模板文档"
draft: false
featured: false
---

## 配置原则

Malus 把配置分成两类：

- 可以公开提交的模板默认值。
- 不应该提交的个人信息和部署信息。

公开默认值集中放在根目录的 `malus.config.conf`，例如站点结构、导航、功能开关、插件开关、友链示例和赞助示例。私人信息可以放在 `.env.local`、部署平台环境变量或 `public/local/` 里，例如真实赞赏码、真实头像、真实 giscus 配置。

这种分法适合模板项目：开源仓库保留完整结构，使用者只需要覆盖自己的信息。

## 配置中心

核心配置在：

```text
malus.config.conf
```

常用分区包括：

```text
site
author
features
plugins
navigation
home
pages
blog
friends
sponsor
comments
views
analytics
```

`src/config/*.ts` 仍然存在，但它们只是内部读取层。模板使用者通常只需要编辑 `malus.config.conf`。

## 站点基本信息

站点基本信息在 `[site]` 和 `[author]`：

```ini
[site]
name = Malus
brandMark = M
description = A refined Astro blog template.
url = https://example.com
githubUrl = https://github.com/huasiyue/astro-theme-malus

[author]
name = Malus Theme
handle = malus-theme
avatar = /images/avatar-default.png
```

这些值会影响首页、导航、页脚、SEO、RSS、Sitemap 和结构化数据。

真实头像建议放到 `public/local/`，然后把 `avatar` 改成 `/local/avatar-square.jpg`。`public/local/` 默认不提交，适合保存私人图片。

## 功能开关

功能开关在 `features`。常用项如下：

```ini
[features]
search = true
github = true
rss = true
themeSwitch = true
languageSwitch = true
comments = true
views = true
friends = true
sponsor = true
projects = true
tools = true
imageLightbox = true
codeCopy = true
runtime = true
```

关闭功能后，导航、首页入口、页脚入口和相关组件会自动隐藏。例如 `sponsor = false` 后，赞助导航、首页赞助入口和页脚赞助入口都会隐藏。

## 插件开关

插件支持在 `plugins`：

```ini
[plugins]
pagefind = true
giscus = true
cloudflareViews = true
mdx = true
rss = true
sitemap = true
mermaid = false
katex = false
analytics = false
```

`mermaid`、`katex` 和 `analytics` 目前是预留开关。打开它们之前，还需要补对应依赖和组件实现。

`pagefind`、`rss`、`sitemap`、`giscus` 和 `cloudflareViews` 已经接入到模板逻辑。关闭后，对应入口、组件或输出会隐藏；如果要彻底移除依赖，可以再清理 `package.json` 和 `astro.config.mjs`。

## 导航配置

导航在 `[navigation.items]`。每行字段顺序是：

```text
链接 | 中文名称 | 英文名称 | 是否显示 | 关联功能 | 关联插件
```

示例：

```ini
[navigation.items]
item = /zh/blog/ | 教程 | Guides | true
item = /zh/archive/ | 归档 | Archive | true
item = /zh/tags/ | 标签 | Tags | true
item = /projects/ | 项目 | Projects | true | projects
item = /tools/ | 工具 | Tools | true | tools
item = /friends/ | 友链 | Friends | true | friends
item = /sponsor/ | 赞助 | Sponsor | true | sponsor
item = /about/ | 关于 | About | true
```

第四个字段控制单个导航是否显示。第五个字段是关联功能，功能关闭后导航会自动隐藏。第六个字段是关联插件，插件关闭后导航也会自动隐藏。

只隐藏某个导航时，把第四个字段改成 `false`：

```ini
item = /projects/ | 项目 | Projects | false | projects
```

关闭整个功能时，改 `[features]`：

```ini
[features]
projects = false
```

这样项目导航、首页项目模块入口和相关入口会一起收起。

## 首页配置

首页本身不会关闭，但首页内容都在 `home` 中配置：

```ini
[home]
showFeaturedPost = true
showLiquidPanel = true
showStats = true
showGuideList = true
showProjectModules = true
showFriendEntry = true
showSponsorEntry = true

[home.hero]
kicker = 垂丝海棠模板 / Astro Theme
title = {siteName}
description = 首页介绍文案
```

如果只想保留极简首页，可以把 `showLiquidPanel`、`showStats`、`showGuideList`、`showProjectModules` 改成 `false`。如果只是改文案，修改 `[home.hero]`、`[home.featuredPost]`、`[home.stats.*]`、`[home.guideSection]` 和 `[home.projectSection]` 即可。

首页按钮在 `[home.hero.actions]`。字段顺序是：

```text
文字 | 链接 | 图标 | primary/secondary | 是否显示 | 关联功能 | 关联插件
```

首页快捷入口在 `[home.quickLinks]`。字段顺序是：

```text
文字 | 链接 | 图标 | 是否显示 | 关联功能 | 关联插件
```

示例：

```ini
[home.quickLinks]
item = RSS | /rss.xml | rss | true | rss | rss
```

当 `[features]` 里的 `rss` 或 `[plugins]` 里的 `rss` 为 `false` 时，这个入口会自动隐藏。

## 页面文案配置

固定页面的标题、描述、首屏文案和卡片在 `[pages.*]`：

```ini
[pages.about]
title = 关于
description = 关于站点的 SEO 描述
kicker = About
heading = 关于 Malus
body = 关于页首屏介绍

[pages.tools]
title = 工具
description = 工具页 SEO 描述
kicker = Tools
heading = 工具
body = 工具页首屏介绍
```

已经接入配置的页面包括 `about`、`tools`、`projects`、`blogIndex`、`archive`、`tags`、`tagDetail`、`notFound`、`english` 和 `zhRedirect`。工具页卡片在 `[pages.tools.cards]`，字段顺序是：

```text
图标 | 标题 | 描述 | 链接 | 是否显示 | 关联功能 | 关联插件
```

## 内容集合配置

内容 schema 在：

```text
src/content.config.ts
```

博客教程使用 `blog` 集合，项目卡片使用 `projects` 集合。`draft: true` 的内容不会出现在公开页面、RSS 和搜索索引里。

常用文章 frontmatter：

```yaml
---
title: "教程标题"
description: "教程摘要"
pubDate: 2026-05-17
updatedDate: 2026-05-17
lang: "zh"
tags:
  - Astro
  - 模板
category: "工程化"
series: "Malus 模板文档"
draft: false
featured: false
---
```

## 友链配置

友链配置在 `[friends]`、`[friends.links]` 和 `[friends.applyTemplate]`：

```ini
[friends]
title = 友链
description = 放置常访问的站点、作品与社区链接。
kicker = Friends
showApply = true

[friends.links]
item = 站点名称 | 一句话介绍这个站点 | https://example.com | /images/friends/example.png | Astro, Blog | false

[friends.applyTemplate]
line = 站点名称：{siteName}
line = 站点地址：{siteUrl}
```

如果要关闭友链入口，设置 `[features]` 里的 `friends = false`。如果只是隐藏申请格式，设置 `[friends]` 里的 `showApply = false`。

头像可以省略。省略后页面会显示名称首字母。

## 赞助配置

赞助配置在 `[sponsor]`、`[sponsor.methods]` 和 `[sponsor.thanks]`。如果要关闭赞助入口，设置 `[features]` 里的 `sponsor = false`。

页面标题、按钮、区块标题、赞助方式和感谢名单都可以在这里改：

```ini
[sponsor]
title = 赞助 {siteName}
description = 放置赞赏码、长期赞助链接与感谢名单。
kicker = Sponsor
linkLabel = 打开赞助链接
qrAltSuffix = 二维码
```

赞助方式支持二维码和链接：

```ini
[sponsor.methods]
item = 微信赞赏 | 感谢支持模板维护。 | | /local/sponsor-wechat.png | 微信赞赏
item = GitHub Sponsors | 长期支持模板开发。 | https://github.com/sponsors/your-name | | 长期赞助

[sponsor.thanks]
item = 支持者名称 | 感谢支持和反馈。 | 2026-05-17
```

真实二维码建议放在 `public/local/`，避免提交到公开仓库。

## 评论配置

评论使用 giscus，配置项在 `.env.local` 或部署环境变量中：

```bash
PUBLIC_GISCUS_ENABLED="true"
PUBLIC_GISCUS_REPO="owner/repo"
PUBLIC_GISCUS_REPO_ID="your repo id"
PUBLIC_GISCUS_CATEGORY="General"
PUBLIC_GISCUS_CATEGORY_ID="your category id"
```

如果没有填完整，开发环境会显示配置提示，生产环境默认隐藏未配置提示。

## 浏览量配置

浏览量组件默认请求：

```text
/api/views
```

生产环境可以使用 Cloudflare Pages Functions + D1。D1 绑定名是：

```text
BLOG_VIEWS_DB
```

本地开发和静态预览时，组件会退回到浏览器本地计数，只用于看 UI。

## 搜索配置

搜索使用 Pagefind。开发服务器不会生成搜索索引，完整搜索体验需要：

```bash
npm run build
npm run preview
```

构建后索引位于：

```text
dist/pagefind
```

搜索弹窗会动态加载 `/pagefind/pagefind.js`。

## 配置检查清单

上线前建议逐项确认：

- `[site]` 里的 `url` 是真实域名。
- `[site]` 里的 `githubUrl` 是真实仓库或主页。
- `[author]` 里的 `avatar` 可以访问。
- 友链不再使用示例站点。
- 赞助方式不再使用占位图。
- giscus 配置完整，或者明确关闭。
- 浏览量 D1 已绑定，或者接受本地 fallback。
- `npm run build` 可以通过。
