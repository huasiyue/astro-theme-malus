<h1 align="center">Malus</h1>

<p align="center">
  <img src="./public/images/avatar-default.png" width="96" height="96" alt="Malus logo" />
</p>

<p align="center">
  垂丝海棠主题 · Astro 静态博客模板
</p>

<p align="center">
  <strong>博客文章</strong> · <strong>项目展示</strong> · <strong>友链</strong> · <strong>赞助</strong> · <strong>搜索</strong> · <strong>RSS</strong> · <strong>主题切换</strong>
</p>

Malus 是一个基于 Astro 的静态博客模板，中文视觉名为“垂丝海棠主题”。它把模板文档、个人写作、项目展示、友链和赞助放在同一套 Markdown / MDX 工作流里，适合先作为模板仓库发布到 GitHub，也适合 fork / 克隆后直接作为自己的个人博客继续写作。

这个仓库可以先作为模板发布到 GitHub，后续也可以 fork / 克隆后直接作为自己的个人博客继续写作。当前默认内容用于说明模板设计、配置和使用方式；正式使用时，可以保留这些教程，也可以替换或新增日常博客文章。默认视觉取自垂丝海棠：花瓣白、海棠粉、嫩叶绿和低饱和枝色；玻璃质感只用于导航、首页卡片、搜索弹窗和评论区外壳，正文区域保持高对比、实底阅读面。

## 技术栈

- Astro 6.3.x
- TypeScript strict
- Markdown / MDX
- Content Collections
- Tailwind CSS 4
- Pagefind 搜索
- RSS / Sitemap / robots.txt
- Cloudflare Pages Functions 预留
- Cloudflare D1 浏览量计数预留
- 静态友链页
- 静态赞助页

## 配置

主要配置在根目录的 `malus.config.conf`。站点信息、导航显隐、功能开关、插件开关、首页文案、首页模块、页面标题描述、友链、赞助、评论、浏览量和统计都从这里读取。

`src/config/*.ts` 是内部读取层，不需要普通使用者编辑。私人或部署相关信息也可以继续写到 `.env.local` 或部署平台环境变量里，不要硬编码真实 token 或私人二维码到源码。

`malus.config.conf` 的写法是普通文本：

```ini
[site]
name = Malus
brandMark = M
description = A refined Astro blog template inspired by Malus halliana.
url = https://example.com
githubUrl = https://github.com/huasiyue/astro-theme-malus

[features]
search = true
friends = true
sponsor = true
projects = true
tools = true

[navigation.items]
item = /projects/ | 项目 | Projects | true | projects
```

- `site.url` 用于 RSS、Sitemap、canonical URL 和结构化数据。
- `site.name` 会影响站点名、首页标题、SEO 和 RSS；`site.brandMark` 控制顶部左侧的短标识。
- 默认头像放在 `public/images/avatar-default.png`。
- 私人头像、私有图片或本地覆盖资源建议放在 `public/local/`，这个目录不会提交。

常用结构：

```text
[navigation.items]      顶部导航，支持显示开关和功能联动
[home.hero]             首页标题、说明和按钮
[home.quickLinks]       首页快捷入口
[home.guideSection]     首页文章路线区
[pages.about]           关于页标题、描述和卡片
[pages.tools]           工具页卡片
[friends.links]         友链列表
[sponsor.methods]       赞助方式
[features]              功能开关
[plugins]               插件开关
```

首页不能整体关闭，但首页上的标题、介绍、按钮、精选文章、动态面板、统计卡片、快捷入口、文章路线区和模块区都可以在 `home` 分区中修改或隐藏。其他导航项可以把对应 `item` 的第四个字段改成 `false` 单独隐藏，也可以通过 `[features]` 里的 `projects = false` 这类功能开关联动隐藏。

## 国际化策略

Malus 采用轻量国际化：固定界面文案支持中文和英文，长内容默认中文，不强制每篇文章或每个页面都翻译。

