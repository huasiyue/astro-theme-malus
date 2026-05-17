import { existsSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const blogDir = path.join(root, "src", "content", "blog");

function parseArgs(argv) {
  const options = {
    lang: "zh",
    draft: true,
    date: new Date().toISOString().slice(0, 10)
  };
  const parts = [];

  for (const arg of argv) {
    if (arg.startsWith("--slug=")) options.slug = arg.slice("--slug=".length);
    else if (arg.startsWith("--lang=")) options.lang = arg.slice("--lang=".length);
    else if (arg.startsWith("--date=")) options.date = arg.slice("--date=".length);
    else if (arg === "--publish") options.draft = false;
    else parts.push(arg);
  }

  options.title = parts.join(" ").trim();
  return options;
}

function slugify(value) {
  const slug = value
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");

  return slug || "post";
}

function coverSvg(title) {
  const safeTitle = title
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675" role="img" aria-label="${safeTitle} cover">
  <rect width="1200" height="675" fill="#f5f7f4"/>
  <path d="M0 470h1200" stroke="#0f8b6e" stroke-opacity=".16" stroke-width="150"/>
  <path d="M0 150h1200" stroke="#d75f46" stroke-opacity=".1" stroke-width="110"/>
  <rect x="120" y="110" width="960" height="455" rx="22" fill="#ffffff" fill-opacity=".72" stroke="#ffffff"/>
  <path d="M188 210h430" stroke="#17201c" stroke-width="28" stroke-linecap="round"/>
  <path d="M188 288h680" stroke="#5f6b64" stroke-opacity=".42" stroke-width="18" stroke-linecap="round"/>
  <path d="M188 338h560" stroke="#5f6b64" stroke-opacity=".32" stroke-width="18" stroke-linecap="round"/>
  <text x="188" y="486" fill="#17201c" font-family="Inter, system-ui, sans-serif" font-size="48" font-weight="800">${safeTitle}</text>
</svg>
`;
}

function markdownTemplate({ title, date, lang, draft }) {
  return `---
title: "${title}"
description: "这里写一段 80 到 160 字的文章摘要。"
pubDate: ${date}
updatedDate: ${date}
lang: "${lang}"
tags: []
category: "未分类"
cover: ./cover.svg
coverAlt: "${title} 封面"
draft: ${draft}
featured: false
---

## 开始写作

这里写正文。

图片建议放在当前文章目录的 \`assets\` 里，然后用相对路径引用：

\`\`\`md
![图片说明](./assets/screenshot.png)
\`\`\`
`;
}

const options = parseArgs(process.argv.slice(2));

if (!options.title) {
  console.error('Usage: npm run new:post -- "文章标题" [--slug=my-post] [--date=2026-05-16] [--lang=zh] [--publish]');
  process.exit(1);
}

if (!/^\d{4}-\d{2}-\d{2}$/.test(options.date)) {
  console.error("The --date value must use YYYY-MM-DD.");
  process.exit(1);
}

if (!["zh", "en"].includes(options.lang)) {
  console.error('The --lang value must be "zh" or "en".');
  process.exit(1);
}

const slug = slugify(options.slug || options.title);
const postDir = path.join(blogDir, `${options.date}-${slug}`);
const assetsDir = path.join(postDir, "assets");

if (existsSync(postDir)) {
  console.error(`Post already exists: ${path.relative(root, postDir)}`);
  process.exit(1);
}

await mkdir(assetsDir, { recursive: true });
await writeFile(path.join(assetsDir, ".gitkeep"), "");
await writeFile(path.join(postDir, "cover.svg"), coverSvg(options.title));
await writeFile(path.join(postDir, "index.md"), markdownTemplate(options));

console.log(`Created ${path.relative(root, postDir)}`);
console.log("The post is a draft by default. Use draft: false when ready to publish.");
