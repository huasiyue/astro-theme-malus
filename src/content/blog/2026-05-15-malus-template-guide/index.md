---
title: "Malus 模板使用指南"
description: "从安装、配置站点信息、替换头像，到写文章、维护项目卡片和构建预览，快速开始使用 Malus。"
pubDate: 2026-05-15
updatedDate: 2026-05-16
lang: "zh"
tags:
  - Astro
  - 模板
  - 工程化
category: "前端"
series: "Malus 模板文档"
cover: ./cover.svg
coverAlt: "Malus 主题的系统网格和模板入口示意图"
draft: false
featured: true
---

## 安装和启动

Malus 是一套 Astro 静态博客模板。内容通过 Markdown / MDX 维护，提交到 GitHub 后由部署平台重新构建。先安装依赖，再启动本地开发服务器：

```bash
npm install
npm run dev
```

正式检查构建结果时使用：

```bash
npm run build
npm run preview
```

搜索依赖 Pagefind 生成的静态索引，所以完整搜索体验需要先运行 `npm run build`。

## 推荐使用顺序

第一次使用模板时，建议按这个顺序处理：

1. 修改站点基本信息。
2. 替换头像和 GitHub 链接。
3. 修改首页文案。
4. 修改关于页。
5. 修改友链配置。
6. 修改赞助配置。
7. 保留、改写模板教程，或新增自己的博客文章。
8. 构建并部署。

这样能先让站点变成“你的博客”，再考虑是否继续扩展项目和工具模块。

## 配置站点信息

模板默认值集中在根目录 `malus.config.conf`。普通使用者直接改这个文本文件即可：

```ini
[site]
name = 你的站点名
brandMark = Y
description = 你的站点描述
url = https://example.com
githubUrl = https://github.com/your-name/your-repo

[author]
name = Your Name
handle = your-handle
avatar = /images/avatar-default.png
```

`githubUrl` 默认指向模板仓库，顶部和页脚会显示 GitHub 入口。做成私人站点时，可以替换成自己的仓库或主页。

如果先作为模板仓库发布，可以保留 GitHub 仓库链接；如果直接作为个人博客使用，可以替换成自己的 GitHub 主页或博客仓库。

## 替换头像和 Logo

模板默认头像是：

```text
public/images/avatar-default.png
```

如果是私人站点，可以把头像放到 `public/local/`，再在 `malus.config.conf` 中指向它：

```ini
[author]
avatar = /local/avatar-square.jpg
```

`public/local/` 不会提交，适合保存真实头像、真实二维码等私人图片。

## 维护博客文章

站内文章放在 `src/content/blog`。当前默认文章是模板说明和使用教程；后续作为个人博客使用时，可以继续新增普通博客文章。推荐一篇文章一个目录：

```text
src/content/blog/2026-05-15-example-post/
  index.md
  cover.png
  assets/
    screenshot.png
```

可以用脚本新建草稿：

```bash
npm run new:post -- "文章标题" --slug=example-post
```

发布时把 frontmatter 里的 `draft` 改成 `false`。如果你正在把仓库做成模板展示版，可以把默认文章标题保持为模板文档类，例如：

- Malus 主题设计理念
- Malus 模板使用指南
- Malus 配置项完整说明
- Malus 部署指南
- 如何把 Malus 改成自己的博客

如果你已经开始当作个人博客使用，就按同样方式新增技术笔记、生活记录、项目复盘或任何长期文章。

## 维护项目和工具入口

项目卡片放在 `src/content/projects`。它可以表示作品、模板模块、案例页或工具说明。

工具页目前先作为入口页存在，适合收纳标签、归档、RSS、友链、赞助和后续轻量组件。

## 维护友链

友链配置在：

```text
malus.config.conf
```

默认包含本站信息、友链列表和申请格式。使用时重点修改：

- `[features]` 里的 `friends`：是否开启友链入口。
- `[friends.links]`：友链列表。
- `[friends.applyTemplate]`：给访客复制的申请格式。

友链页是纯静态页面，不需要数据库。新增友链时只要修改配置并重新部署。

## 维护赞助页

赞助配置在：

```text
malus.config.conf
```

可以配置二维码、赞助链接和感谢名单。二维码建议放在：

```text
public/local/sponsor-wechat.png
```

然后把 `image` 改成：

```text
/local/sponsor-wechat.png
```

`public/local/` 默认不提交，适合保存真实赞赏码。如果你希望开源仓库里也有示例，可以保留 `public/images/sponsor-placeholder.svg`。

## 修改导航和功能开关

导航、功能开关和插件开关都在：

```text
malus.config.conf
```

`[navigation.items]` 控制顶部导航。`[features]` 控制搜索、RSS、评论、浏览量、友链、赞助、项目、工具等功能是否显示。做极简模板时，可以把 `projects` 或 `tools` 改成 `false`；做完整模板官网时，建议保留友链和赞助。

如果只是隐藏一个导航入口，把对应 `item` 的第四个字段改成 `false`：

```ini
item = /projects/ | 项目 | Projects | false | projects
```

首页文案、关于页、工具页、项目页、文章列表、归档、标签、404 和英文占位页的标题说明也都在同一个配置文件里，分别对应 `[home.*]` 和 `[pages.*]` 分区。

## 上线前检查

正式部署前，至少检查这些内容：

- `[site]` 里的 `url` 是否换成真实域名。
- `[site]` 里的 `githubUrl` 是否正确。
- `[author]` 里的 `avatar` 是否能访问。
- RSS 是否生成。
- 搜索是否在 `npm run build` 后可用。
- 友链是否不再是示例内容。
- 赞助二维码或链接是否已经替换。
- 文章中的示例域名是否已经改掉。

## 常见命令

```bash
npm run dev
npm run build
npm run preview
npm run new:post -- "新文章标题" --slug=new-post
```

其中 `npm run build` 会先执行 Astro 类型检查，再构建页面，最后生成 Pagefind 搜索索引。
