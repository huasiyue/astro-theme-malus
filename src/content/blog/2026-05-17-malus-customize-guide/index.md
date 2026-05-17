---
title: "如何把 Malus 改成自己的博客"
description: "从站点身份、首页、关于页、文章内容、友链、赞助和颜色入手，把 Malus 改造成自己的博客。"
pubDate: 2026-05-17
updatedDate: 2026-05-17
lang: "zh"
tags:
  - Astro
  - 自定义
  - 设计系统
category: "设计"
series: "Malus 模板文档"
draft: false
featured: false
---

## 先确定站点身份

开始改模板前，先确定它要变成什么：

- 个人博客。
- 作品集。
- 模板展示站。
- 技术文档站。
- 项目主页。

Malus 当前默认内容更接近“模板说明 + 博客示例”，方便你发布到 GitHub 后让别人看懂它怎么用。如果你要做个人博客，就把首页文案改成个人介绍，并在 `src/content/blog` 新增自己的 Markdown / MDX 文章；如果你要做模板官网，就保留教程、友链和赞助入口。

## 修改站点信息

第一步是配置根目录 `malus.config.conf`：

```ini
[site]
name = 你的站点名
brandMark = Y
description = 你的站点描述
url = https://your-domain.com
githubUrl = https://github.com/your-name

[author]
name = Your Name
handle = your-handle
avatar = /local/avatar-square.jpg
```

头像建议放在：

```text
public/local/avatar-square.jpg
```

`public/local/` 默认不会提交，适合保存私人资源。

## 修改首页

首页文案和模块开关在：

```text
malus.config.conf
```

建议优先修改这些区域：

- `[home.hero]`：Hero 标题、说明和按钮。
- `[home.featuredPost]`：精选文章卡片文案。
- `[home.stats.*]`：统计卡片名称和单位。
- `[home.quickLinks]`：首页快捷入口。
- `[home.guideSection]`：教程区标题、说明和筛选 series。
- `[home.projectSection]`：项目模块区标题、数量和标签。

首页不能整体关闭，但可以用 `showLiquidPanel`、`showStats`、`showGuideList`、`showProjectModules` 等开关隐藏不需要的模块。先替换文案和真实内容，再判断是否需要改视觉结构。

## 修改关于页

关于页文案在：

```text
malus.config.conf
```

如果是个人博客，可以写：

- `[pages.about]` 的 `heading`：你是谁。
- `[pages.about]` 的 `body`：你关注什么、这个站点会放什么。
- `[pages.about.cards]`：联系方式、技术栈、站点边界或维护方式。

如果是模板官网，可以写：

- 模板定位。
- 内容结构。
- 技术栈。
- 维护方式。

## 修改博客文章

博客文章在：

```text
src/content/blog
```

Malus 默认提供这些教程：

- 主题设计理念。
- 模板使用指南。
- 配置项说明。
- 部署指南。
- 自定义指南。
- 截图和图片规范。

你可以保留这些文章作为模板文档，也可以把它们改成自己的建站记录。后续真正写博客时，继续在这个目录新增 Markdown / MDX，提交到 GitHub 后由部署平台重新构建。

## 修改友链

友链配置在：

```text
malus.config.conf
```

每个友链包含：

```ini
[friends.links]
item = 站点名称 | 站点描述 | https://example.com | /images/friends/example.png | Blog, Astro | false
```

如果没有头像，页面会自动显示名称首字母。这样即使你还没准备图片，友链页也不会空着。

## 修改赞助

赞助配置在：

```text
malus.config.conf
```

二维码图片推荐放在：

```text
public/local/sponsor-wechat.png
```

配置示例：

```ini
[sponsor.methods]
item = 微信赞赏 | 感谢支持模板维护。 | | /local/sponsor-wechat.png | 微信赞赏
```

如果使用爱发电、GitHub Sponsors 或其他平台，可以使用链接：

```ini
[sponsor.methods]
item = GitHub Sponsors | 长期支持模板开发。 | https://github.com/sponsors/your-name | | 长期赞助
```

## 修改颜色

全站样式在：

```text
src/styles/global.css
```

主要颜色变量在 `:root` 和 `[data-resolved-theme="dark"]` 中：

```css
--bg
--surface
--text
--muted
--accent
--accent-strong
--accent-warm
--glass-bg
--line
```

建议一次只改一组变量，然后运行站点观察首页、文章页、搜索弹窗、友链页和赞助页。不要只看首页，因为正文页的可读性更重要。

## 修改导航

导航和功能开关在：

```text
malus.config.conf
```

如果不需要项目页，可以设置：

```ini
[features]
projects = false
```

如果不需要赞助页，可以设置：

```ini
[features]
sponsor = false
```

对应导航、首页入口和页脚入口会自动隐藏。

如果只是隐藏导航，而不是关闭页面能力，可以改 `[navigation.items]`：

```ini
item = /projects/ | 项目 | Projects | false | projects
```

如果要改工具页、项目页、文章列表、归档、标签、404 或英文占位页的标题说明，改 `[pages.tools]`、`[pages.projects]`、`[pages.blogIndex]`、`[pages.archive]`、`[pages.tags]`、`[pages.notFound]` 和 `[pages.english]`。

## 推荐保留的能力

即使你做极简博客，也建议保留：

- RSS。
- 搜索。
- 主题切换。
- 友链页。
- 关于页。
- 基础 SEO。

这些功能维护成本低，但对真实博客很有用。

## 第一版优先保留的能力

第一版建议先把这些能力稳定下来：

- 文章直接写在仓库里。
- 评论、浏览量和搜索使用成熟服务或轻量方案。
- 内容结构清楚，方便别人 fork 后继续写作。
- 配置入口集中，方便替换成自己的站点信息。

Malus 的优势是：内容直接写在仓库里，文章通过 Markdown / MDX 发布，构建产物是静态页面，部署简单，迁移也简单。
