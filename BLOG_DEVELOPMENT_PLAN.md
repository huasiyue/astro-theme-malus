# Malus Astro 内容模板开发方案

> 调研日期：2026-05-15  
> 目标：搭建一套可长期维护、可自由定制主题、可作为博客 / 项目展示 / 知识库 / 工具箱起点的现代 Astro 内容模板。

> 2026-05-17 收口说明：当前实现已经按“博客模板官网 + 模板教程文档”收敛，内容通过 Markdown/MDX 和 Git 发布，额外补齐静态友链页和静态赞助页。

## 1. 结论

推荐技术栈：

```text
Astro + TypeScript + Markdown/MDX + Content Collections + Tailwind CSS
+ npm + Pagefind + RSS + Sitemap + giscus/Waline + Cloudflare Pages/Vercel
```

核心判断：

- 第一版优先采用 `Markdown/MDX + Git` 发布文章。
- 评论、登录、后台、反垃圾系统优先接入成熟服务或轻量自托管方案。
- 主题建议完全自制：首页可以有记忆点；文章页和归档页保持清爽、耐读。
- 模板不只做文章列表，应定位为“内容站起点”：文章、项目、知识库、作品、工具页都能自然扩展。
- 包管理器可以用 `npm`，不强制使用 `pnpm`。
- 预留中英双语、亮暗模式切换、可选仓库链接等内容模板常见能力。

一句话方案：

```text
用 Astro 做一个静态优先的内容模板，文章用 Markdown/MDX 管理，部署到 Cloudflare Pages 或 Vercel，主题完全自制，后续按模块扩展项目展示、读书记录、小工具和知识库。
```

视觉方向：

```text
首页绚丽，内容页克制，整体参考 macOS Tahoe 26 / Liquid Glass 的通透玻璃质感。
```

首页负责建立模板记忆点和内容入口；文章页负责让读者舒服地读完长文。

视觉上要避免“AI 味”过重：不要堆砌紫蓝渐变、发光球、过度赛博背景和模板化大字报。玻璃感要像系统级材质，而不是随便给所有卡片加透明和模糊。记忆点应该来自清晰的模板结构、细节微交互、排版层次和内容入口。

## 2. 调研摘要

### 2.1 国内常见选择

国内个人博客社区和教程中常见路线：

| 方案 | 常见场景 | 优点 | 局限 |
|---|---|---|---|
| Hexo | 经典静态博客、GitHub Pages、中文教程 | 上手快、主题多、资料多 | 更偏传统博客主题，复杂扩展体验一般 |
| Hugo | 追求速度和稳定、文章数量多 | 构建极快、部署简单 | Go 模板学习成本较高，前端组件化体验一般 |
| WordPress | 非技术用户、后台编辑、插件生态 | CMS 成熟、插件多 | 维护成本高，容易臃肿 |
| Typecho | 轻量 PHP 博客 | 简洁、传统博客体验好 | 生态和现代前端扩展有限 |
| Halo | 中文开源博客系统、自托管 | 后台完整、中文生态友好 | 更像使用现成系统，不像自研主题工程 |
| Astro | 现代前端个人网站、博客 + 作品集 | 内容站体验好、组件化、性能好 | 需要一定前端工程能力 |

国内论坛和文章里，Hexo 仍然因为教程多、主题多而常被推荐；但近几年 Astro 在前端开发者中明显升温，常见理由是“静态优先、能写组件、能做博客也能做作品集”。

### 2.2 国外常见选择

国外开发者社区里，个人博客常见选择集中在：

| 方案 | 典型理由 |
|---|---|
| Astro | 内容站优先、少发 JS、MDX、组件岛、适合博客和作品集 |
| Hugo | 极快、稳定、适合大量页面和技术文档 |
| Next.js | 如果博客只是更大 Web App 的一部分，或需要复杂动态能力 |
| Eleventy | 简洁、灵活、传统静态站点生成器路线 |
| Ghost | 出版物、会员订阅、Newsletter |

国外社区对 Astro 的评价重点通常不是“潮”，而是：

- 默认静态输出，性能容易做好。
- 可以局部引入 React/Vue/Svelte 等组件。
- Markdown/MDX 内容体验比传统模板博客更贴近现代前端开发。
- 适合把博客扩展成内容主页、产品页、文档、小工具站。

## 3. 为什么推荐 Astro

