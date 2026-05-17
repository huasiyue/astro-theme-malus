import type { CollectionEntry } from "astro:content";
import { getCollection } from "astro:content";
import type { Lang } from "@/config/site";

export type BlogEntry = CollectionEntry<"blog">;
export type ProjectEntry = CollectionEntry<"projects">;

export function getEntrySlug(entry: { id: string; slug?: string }) {
  return (entry.slug ?? entry.id).replace(/\.(md|mdx)$/, "").replace(/\/index$/, "");
}

export function getPostUrl(post: BlogEntry) {
  return `/zh/blog/${getEntrySlug(post)}/`;
}

export function getProjectUrl(project: ProjectEntry) {
  return `/projects/#${getEntrySlug(project)}`;
}

export async function getPublishedPosts(lang?: Lang) {
  const posts = await getCollection("blog", ({ data }) => {
    return !data.draft && (!lang || data.lang === lang);
  });

  return posts.sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime());
}

export async function getFeaturedPosts(lang?: Lang) {
  return (await getPublishedPosts(lang)).filter((post) => post.data.featured);
}

export async function getAllTags(lang?: Lang) {
  const posts = await getPublishedPosts(lang);
  const tags = new Map<string, number>();

  for (const post of posts) {
    for (const tag of post.data.tags) {
      tags.set(tag, (tags.get(tag) ?? 0) + 1);
    }
  }

  return Array.from(tags.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

export async function getPostsByTag(tag: string, lang?: Lang) {
  return (await getPublishedPosts(lang)).filter((post) => post.data.tags.includes(tag));
}

export async function getRelatedPosts(post: BlogEntry, limit = 3) {
  const posts = await getPublishedPosts(post.data.lang);
  const related = posts
    .filter((candidate) => candidate.id !== post.id)
    .map((candidate) => {
      const sharedTags = candidate.data.tags.filter((tag) => post.data.tags.includes(tag)).length;
      const sameSeries = candidate.data.series && candidate.data.series === post.data.series ? 2 : 0;
      const categoryMatch = candidate.data.category && candidate.data.category === post.data.category ? 1 : 0;
      return { post: candidate, score: sharedTags * 3 + sameSeries + categoryMatch };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || b.post.data.pubDate.getTime() - a.post.data.pubDate.getTime())
    .slice(0, limit)
    .map((item) => item.post);

  return related;
}

export async function getProjects() {
  return (await getCollection("projects", ({ data }) => !data.draft))
    .sort((a, b) => {
      const featuredScore = Number(b.data.featured) - Number(a.data.featured);
      return featuredScore || b.data.order - a.data.order || b.data.title.localeCompare(a.data.title);
    });
}
