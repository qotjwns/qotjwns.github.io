# Notion Proxy Worker

This worker proxies Notion API requests so browser clients never see your Notion token.

## Local setup

Create `.dev.vars` in project root:

```bash
NOTION_TOKEN=your_notion_token
NOTION_DATABASE_ID=your_notion_database_id
CORS_ORIGIN=http://localhost:5173
```

`CORS_ORIGIN` is required and should be a strict allowlist value.
For multiple origins, provide comma-separated values.

## Run locally

```bash
npx wrangler dev
```

## Deploy

```bash
npx wrangler login
npx wrangler secret put NOTION_TOKEN
npx wrangler secret put NOTION_DATABASE_ID
npx wrangler secret put CORS_ORIGIN
npx wrangler deploy
```

After deploy, set `VITE_NOTION_API_BASE` in frontend env to your worker URL.