### 3.1 它不是单纯博客框架

Hexo 的核心模型是：

```text
文章 -> 主题模板 -> 静态 HTML
```

Astro 的核心模型更像：

```text
内容集合 + 页面路由 + 组件 + 静态生成 + 局部交互
```

所以 Hexo 更适合“做一个博客”，Astro 更适合“做一个可扩展内容模板”。

### 3.2 更适合自制主题

Astro 自制主题时，可以把页面拆成清晰组件：

```text
Layout
Header
Footer
PostCard
PostMeta
PostToc
TagList
CodeBlock
ProjectCard
ToolCard
```

相比传统模板文件，这种结构更容易长期维护，也更适合后续扩展。

### 3.3 支持 MDX

普通文章用 Markdown：

```md
---
title: "第一篇示例文章"
pubDate: 2026-05-15
tags: ["Astro", "博客"]
---

正文内容。
```

需要交互组件的文章用 MDX：

```mdx
---
title: "一个颜色工具的实现"
pubDate: 2026-05-15
tags: ["Astro", "工具"]
---

这是一段正文。

<ColorPalette />
```

这意味着文章本身也可以成为作品展示和交互 Demo。

### 3.4 默认性能更好控制

Astro 的思路是：默认生成静态 HTML，只有明确需要交互的组件才加载浏览器 JavaScript。

博客文章、归档、标签、关于页大多数都可以纯静态。搜索、主题切换、评论、小工具这些再按需加载 JS。

## 4. 产品定位

建议把它定位为：

```text
可复用内容站模板
```

第一版包含：

- 博客文章
- 标签和归档
- 系列文章
- 项目展示
- 关于页面
- RSS 订阅
- 全站搜索
- 评论

第二版扩展：

- 知识库 / Wiki
- 读书记录
- 作品集
- 小工具箱
- Newsletter
- 自动生成文章封面图
- 图片灯箱和相册

长期可以扩展成：

- 内容主页
- 技术知识库
- 项目 Demo 集合
- 独立数字花园
- 品牌展示站

## 5. 功能规划

### 5.1 MVP 功能

第一版必须完成：

- 首页
  - 模板介绍
  - 精选文章
  - 最新文章
  - 项目入口
  - 右上角可选仓库链接
- 文章列表页
  - 分页
  - 标签筛选
  - 摘要
- 文章详情页
  - 标题、描述、发布时间、更新时间
  - 标签
  - 目录
  - 代码高亮
  - 复制代码
  - 上一篇 / 下一篇
  - 相关文章
- 归档页
  - 按年份组织
- 标签页
  - 标签列表
  - 标签详情
- 关于页
- RSS
- Sitemap
- SEO 基础信息
- 亮色 / 暗色模式
  - 默认跟随系统
  - 用户可以手动切换
  - 记住用户选择
- 中英文双语基础结构
  - URL、导航、文章元数据预留语言字段
  - 第一版可以先只发布中文内容
- 响应式布局

### 5.2 增强功能

第二阶段加入：

- Pagefind 本地全文搜索
- giscus 或 Waline 评论
- 文章系列
- 草稿模式
- 自动阅读时长
- 自动生成 Open Graph 图
- 图片优化
- Mermaid 图表支持
- 文章目录滚动高亮
- 访问统计

### 5.3 扩展功能

第三阶段再考虑：

- `/projects` 项目展示
- `/tools` 小工具箱
- `/notes` 短笔记 / 数字花园
- `/books` 读书记录
- `/uses` 设备和工具清单
- `/now` 近况页
- 完整中英文双语内容
- 简易后台或 Git-based CMS

## 6. 技术架构

### 6.1 前端框架

| 选型 | 结论 |
|---|---|
| Astro | 主框架 |
| TypeScript | 开启严格模式 |
| Tailwind CSS | 快速构建设计系统 |
| npm | 默认包管理器 |
| MDX | 支持文章内组件 |
| Content Collections | 文章元数据校验 |

### 6.2 内容管理

文章目录：

```text
src/content/blog/
  2026-05-15-hello-astro/
    index.md
    cover.png
    assets/
      screenshot.png
  2026-05-16-build-my-blog/
    index.mdx
    cover.png
    assets/
```

项目目录：

```text
src/content/projects/
  personal-blog.md
  open-source-tool.md
```

配置目录：

```text
src/content.config.ts
```

