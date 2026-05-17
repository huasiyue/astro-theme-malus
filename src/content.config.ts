import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const lang = z.enum(["zh", "en"]).default("zh");

const blog = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/blog" }),
  schema: ({ image }) => z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    lang,
    tags: z.array(z.string()).default([]),
    category: z.string().optional(),
    series: z.string().optional(),
    cover: image().optional(),
    coverAlt: z.string().optional(),
    draft: z.boolean().default(false),
    featured: z.boolean().default(false)
  })
});

const projects = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/projects" }),
  schema: ({ image }) => z.object({
    title: z.string(),
    description: z.string(),
    lang,
    status: z.enum(["active", "paused", "archived"]).default("active"),
    stack: z.array(z.string()).default([]),
    repoUrl: z.url().optional(),
    demoUrl: z.url().optional(),
    cover: image().optional(),
    coverAlt: z.string().optional(),
    order: z.number().default(0),
    draft: z.boolean().default(false),
    featured: z.boolean().default(false)
  })
});

export const collections = { blog, projects };
