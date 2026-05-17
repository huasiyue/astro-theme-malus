import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { siteConfig } from "@/config/site";
import { getPostUrl, getPublishedPosts } from "@/utils/posts";

export async function GET(context: APIContext) {
  if (!siteConfig.features.rss || !siteConfig.plugins.rss) {
    return new Response("RSS is disabled.", { status: 404 });
  }

  const posts = await getPublishedPosts("zh");
  const site = context.site ?? new URL(siteConfig.siteUrl);

  return rss({
    title: siteConfig.siteName,
    description: siteConfig.siteDescription,
    site,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: getPostUrl(post)
    })),
    customData: `<language>zh-CN</language>`
  });
}