文章 Frontmatter 建议：

```yaml
---
title: "第一篇 Astro 示例文章"
description: "记录内容模板的搭建过程"
pubDate: 2026-05-15
updatedDate: 2026-05-15
lang: "zh"
tags:
  - Astro
  - 博客
category: "前端"
series: "Malus 模板开发"
cover: ./cover.png
coverAlt: "文章封面的替代文本"
draft: false
featured: true
---
```

Content Collections schema 建议：

```ts
import { defineCollection } from "astro:content";
import { z } from "astro/zod";

const blog = defineCollection({
  schema: ({ image }) => z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.date(),
    updatedDate: z.date().optional(),
    lang: z.enum(["zh", "en"]).default("zh"),
    tags: z.array(z.string()).default([]),
    category: z.string().optional(),
    series: z.string().optional(),
    cover: image().optional(),
    coverAlt: z.string().optional(),
    draft: z.boolean().default(false),
    featured: z.boolean().default(false),
  }),
});

export const collections = { blog };
```

### 6.3 推荐目录结构

```text
.
├── public/
│   ├── favicon.svg
│   └── local/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── home/
│   │   ├── blog/
│   │   ├── layout/
│   │   ├── seo/
│   │   ├── visual/
│   │   └── ui/
│   ├── content/
│   │   ├── blog/
│   │   ├── projects/
│   │   └── config.ts
│   ├── layouts/
│   │   ├── BaseLayout.astro
│   │   └── PostLayout.astro
│   ├── pages/
│   │   ├── index.astro
│   │   ├── about.astro
│   │   ├── archive.astro
│   │   ├── rss.xml.ts
│   │   ├── blog/
│   │   │   ├── index.astro
│   │   │   └── [...slug].astro
│   │   ├── tags/
│   │   │   ├── index.astro
│   │   │   └── [tag].astro
│   │   ├── projects/
│   │   │   └── index.astro
│   │   └── tools/
│   │       └── index.astro
│   ├── styles/
│   │   └── global.css
│   └── utils/
│       ├── posts.ts
│       ├── seo.ts
│       └── dates.ts
├── astro.config.mjs
├── package.json
├── tsconfig.json
└── README.md
```

## 7. 主题设计方案

### 7.1 设计关键词

```text
首页：有记忆点、结构清晰、入口明确、模板气质强
内容页：清爽、耐读、克制、快速、信息密度适中、移动端友好
材质：通透、折射、边缘高光、轻微景深、系统级玻璃感
色彩：垂丝海棠意象，亮色用浅粉、花瓣白、嫩叶绿，暗色用石墨黑灰和低饱和科技材质，浅薄荷高光为主，浅粉只做轻边缘点缀，避免墨绿、梅紫和深粉
```

设计原则：

- 首页可以大胆做视觉表达，但不要牺牲加载速度和可访问性。
- 绚丽效果集中在首页首屏、项目展示、工具入口，不要蔓延到所有页面。
- 避免常见“AI 生成感”：紫蓝渐变堆叠、发光球、无意义科技线条、过度锐利的霓虹字、没有层级的透明卡片泛滥。
- 更推荐“有设计感的模板”：好的字体层级、真实内容驱动的视觉、精致微交互、干净构图、明确主题符号。
- 玻璃感用于关键界面层：导航、右上角操作、首页精选卡片、项目卡片、工具入口。
- 文章正文区域不要过度透明，保持阅读稳定。
- 长文阅读舒服
- 代码块清晰
- 中文排版自然
- 手机端不拥挤
- 暗色模式不刺眼
- 首页能快速判断“模板包含什么、如何进入内容、能如何扩展”
- 动效要有节制：服务叙事和导航，不做纯装饰堆叠。

### 7.2 绚丽首页方向

首页可以做成“内容工作台”的感觉，而不是普通文章列表。

推荐方向：

```text
沉浸式首屏 + 主题标识 + 精选内容入口 + 项目/工具展示 + 最新文章
```

首屏可以包含：

- 大标题：名字、网名或一句短定位。
- 副标题：说明你写什么、做什么、关注什么。
- 动态背景：粒子场、星图、网格、3D 几何体、交互式光标效果。
- 快速入口：博客、项目、工具、关于。
- 状态信息：当前关注方向、最近更新、GitHub / RSS / 邮箱。
- 右上角固定入口：GitHub、语言切换、亮暗模式切换。