需要国际化的内容：

- 导航栏、搜索弹窗、主题切换、RSS、复制代码、浏览量和评论提示。
- 文章页固定操作，例如目录、上一篇、下一篇、继续阅读。
- 404、英文占位页等少量系统页面。

不强制国际化的内容：

- 首页大段介绍，默认写在 `malus.config.conf` 的 `home` 中。
- 关于页正文，默认写在 `malus.config.conf` 的 `[pages.about]` 中。
- 文章正文。
- 项目说明。
- 工具页说明。

当前语言切换规则：

- 中文页面点击 `EN` 进入 `/en/` 英文说明页。
- 英文页面点击 `中文` 返回 `/`。
- 没有英文版本的文章不做逐篇跳转，避免跳到不存在的内容。

固定 UI 文案集中在 `src/i18n/ui.ts`。文章和项目继续通过 frontmatter 的 `lang` 字段标记语言，默认使用 `zh`。

## 常用命令

```bash
npm install
npm run dev
npm run build
npm run preview
npm run new:post -- "文章标题" --slug=article-slug
```

说明：

- `npm run dev` 用于本地开发。
- `npm run build` 会执行 `astro check`、`astro build`，并生成 Pagefind 搜索索引到 `dist/pagefind`。
- `npm run preview` 用于预览构建后的静态站点。
- 搜索功能需要先运行 `npm run build`，因为开发服务器不会生成 `/pagefind/pagefind.js`。

## 内容结构

博客文章放在 `src/content/blog`。当前默认内容以模板文档为主，例如设计理念、使用指南、配置说明、部署指南和自定义教程；把 Malus 当作个人博客使用时，也可以继续在这里新增技术笔记、生活记录、项目复盘或任何长期文章。

推荐一个文章一个文件夹：

```text
src/content/blog/my-post/
  index.md
  cover.png
  assets/
    diagram.png
```

文章中使用相对路径引用图片：

```md
---
cover: ./cover.png
---

![配图说明](./assets/diagram.png)
```

项目模块放在 `src/content/projects`，可用于作品集、产品模块、案例展示或工具说明。

模板配置集中在：

```text
malus.config.conf
```

旧的 `site.ts`、`friends.ts`、`sponsor.ts` 仍然存在，但它们只是兼容导出，实际数据都从 `malus.config.conf` 派生。模板使用者优先改 `malus.config.conf`，不需要到页面组件里找文案。

草稿文章使用：

```yaml
draft: true
```

草稿不会出现在文章列表、标签页、归档页、RSS 和搜索索引中。

## 新建文章

使用脚本创建新的 Markdown / MDX 草稿：

```bash
npm run new:post -- "用 Obsidian 写文章" --slug=obsidian-writing
```

生成结构：

```text
src/content/blog/YYYY-MM-DD-obsidian-writing/
  index.md
  cover.svg
  assets/
    .gitkeep
```

可选参数：

- `--slug=my-post` 指定 URL slug。
- `--date=2026-05-16` 指定日期前缀。
- `--lang=zh` 或 `--lang=en` 指定语言。
- `--publish` 直接创建为非草稿；默认创建草稿。

## 已有功能

- 首页模板化 Bento 首屏和内容入口。
- 首页站点运行时间，精确到秒。
- 中文文章列表、文章详情、标签页、归档页。
- 项目页、工具页、友链页、赞助页、关于页、404 页。
- Markdown / MDX 写作。
- Content Collections frontmatter 校验。
- 草稿过滤。
- 代码高亮和代码块复制按钮。
- 顶部搜索图标和玻璃搜索弹窗。
- Pagefind 静态全文搜索。
- 三态主题：亮色 / 暗色 / 跟随系统。
- RSS、Sitemap、robots.txt 和基础 SEO。
- 文章浏览量 chip。
- 文章正文图片灯箱 / 点击放大。
- giscus 评论组件预留。

## 友链

友链页在 `/friends/`，配置入口是：

