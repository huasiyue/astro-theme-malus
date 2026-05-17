---
title: "Malus 部署指南"
description: "从本地构建到 Cloudflare Pages、Vercel、搜索索引、评论和浏览量配置的完整上线流程。"
pubDate: 2026-05-17
updatedDate: 2026-05-17
lang: "zh"
tags:
  - Astro
  - 部署
  - Cloudflare
category: "工程化"
series: "Malus 模板文档"
draft: false
featured: false
---

## 部署目标

Malus 是静态优先模板，最适合部署到 Cloudflare Pages、Vercel、Netlify 或任意静态托管服务。默认构建产物在 `dist/`。

如果你只需要静态页面、搜索、RSS、友链和赞助页，普通静态部署就够了。如果你还要生产浏览量计数，可以使用 Cloudflare Pages Functions + D1。

## 本地构建

先安装依赖：

```bash
npm install
```

本地开发：

```bash
npm run dev
```

正式构建：

```bash
npm run build
```

构建命令会依次执行：

```text
astro check
astro build
pagefind --site dist
```

也就是说，类型检查、静态页面构建和搜索索引生成都会在一次命令里完成。

## 本地预览

构建后预览：

```bash
npm run preview
```

搜索依赖构建后的 Pagefind 文件，所以测试搜索时应该用 `npm run build` + `npm run preview`，不要只看开发服务器。

## Cloudflare Pages

Cloudflare Pages 推荐配置：

```text
Build command: npm run build
Build output directory: dist
Root directory: /
```

环境变量至少配置：

```bash
PUBLIC_SITE_URL="https://your-domain.com"
PUBLIC_GITHUB_URL="https://github.com/your-name/your-repo"
PUBLIC_AUTHOR_NAME="Your Name"
PUBLIC_AUTHOR_HANDLE="your-handle"
PUBLIC_AVATAR_URL="/images/avatar-default.png"
```

如果开启评论，还要配置 giscus 相关变量。

## Cloudflare D1 浏览量

模板已经预留：

```text
functions/api/views.js
migrations/0001_post_views.sql
wrangler.toml.example
```

推荐流程：

1. 创建 D1 数据库。
2. 执行 `migrations/0001_post_views.sql`。
3. 在 Cloudflare Pages 中绑定 D1。
4. 绑定名填写 `BLOG_VIEWS_DB`。
5. 确认 `PUBLIC_VIEW_COUNTER_ENDPOINT="/api/views"`。

接口只保存：

```text
slug + views
```

不保存 IP、User Agent、用户身份或访问时间。

## Vercel

Vercel 推荐配置：

```text
Framework Preset: Astro
Build Command: npm run build
Output Directory: dist
```

如果只部署静态站点，Vercel 不需要额外配置。浏览量接口目前是 Cloudflare Pages Functions 写法，如果部署到 Vercel，需要改成 Vercel Serverless Function 或关闭生产浏览量。

## 评论系统

Malus 使用 giscus。上线前需要：

1. GitHub 仓库开启 Discussions。
2. 安装 giscus app。
3. 在 giscus 官网选择仓库、分类和映射方式。
4. 把 `repo`、`repoId`、`category`、`categoryId` 写入环境变量。

推荐环境变量：

```bash
PUBLIC_GISCUS_ENABLED="true"
PUBLIC_GISCUS_REPO="owner/repo"
PUBLIC_GISCUS_REPO_ID="repo id"
PUBLIC_GISCUS_CATEGORY="General"
PUBLIC_GISCUS_CATEGORY_ID="category id"
PUBLIC_GISCUS_MAPPING="pathname"
```

如果暂时不需要评论，可以设置：

```bash
PUBLIC_GISCUS_ENABLED="false"
```

## 自定义域名

绑定域名后一定要同步修改：

```bash
PUBLIC_SITE_URL="https://your-domain.com"
```

这个值会影响：

- RSS 链接。
- Sitemap。
- canonical URL。
- Open Graph URL。
- robots.txt 中的 sitemap 地址。

如果忘记修改，搜索引擎和分享卡片可能仍然指向 `example.com`。

## 上线前检查清单

部署前建议确认：

- 首页能正常打开。
- `/zh/blog/` 能看到文章列表。
- `/friends/` 能看到友链页。
- `/sponsor/` 能看到赞助页。
- `/rss.xml` 能访问。
- `/sitemap-index.xml` 能访问。
- 搜索弹窗可以搜索到文章。
- 深色和亮色主题都可读。
- 手机端导航不拥挤。
- 赞助二维码和友链信息已经替换。
- `npm run build` 没有错误。

完成这些检查后，Malus 就可以作为完整博客模板发布。