更推荐的视觉实现：

| 方向 | 技术 | 适合效果 |
|---|---|---|
| 2D 高级动效 | CSS + Motion One / GSAP | 页面转场、滚动揭示、文字动效 |
| 3D 首屏 | Three.js / TresJS | 星云、几何空间、交互式背景 |
| 粒子和流体 | Canvas / WebGL | 科技感、沉浸式首页 |
| Liquid Glass | CSS backdrop-filter + 多层渐变 | 顶栏、卡片、浮层、按钮 |
| 文章卡片动效 | CSS + View Transitions | 精致但不重的交互 |
| 局部组件岛 | Astro + React/Vue/Svelte | 搜索、工具、小交互 |

不建议的做法：

- 只用大面积渐变当“绚丽”，容易显得模板化。
- 全站都使用重动画，文章页会影响阅读。
- 首屏塞太多文字，视觉冲击会被信息噪声稀释。
- 移动端直接复用桌面复杂动效，容易卡顿和拥挤。
- 为了炫技引入过大的 JS 包，导致博客加载慢。
- 使用过多 AI 风格视觉元素，导致页面缺少主题辨识度。
- 所有容器都做玻璃效果，导致层级混乱、文字对比度不足。

### 7.3 页面布局

首页：

```text
顶部导航
右上角仓库链接 / 语言切换 / 亮暗模式
沉浸式 Hero
模板定位
快速入口
精选文章
项目展示
工具入口
最新文章
标签入口
页脚
```

文章页：

```text
文章头部
文章正文
右侧目录（桌面端）
底部标签
上一篇 / 下一篇
相关文章
评论区
```

项目页：

```text
项目卡片
技术栈
项目状态
GitHub / Demo 链接
简短说明
```

工具页：

```text
工具列表
每个工具独立路由
需要交互的工具用 React/Vue/Svelte 岛组件
```

### 7.4 首页模块设计

建议首页模块：

| 模块 | 作用 | 视觉建议 |
|---|---|---|
| Hero | 建立第一印象 | 全屏或接近全屏，动态背景，大标题 |
| Top Actions | 放常用入口 | GitHub、语言切换、亮暗模式 |
| Signal Bar | 展示当前状态 | 最近在写什么、研究什么、做什么 |
| Featured Posts | 展示高质量文章 | 重点卡片，封面和摘要更精致 |
| Projects | 证明实践能力 | 项目截图、技术栈、Demo 链接 |
| Tools | 展示可交互能力 | 小工具入口，适合做亮点 |
| Latest Posts | 保持博客属性 | 简洁列表，突出更新频率 |
| Footer | 收束信息 | RSS、GitHub、邮箱、备案信息 |

首页首屏可以采用下面的结构：

```text
背景层：Canvas / WebGL / 轻量动效
内容层：姓名或站点名 + 简短定位
导航层：博客 / 项目 / 工具 / 关于
操作层：GitHub / 语言切换 / 亮暗模式
状态层：最近更新 / 当前关注 / 社交链接
```

如果使用 3D 效果，建议：

- 用 Three.js 做一个完整首屏背景，而不是把 3D 塞进小卡片。
- 移动端降低粒子数量、关闭高成本后处理。
- 提供 `prefers-reduced-motion` 降级。
- 保证首屏文字在动态背景上始终清晰。
- 构建完成后用 Lighthouse 和真实手机预览检查性能。

### 7.5 亮暗模式和双语

亮暗模式建议：

```text
默认：跟随系统 prefers-color-scheme
手动：右上角按钮切换 light / dark / system
存储：localStorage 记住用户选择
```

实现要求：

- 页面首次渲染前设置主题，避免闪烁。
- 三态切换：亮色、暗色、跟随系统。
- 图标可以使用太阳、月亮、显示器三个状态。
- 暗色模式不要只把背景改黑，要单独设计边框、代码块、弱文字和强调色。

双语建议：

```text
/zh/blog/...
/en/blog/...
```

第一版可以先做架构预留：

- 导航文案使用字典管理。
- 文章 frontmatter 增加 `lang` 字段。
- 页面路由预留 `zh` 和 `en`。
- 右上角提供语言切换入口。

如果短期只写中文，英文内容可以后续逐步补，不影响第一版上线。

### 7.6 Liquid Glass 玻璃质感规范