```text
malus.config.conf
```

修改 `[features]` 里的 `friends` 可以开启或关闭友链入口；修改 `[friends.links]` 可以维护友链列表；修改 `[friends.applyTemplate]` 可以维护申请格式。友链是纯静态配置，不需要数据库或后台。

## 赞助

赞助页在 `/sponsor/`，配置入口是：

```text
malus.config.conf
```

修改 `[features]` 里的 `sponsor` 可以开启或关闭赞助入口；修改 `[sponsor.methods]` 可以维护赞助二维码和链接；修改 `[sponsor.thanks]` 可以维护感谢名单。真实二维码建议放在 `public/local/`，避免提交到公开仓库。

## 功能开关

常用开关都在 `malus.config.conf` 的 `features` 和 `plugins`：

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

关闭功能后，导航、首页入口、页脚入口和相关组件会自动隐藏。

## 搜索

搜索入口在顶部操作区，是弹窗，不是独立搜索页。

搜索基于 Pagefind。第一次使用搜索前需要：

```bash
npm run build
npm run preview
```

如果在 `npm run dev` 中看到“搜索索引还没有生成”，这是正常的，因为开发服务器不会生成 Pagefind 静态索引。

## 浏览量

文章页已经有轻量浏览量：

```text
进入文章页一次 -> 对该文章 +1
```

设计原则：

- 只提交文章 `slug`。
- 后端只保存 `slug + views`。
- 不保存用户身份。
- 不保存访问时刻。
- 不保存 IP、User Agent 等访问者信息。

生产接口在 `functions/api/views.js`，设计给 Cloudflare Pages Functions 使用。数据库表结构在 `migrations/0001_post_views.sql`。

上线时需要配置 D1 绑定：

```text
BLOG_VIEWS_DB
```

本地 `npm run dev` / `npm run preview` 不会运行 Cloudflare Pages Functions，所以当前组件会退回浏览器本机计数，只用于本地查看 UI。

## giscus 评论

评论系统已预留 giscus 组件，文章页底部会懒加载 GitHub Discussions 评论区。模板默认不绑定任何仓库。

启用前需要：

- GitHub 仓库开启 Discussions。
- 安装 giscus app。
- 获取 `repo`、`repoId`、`category`、`categoryId`。
- 把这些值写入 `.env.local` 或部署平台环境变量。

示例：

```bash
PUBLIC_GISCUS_ENABLED="true"
PUBLIC_GISCUS_REPO="owner/repo"
PUBLIC_GISCUS_REPO_ID="your repoId"
PUBLIC_GISCUS_CATEGORY="General"
PUBLIC_GISCUS_CATEGORY_ID="your categoryId"
PUBLIC_GISCUS_MAPPING="pathname"
PUBLIC_GISCUS_INPUT_POSITION="top"
PUBLIC_GISCUS_LIGHT_THEME="noborder_light"
PUBLIC_GISCUS_DARK_THEME="noborder_dark"
```

未填完整配置时：

- `npm run dev` 会显示配置提示，方便本地确认位置。
- 构建后的生产页面不会显示未配置提示，避免上线后出现占位内容。

## 头像和本地资源

默认头像是：

```text
public/images/avatar-default.png
```

如果要使用本地私人头像，可以把图片放到 `public/local/`，然后修改 `malus.config.conf`：

```ini
[author]
avatar = /local/avatar-square.jpg
```

`public/local/` 已被 Git 忽略，适合存放真实头像和真实二维码。

## 部署

等本地功能稳定后，推荐顺序：

1. 在 `malus.config.conf` 的 `[site]` 中配置真实 `url`。
2. 配置 Cloudflare Pages 或 Vercel。
3. 如需浏览量，配置 D1 数据库和 `BLOG_VIEWS_DB`。
4. 如需评论，配置 giscus 相关环境变量。
5. 验证 RSS、Sitemap、canonical URL 和搜索索引。
