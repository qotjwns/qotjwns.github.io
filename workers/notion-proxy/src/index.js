const NOTION_VERSION = "2022-06-28";

const PROPS = {
  title: "Title",
  slug: "Slug",
  published: "Published",
  date: "Date",
  summary: "Summary",
  tags: "tags",
};

const ALLOWED_METHODS = "GET, OPTIONS";
const TAG_PATTERN = /^[a-z0-9_-]{1,32}$/i;
const SLUG_PATTERN = /^[a-z0-9][a-z0-9-_]{0,99}$/i;

function parseAllowedOrigins(rawOrigins) {
  return (rawOrigins || "")
    .split(",")
    .map((origin) => origin.trim().replace(/\/$/, ""))
    .filter(Boolean);
}

function logError(scope, error, meta = {}) {
  const message = error instanceof Error ? error.message : String(error);
  const stack = error instanceof Error ? error.stack : null;
  console.error(`[${scope}]`, JSON.stringify(meta), message, stack || "");
}

function getPlainText(richText) {
  if (!richText || richText.length === 0) {
    return "";
  }
  return richText.map((item) => item.plain_text || "").join("");
}

function mapPageToPost(page) {
  const properties = page.properties || {};
  const title = getPlainText(properties[PROPS.title]?.title) || "Untitled";
  const slug = getPlainText(properties[PROPS.slug]?.rich_text).trim();
  const summary = getPlainText(properties[PROPS.summary]?.rich_text);
  const date = properties[PROPS.date]?.date?.start || page.created_time;
  const tags =
    properties[PROPS.tags]?.multi_select?.map((tag) => tag.name) || [];

  return {
    id: page.id,
    title,
    slug,
    summary,
    date,
    tags,
  };
}

function withCors(headers, corsOrigin) {
  if (corsOrigin) {
    headers.set("Access-Control-Allow-Origin", corsOrigin);
  }
  headers.set("Access-Control-Allow-Methods", ALLOWED_METHODS);
  headers.set("Access-Control-Allow-Headers", "Content-Type");
  headers.set("Access-Control-Max-Age", "86400");
  headers.set("Vary", "Origin");
  return headers;
}

function jsonResponse(data, options) {
  const {
    status = 200,
    corsOrigin,
    cacheControl = "no-store",
    extraHeaders,
  } = options || {};

  const headers = withCors(new Headers(), corsOrigin);
  headers.set("Content-Type", "application/json; charset=utf-8");
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("Cache-Control", cacheControl);

  if (extraHeaders) {
    Object.entries(extraHeaders).forEach(([key, value]) => {
      headers.set(key, value);
    });
  }

  return new Response(JSON.stringify(data), { status, headers });
}

function getCorsOrigin(request, allowedOrigins) {
  const requestOrigin = request.headers.get("Origin");
  if (!requestOrigin) {
    return allowedOrigins[0];
  }
  const normalizedOrigin = requestOrigin.replace(/\/$/, "");
  return allowedOrigins.includes(normalizedOrigin) ? normalizedOrigin : null;
}

function normalizePath(pathname) {
  const apiPrefix = "/api/notion";
  if (pathname.startsWith(apiPrefix)) {
    const normalized = pathname.slice(apiPrefix.length);
    return normalized || "/";
  }
  return pathname || "/";
}

function sanitizeTag(rawTag) {
  if (!rawTag) {
    return "";
  }
  const tag = rawTag.trim();
  if (!TAG_PATTERN.test(tag)) {
    return null;
  }
  return tag;
}

function sanitizeSlug(rawSlug) {
  const slug = (rawSlug || "").trim();
  if (!SLUG_PATTERN.test(slug)) {
    return null;
  }
  return slug;
}

async function notionFetch(url, env, options = {}) {
  const headers = {
    Authorization: `Bearer ${env.NOTION_TOKEN}`,
    "Notion-Version": NOTION_VERSION,
    "Content-Type": "application/json",
    ...options.headers,
  };

  const response = await fetch(url, { ...options, headers });
  if (!response.ok) {
    const body = await response.text().catch(() => "");
    const error = new Error(`Notion API request failed: ${response.status}`);
    error.status = response.status;
    error.details = body;
    throw error;
  }

  return response.json();
}