参考方向：

```text
macOS Tahoe 26 / Liquid Glass 的通透、折射、反射、边缘高光和动态层级。
```

注意：这是视觉参考，不是照搬 Apple 系统 UI。模板要保留自己的主题气质。

适合使用玻璃质感的位置：

- 顶部导航栏
- 右上角 GitHub / 语言 / 主题切换按钮组
- 首页 Hero 的状态信息条
- 首页精选文章卡片
- 项目和工具卡片
- 搜索面板
- 轻量弹出层

不适合过度玻璃化的位置：

- 长文章正文容器
- 代码块主体
- 大段列表页正文
- 表格内容
- 移动端小屏幕上的密集信息区

CSS 实现建议：

```css
.glass-panel {
  background:
    linear-gradient(135deg, rgba(255, 255, 255, 0.52), rgba(255, 255, 255, 0.18)),
    rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.32);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.4),
    0 20px 60px rgba(0, 0, 0, 0.12);
  backdrop-filter: blur(22px) saturate(160%);
  -webkit-backdrop-filter: blur(22px) saturate(160%);
}
```

暗色模式需要单独设计：

```css
.dark .glass-panel {
  background:
    linear-gradient(135deg, rgba(30, 34, 44, 0.72), rgba(18, 22, 30, 0.38)),
    rgba(12, 16, 24, 0.3);
  border-color: rgba(255, 255, 255, 0.14);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.12),
    0 24px 70px rgba(0, 0, 0, 0.36);
}
```

交互细节：

- Hover 时只做轻微亮度、边框和位移变化，不要大幅漂浮。
- 按钮点击可以有 0.96 到 0.98 的轻微缩放。
- 顶栏滚动后可以提高模糊和不透明度。
- 卡片边缘可以有细微高光，但不要霓虹描边。
- 背景需要有内容层次，否则 `backdrop-filter` 没有真实玻璃感。

可访问性和性能：

- 所有玻璃层上的文字必须通过对比度检查。
- 提供不支持 `backdrop-filter` 时的纯色降级。
- 支持 `prefers-reduced-transparency` 和 `prefers-reduced-motion`。
- 移动端减少模糊半径和阴影层数。
- 文章页优先保证阅读，不追求每个元素都通透。

推荐实现方式：

```text
全站基础：简洁色板 + 系统字体 + 清晰排版
首页重点：玻璃顶栏 + 玻璃状态条 + 精选卡片 + 动态背景
文章页面：导航、目录、按钮使用轻玻璃，正文保持实底
```

### 7.7 视觉规范

建议建立最小设计系统：

- 字体
  - 中文：系统默认中文字体栈
  - 英文和代码：系统等宽字体或 JetBrains Mono
- 颜色
  - 首页背景色
  - 内容页背景色
  - 文字色
  - 弱文字色
  - 边框色
  - 主题强调色
  - 高亮色
  - 亮色模式色板
  - 暗色模式色板
- 间距
  - 页面最大宽度
  - 正文最大宽度
  - 卡片间距
  - 段落间距
- 组件
  - Hero
  - GlassPanel
  - GlassButton
  - GlassNav
  - Button
  - Tag
  - Card
  - Prose
  - CodeBlock
  - Alert
  - ProjectCard
  - ToolCard

建议把主题拆成两套视觉密度：

```text
Home Visual System：负责绚丽、沉浸、动态。
Reading System：负责文章、列表、归档的可读性。
```

这样首页可以有强烈风格，文章页仍然专业、干净。

视觉反 AI 味检查：

- 页面是否像真实可用的主题作品，而不是模板生成图。
- 动效是否服务内容入口，而不是只为了炫。
- 色彩是否有克制的主辅关系，而不是紫蓝霓虹铺满。
- 首页是否有独特主题符号，比如 Malus 标识、内容模块、项目轨迹和写作主题。
- 文章页是否依然像一个值得长期阅读的网站。

## 8. 发布文章流程

推荐工作流：

```text
Obsidian / VS Code 写文章
-> npm run new:post -- "文章标题" --slug=article-slug
-> 保存为 Markdown/MDX
-> 本地预览
-> git commit
-> git push
-> Cloudflare Pages / Vercel 自动部署
```

本地开发预览：

```bash
npm run dev
```

构建预览：

```bash
npm run build
npm run preview
```

