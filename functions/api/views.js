const jsonHeaders = {
  "Content-Type": "application/json; charset=utf-8",
  "Cache-Control": "no-store",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type"
};

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: jsonHeaders
  });

const normalizeSlug = (value) =>
  String(value || "")
    .trim()
    .replace(/^\/+|\/+$/g, "")
    .slice(0, 220);

const ensureTable = (db) =>
  db
    .prepare(
      "CREATE TABLE IF NOT EXISTS post_views (slug TEXT PRIMARY KEY, views INTEGER NOT NULL DEFAULT 0)"
    )
    .run();

const getViews = async (db, slug) => {
  const row = await db.prepare("SELECT views FROM post_views WHERE slug = ?1").bind(slug).first();
  return Number(row?.views || 0);
};

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: jsonHeaders });
}

export async function onRequestGet({ request, env }) {
  const db = env.BLOG_VIEWS_DB;
  if (!db) return json({ error: "D1 binding BLOG_VIEWS_DB is not configured." }, 501);

  const url = new URL(request.url);
  const slug = normalizeSlug(url.searchParams.get("slug"));
  if (!slug) return json({ error: "Missing slug." }, 400);

  await ensureTable(db);
  return json({ slug, views: await getViews(db, slug) });
}

export async function onRequestPost({ request, env }) {
  const db = env.BLOG_VIEWS_DB;
  if (!db) return json({ error: "D1 binding BLOG_VIEWS_DB is not configured." }, 501);

  const body = await request.json().catch(() => ({}));
  const slug = normalizeSlug(body.slug);
  if (!slug) return json({ error: "Missing slug." }, 400);

  await ensureTable(db);
  await db
    .prepare(
      "INSERT INTO post_views (slug, views) VALUES (?1, 1) ON CONFLICT(slug) DO UPDATE SET views = views + 1"
    )
    .bind(slug)
    .run();

  return json({ slug, views: await getViews(db, slug) });
}
