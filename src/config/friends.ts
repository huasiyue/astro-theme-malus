import { malusConfig } from "@/config/malus.config";
import { siteConfig } from "@/config/site";
import type { FriendLink } from "@/config/defineConfig";

export type { FriendLink };

export const friendsConfig = malusConfig.friends;

export const ownerFriendCard: FriendLink =
  friendsConfig.owner ?? {
    name: siteConfig.siteName,
    description: siteConfig.siteDescription,
    url: siteConfig.siteUrl,
    avatar: siteConfig.author.avatarUrl,
    tags: ["Astro", "Template", siteConfig.siteName],
    featured: true
  };

export const friendLinks: FriendLink[] = malusConfig.features.friends ? friendsConfig.links : [];

export const friendApplyTemplate = friendsConfig.applyTemplate;
