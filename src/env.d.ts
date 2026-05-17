/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_AVATAR_URL?: string;
  readonly PUBLIC_SITE_DESCRIPTION?: string;
  readonly PUBLIC_SITE_URL?: string;
  readonly PUBLIC_GITHUB_URL?: string;
  readonly PUBLIC_AUTHOR_NAME?: string;
  readonly PUBLIC_AUTHOR_HANDLE?: string;
  readonly PUBLIC_LAUNCHED_AT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