`npm run build` 会在 Astro 构建之后运行 Pagefind，并在 `dist/pagefind` 生成静态搜索索引。

首页状态区已加入站点运行时间，来源于 `src/config/site.ts` 的 `launchedAt`，显示到秒。这个时间只用于展示博客从何时开始运行，可以在正式上线当天改成真实时间。

文章代码块已加入复制按钮，用客户端增强方式处理，不影响 Markdown / MDX 写作，也不改变代码块本身的静态渲染。

文章页已加入轻量浏览量：每进入一次文章页就对该文章 `+1`。计数接口只保存 `slug + views`，不保存用户身份、IP、User Agent 或访问时间。

生产方案使用 Cloudflare Pages Functions + D1：

```text
前端 PostViews 组件
-> POST /api/views { slug }
-> functions/api/views.js
-> D1 表 post_views(slug, views)
```

本地 `npm run dev` / `npm run preview` 不会运行 Cloudflare Pages Functions，所以组件会退回浏览器本机计数，只用于看 UI。上线后需要把 D1 绑定名配置为 `BLOG_VIEWS_DB`。

新建文章：

```bash
npm run new:post -- "第一篇示例文章" --slug=my-first-post
```

生成结构：

```text
src/content/blog/2026-05-15-my-first-post/
  index.md
  cover.svg
  assets/
    .gitkeep
```

提交发布：

```bash
git add .
git commit -m "publish: my first post"
git push
```

草稿控制：

```yaml
draft: true
```

构建时过滤草稿：

```ts
const posts = (await getCollection("blog")).filter((post) => !post.data.draft);
```

## 9. 评论系统选择

| 方案 | 适合场景 | 结论 |
|---|---|---|
| giscus | 技术读者、GitHub 用户多 | 推荐给技术博客 |
| Waline | 国内读者、传统评论体验 | 推荐给中文博客 |
| Artalk | 自托管、隐私可控 | 可选 |
| Twikoo | 国内静态博客常见 | 可选 |
| 自研评论 | 想练后端 | 第一版优先复用成熟方案 |

建议：

- 如果博客偏技术和开源，先用 giscus。
- 如果希望普通读者不用 GitHub，也能评论，后续接 Waline。

## 10. 搜索方案

推荐 `Pagefind`。

理由：

- 适合静态站点。
- 不需要后端数据库。
- 可以在构建后生成索引。
- 对静态内容模板足够轻量。

替代方案：

| 方案 | 说明 |
|---|---|
| Pagefind | 首选 |
| MiniSearch | 自己控制搜索体验 |
| Algolia DocSearch | 适合文档站，申请和配置更复杂 |
| 自研搜索 API | 第一版没有必要 |

## 11. SEO 和订阅

第一版必须做：

- 每篇文章独立 title
- description
- canonical URL
- Open Graph
- Twitter Card
- sitemap.xml
- robots.txt
- rss.xml
- 结构化数据 JSON-LD

文章 SEO 字段：

```yaml
title: "文章标题"
description: "文章摘要，控制在 80 到 160 字"
cover: ./cover.png
coverAlt: "文章封面的替代文本"
```

## 12. 部署方案

### 12.1 首选：Cloudflare Pages

适合：

- 静态站点
- 全球访问
- 免费额度友好
- Git push 自动部署
- 后续接 Cloudflare DNS、缓存、Workers

构建配置：

```text
Build command: npm run build
Output directory: dist
```

### 12.2 备选：Vercel

适合：

- 想要最简单的前端部署体验
- 未来可能和 Next.js 项目结合
- 需要预览部署

### 12.3 国内访问优化

如果主要面向国内读者：

- 使用国内云服务器、对象存储或 CDN 时，通常需要备案。
- 可以考虑腾讯云 EdgeOne、阿里云 OSS + CDN、七牛云 CDN。
- 如果不备案，可先部署海外平台，但国内访问速度和稳定性不可完全保证。

## 13. 开发路线图

### 阶段 1：基础博客

目标：能写文章、能访问、能部署。

任务：

- 初始化 Astro 项目
- 使用 npm 管理依赖和脚本
- 配置 TypeScript
- 配置 Tailwind CSS
- 建立 Content Collections
- 实现首页
- 实现文章列表
- 实现文章详情
- 实现标签页
- 实现归档页
- 实现关于页
- 实现右上角可选仓库链接
- 实现亮暗模式三态切换
- 预留中英双语路由和文案结构
- 部署到 Cloudflare Pages 或 Vercel