async function queryDatabase(env, body) {
  const url = `https://api.notion.com/v1/databases/${env.NOTION_DATABASE_ID}/query`;
  return notionFetch(url, env, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

async function fetchBlocks(env, blockId) {
  let cursor;
  const blocks = [];

  do {
    const url = new URL(`https://api.notion.com/v1/blocks/${blockId}/children`);
    url.searchParams.set("page_size", "100");
    if (cursor) {
      url.searchParams.set("start_cursor", cursor);
    }

    const data = await notionFetch(url.toString(), env);
    blocks.push(...data.results);
    cursor = data.has_more ? data.next_cursor : null;
  } while (cursor);

  return blocks;
}

export default {
  async fetch(request, env) {
    const requestId = crypto.randomUUID();
    const allowedOrigins = parseAllowedOrigins(env.CORS_ORIGIN);

    if (allowedOrigins.length === 0) {
      return jsonResponse(
        {
          error: "Service misconfigured",
          requestId,
        },
        { status: 500 }
      );
    }

    const corsOrigin = getCorsOrigin(request, allowedOrigins);
    if (request.headers.get("Origin") && !corsOrigin) {
      return jsonResponse(
        { error: "Origin not allowed", requestId },
        { status: 403, corsOrigin: allowedOrigins[0] }
      );
    }

    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: withCors(new Headers(), corsOrigin),
      });
    }

    if (request.method !== "GET") {
      return jsonResponse(
        { error: "Method not allowed", requestId },
        {
          status: 405,
          corsOrigin,
          extraHeaders: { Allow: ALLOWED_METHODS },
        }
      );
    }

    if (!env.NOTION_TOKEN || !env.NOTION_DATABASE_ID) {
      return jsonResponse(
        { error: "Service misconfigured", requestId },
        { status: 500, corsOrigin }
      );
    }

    const url = new URL(request.url);
    const normalizedPath = normalizePath(url.pathname);

    if (normalizedPath === "/" || normalizedPath === "/health") {
      return jsonResponse(
        { ok: true, requestId },
        { corsOrigin, cacheControl: "no-store" }
      );
    }

    if (normalizedPath === "/posts") {
      const tag = sanitizeTag(url.searchParams.get("tag"));
      if (url.searchParams.get("tag") && !tag) {
        return jsonResponse(
          { error: "Invalid tag", requestId },
          { status: 400, corsOrigin }
        );
      }

      try {
        const filter = tag
          ? {
              and: [
                {
                  property: PROPS.published,
                  checkbox: { equals: true },
                },
                {
                  property: PROPS.tags,
                  multi_select: { contains: tag },
                },
              ],
            }
          : {
              property: PROPS.published,
              checkbox: { equals: true },
            };

        const data = await queryDatabase(env, {
          filter,
          sorts: [
            { property: PROPS.date, direction: "descending" },
            { timestamp: "last_edited_time", direction: "descending" },
          ],
          page_size: 100,
        });

        const posts = data.results.map(mapPageToPost).filter((post) => post.slug);

        return jsonResponse(
          { posts, requestId },
          {
            corsOrigin,
            cacheControl: "public, max-age=60, s-maxage=300, stale-while-revalidate=300",
          }
        );
      } catch (error) {
        logError("posts-list", error, { requestId, tag });
        return jsonResponse(
          { error: "Failed to load posts", requestId },
          { status: 500, corsOrigin }
        );
      }
    }

    if (normalizedPath.startsWith("/posts/")) {
      const encodedSlug = normalizedPath.replace("/posts/", "");
      let decodedSlug;
      try {
        decodedSlug = decodeURIComponent(encodedSlug);
      } catch {
        return jsonResponse(
          { error: "Invalid slug", requestId },
          { status: 400, corsOrigin }
        );
      }

      const slug = sanitizeSlug(decodedSlug);
      if (!slug) {
        return jsonResponse(
          { error: "Invalid slug", requestId },
          { status: 400, corsOrigin }
        );
      }

      try {
        const data = await queryDatabase(env, {
          filter: {
            and: [
              {
                property: PROPS.slug,
                rich_text: { equals: slug },
              },
              {
                property: PROPS.published,
                checkbox: { equals: true },
              },
            ],
          },
          sorts: [
            { property: PROPS.date, direction: "descending" },
            { timestamp: "last_edited_time", direction: "descending" },
          ],
          page_size: 2,
        });

        if (!data.results.length) {
          return jsonResponse(
            { error: "Not found", requestId },
            { status: 404, corsOrigin }
          );
        }

        if (data.results.length > 1) {
          console.warn(
            `[slug-duplicate] requestId=${requestId} slug=${slug} count=${data.results.length}`
          );
        }

        const page = data.results[0];
        const post = mapPageToPost(page);
        const blocks = await fetchBlocks(env, page.id);

        return jsonResponse(
          { post: { ...post, blocks }, requestId },
          {
            corsOrigin,
            cacheControl: "public, max-age=60, s-maxage=600, stale-while-revalidate=600",
          }
        );
      } catch (error) {
        logError("post-detail", error, { requestId, slug });
        return jsonResponse(
          { error: "Failed to load post", requestId },
          { status: 500, corsOrigin }
        );
      }
    }

    return jsonResponse(
      { error: "Not found", requestId },
      { status: 404, corsOrigin }
    );
  },
};
