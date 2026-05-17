export function formatDate(
  value: Date | string,
  locale: string = "zh-CN"
): string {
  const date = typeof value === "string" ? new Date(value) : value;
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "numeric"
  }).format(date);
}

export function formatYear(value: Date | string): string {
  const date = typeof value === "string" ? new Date(value) : value;
  return new Intl.DateTimeFormat("en", { year: "numeric" }).format(date);
}

export function getReadingTime(text: string): number {
  const cjkCount = (text.match(/[\u4e00-\u9fff]/g) ?? []).length;
  const words = text.replace(/[\u4e00-\u9fff]/g, " ").split(/\s+/).filter(Boolean).length;
  const minutes = Math.ceil(cjkCount / 500 + words / 220);
  return Math.max(1, minutes);
}

export function stripMarkdown(markdown: string): string {
  return markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/!\[.*?\]\(.*?\)/g, " ")
    .replace(/\[(.*?)\]\(.*?\)/g, "$1")
    .replace(/^#+\s+/gm, "")
    .replace(/[*_>#-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function groupByYear<T extends { data: { pubDate: Date } }>(items: T[]) {
  const map = new Map<string, T[]>();
  for (const item of items) {
    const year = item.data.pubDate.getFullYear().toString();
    const list = map.get(year) ?? [];
    list.push(item);
    map.set(year, list);
  }
  return Array.from(map.entries())
    .map(([year, items]) => ({
      year,
      items: items.sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime())
    }))
    .sort((a, b) => Number(b.year) - Number(a.year));
}