验收标准：

- 可以写 Markdown 文章并上线。
- 移动端和桌面端布局正常。
- 构建无报错。

### 阶段 2：阅读体验

目标：变成真正舒服的博客。

任务：

- 代码高亮
- 复制代码按钮
- 文章目录
- 阅读时间
- 上一篇 / 下一篇
- 相关文章
- 亮色 / 暗色 / 跟随系统切换
- RSS
- Sitemap
- SEO meta

验收标准：

- 长文阅读体验良好。
- 分享链接时有正确标题、描述和封面图。
- RSS 可订阅。

### 阶段 3：互动和搜索

目标：让博客可检索、可交流。

任务：

- 集成 Pagefind 顶部搜索弹窗
- 构建后自动生成 `dist/pagefind` 搜索索引
- 新文章脚手架 `npm run new:post`
- 集成 giscus GitHub 评论
- 评论区懒加载
- 加入访问统计
- 图片灯箱 / 图片点击放大
- Obsidian Callout 兼容：`> [!note]`
- Mermaid 图表
- 优化图片加载
- 文章目录当前阅读位置高亮
- 自动 OG 封面图

验收标准：

- 可以搜索文章。
- 评论可用。
- Lighthouse 性能和 SEO 分数保持良好。

### 阶段 4：内容模板扩展

目标：从博客模板升级成内容平台模板。

任务：

- 项目展示页
- 工具箱页
- 读书记录页
- 知识库或短笔记
- 完整中英文双语内容
- 自动生成 OG 图
- 可选内容管理扩展

验收标准：

- 博客之外的内容模块可以独立扩展。
- 新增模块不破坏现有文章系统。

## 14. 风险和取舍

### 14.1 静态工作流的取舍

优点：

- 简单
- 稳定
- 成本低
- 内容完全归自己
- 迁移容易

缺点：

- 手机端发布体验更依赖 Git 或外部编辑器
- 非技术用户不友好
- 图片管理需要规范

结论：

第一版先以静态工作流为主。等发布频率稳定后，再考虑 Decap CMS、TinaCMS、Keystatic 或自研后台。

### 14.2 Astro 的学习成本

需要熟悉：

- Astro 组件
- Content Collections
- MDX
- 静态路由生成
- 少量 TypeScript

但这些能力对后续做作品集、工具站和前端项目都有价值。

### 14.3 国内访问问题

如果部署在 Cloudflare Pages / Vercel：

- 海外访问通常较好。
- 国内访问可能受网络环境影响。

如果希望国内稳定访问：

- 建议购买域名并备案。
- 使用国内对象存储和 CDN。
- 静态站点迁移成本较低，后续可以平滑切换部署平台。

## 15. 技术选型对比

| 技术 | 推荐度 | 适合程度 | 结论 |
|---|---:|---|---|
| Astro | 9/10 | 博客 + 作品集 + 工具箱 | 首选 |
| Hexo | 8/10 | 纯博客、自制主题、快速上线 | 可选，但扩展性弱于 Astro |
| Hugo | 8/10 | 大量文章、极致构建速度 | 稳，但模板体验不如 Astro |
| Next.js | 7/10 | 博客属于大型 Web App 的一部分 | 纯博客略重 |
| WordPress | 6/10 | 需要后台和插件生态 | 不适合当前“自己开发”目标 |
| Ghost | 6/10 | Newsletter、会员订阅 | 适合出版物，不适合自制前端主题优先 |
| Halo | 6/10 | 中文后台博客系统 | 更像使用系统，不是自研内容站 |

最终建议：

```text
当前目标：自制主题 + 长期扩展 + 技术博客
最佳选择：Astro
```

## 16. 第一版任务清单

### 项目初始化

- [ ] 创建 Astro 项目
- [ ] 使用 npm 作为包管理器
- [ ] 配置 TypeScript strict
- [ ] 配置 Tailwind CSS
- [ ] 配置 ESLint / Prettier
- [ ] 配置站点信息

### 内容系统

- [ ] 建立 `blog` collection
- [ ] 建立 `projects` collection
- [ ] 设计文章 frontmatter
- [ ] 支持草稿过滤
- [ ] 支持标签和分类
- [ ] 新文章脚手架

### 页面

