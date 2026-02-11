const NOTION_VERSION = "2022-06-28";

const PROPS = {
  title: "Title",
  slug: "Slug",
  published: "Published",
  date: "Date",
  summary: "Summary",
  tags: "tags",
};

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
  const tags = properties[PROPS.tags]?.multi_select?.map((tag) => tag.name) || [];

  return {
    id: page.id,
    title,
    slug,
    summary,
    date,
    tags,
  };
}

function withCors(headers, origin) {
  headers.set("Access-Control-Allow-Origin", origin);
  headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");
  headers.set("Access-Control-Allow-Headers", "Content-Type");
  return headers;
}

function jsonResponse(data, { status = 200, origin = "*" } = {}) {
  const headers = withCors(new Headers(), origin);
  headers.set("Content-Type", "application/json");
  return new Response(JSON.stringify(data), { status, headers });
}

async function notionFetch(url, env, options = {}) {
  const headers = {
    Authorization: `Bearer ${env.NOTION_TOKEN}`,
    "Notion-Version": NOTION_VERSION,
    "Content-Type": "application/json",
    ...options.headers,
  };

  return fetch(url, { ...options, headers });
}

async function queryDatabase(env, body) {
  const url = `https://api.notion.com/v1/databases/${env.NOTION_DATABASE_ID}/query`;
  const response = await notionFetch(url, env, {
    method: "POST",
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Failed to query Notion database");
  }

  return response.json();
}

async function fetchBlocks(env, blockId) {
  let cursor;
  const blocks = [];

  do {
    const url = new URL(
      `https://api.notion.com/v1/blocks/${blockId}/children`
    );
    url.searchParams.set("page_size", "100");
    if (cursor) {
      url.searchParams.set("start_cursor", cursor);
    }

    const response = await notionFetch(url.toString(), env);
    if (!response.ok) {
      const message = await response.text();
      throw new Error(message || "Failed to fetch Notion blocks");
    }

    const data = await response.json();
    blocks.push(...data.results);
    cursor = data.has_more ? data.next_cursor : null;
  } while (cursor);

  return blocks;
}

export default {
  async fetch(request, env) {
    const origin = env.CORS_ORIGIN || "*";

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: withCors(new Headers(), origin) });
    }

    if (!env.NOTION_TOKEN || !env.NOTION_DATABASE_ID) {
      return jsonResponse(
        { error: "Missing NOTION_TOKEN or NOTION_DATABASE_ID" },
        { status: 500, origin }
      );
    }

    const url = new URL(request.url);
    const normalizedPath = url.pathname.replace(/^\/api\/notion/, "");

    if (normalizedPath === "/" || normalizedPath === "") {
      return jsonResponse({ ok: true }, { origin });
    }

    if (normalizedPath === "/posts") {
      const tag = url.searchParams.get("tag");
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
          sorts: [{ property: PROPS.date, direction: "descending" }],
        });

        const posts = data.results
          .map(mapPageToPost)
          .filter((post) => post.slug);

        return jsonResponse({ posts }, { origin });
      } catch (error) {
        return jsonResponse(
          { error: error.message || "Failed to load posts" },
          { status: 500, origin }
        );
      }
    }

    if (normalizedPath.startsWith("/posts/")) {
      const slug = decodeURIComponent(normalizedPath.replace("/posts/", ""));

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
          page_size: 1,
        });

        if (!data.results.length) {
          return jsonResponse({ error: "Not found" }, { status: 404, origin });
        }

        const page = data.results[0];
        const post = mapPageToPost(page);
        const blocks = await fetchBlocks(env, page.id);

        return jsonResponse({ post: { ...post, blocks } }, { origin });
      } catch (error) {
        return jsonResponse(
          { error: error.message || "Failed to load post" },
          { status: 500, origin }
        );
      }
    }

    return jsonResponse({ error: "Not found" }, { status: 404, origin });
  },
};