- [ ] 首页
- [ ] 文章列表页
- [ ] 文章详情页
- [ ] 标签页
- [ ] 归档页
- [ ] 关于页
- [ ] 项目页
- [ ] 顶部搜索弹窗
- [ ] 404 页
- [ ] 右上角可选仓库链接
- [ ] 语言切换入口
- [ ] 亮暗模式切换入口

### 阅读体验

- [ ] 中文排版样式
- [ ] 代码高亮
- [x] 复制代码
- [ ] 文章目录
- [ ] 阅读时间
- [ ] 亮色 / 暗色 / 跟随系统
- [ ] 主题选择本地持久化
- [ ] 响应式布局

### SEO 和发布

- [ ] SEO 组件
- [ ] Open Graph
- [ ] RSS
- [ ] Sitemap
- [ ] robots.txt
- [ ] Cloudflare Pages / Vercel 部署

### 增强

- [ ] Pagefind 搜索
- [x] giscus GitHub 评论组件
- [x] giscus 外层玻璃容器
- [ ] 访问统计
- [x] 图片灯箱 / 图片点击放大
- [ ] 文章目录当前阅读位置高亮
- [ ] Obsidian Callout
- [ ] Mermaid 图表
- [ ] 图片优化
- [ ] 自动生成 OG 图

## 17. 建议的开发顺序

```text
1. 先做内容模型
2. 再做文章列表和文章页
3. 再做主题视觉
4. 再做 SEO / RSS / Sitemap
5. 再做搜索、浏览量和 GitHub 评论
6. 再做目录高亮、Callout、Mermaid、自动 OG
7. 最后做部署闭环和更多内容模块
```

不要一开始纠结后台、复杂动画、评论审核、用户系统。内容模板最重要的是：

```text
写作顺畅 + 阅读舒服 + 维护简单 + 可持续扩展
```

## 18. 后续可选升级

如果文章很多：

- 增强标签和系列管理
- 加 Pagefind 高级筛选
- 加文章推荐

如果希望在线编辑：

- Decap CMS
- TinaCMS
- Keystatic

如果希望做 Newsletter：

- Buttondown
- Ghost Headless
- ConvertKit

如果希望做访问分析：

- Umami
- Plausible
- Cloudflare Web Analytics

如果希望国内评论体验更好：

- Waline
- Artalk
- Twikoo

## 19. 参考资料

官方文档：

- [Astro Markdown/MDX](https://docs.astro.build/en/guides/markdown-content/)
- [Astro Content Collections](https://docs.astro.build/en/guides/content-collections/)
- [Astro Integrations](https://docs.astro.build/en/guides/integrations/)
- [Astro Images](https://docs.astro.build/en/guides/images/)
- [Astro RSS](https://docs.astro.build/en/recipes/rss/)
- [Astro Deploy](https://docs.astro.build/en/guides/deploy/)
- [Pagefind](https://pagefind.app/)
- [giscus](https://github.com/giscus/giscus)
- [Apple: Liquid Glass 软件设计](https://www.apple.com/newsroom/2025/06/apple-introduces-a-delightful-and-elegant-new-software-design/)
- [Hexo Themes](https://hexo.io/docs/themes.html)
- [Hugo](https://gohugo.io/)
- [Ghost Members](https://ghost.org/docs/members/)

社区参考：

- [V2EX: 打算搭建自己的博客记录的小东西，求大佬们的方案](https://s.v2ex.com/t/1057242)
- [V2EX Astro 标签](https://v2ex.com/tag/astro)
- [掘金：用 Astro 搭建个人博客](https://juejin.cn/post/7621484151693213711)
- [少数派：谈一谈我的个人博客探索之路](https://sspai.com/post/64093)
- [DEV Community: Why I Chose Astro After Trying VuePress, Hugo, and Hexo](https://dev.to/ansurfen/why-i-chose-astro-after-trying-vuepress-hugo-and-hexo-6aa)

## 20. 最终建议

如果只是想最快拥有一个传统博客，Hexo 足够。

但你的目标是：

```text
自制主题
未来扩展小工具
项目展示
长期维护
博客变成内容站模板
```

因此更建议选择 Astro。

第一版不求大而全，先把“写文章 -> 本地预览 -> 提交 -> 自动部署”这条链路打通。只要这条链路顺，后面的主题、搜索、评论、项目页、工具页都可以逐步加上去。
