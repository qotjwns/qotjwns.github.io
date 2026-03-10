# Notion Proxy Worker

This worker proxies Notion API requests so browser clients never see your Notion token.

## Features

- Removes need to expose Notion API tokens to the browser
- Validates query/body input on proxy endpoints
- Restricts CORS by explicit allowlist
- Sets cache headers for read-heavy endpoints

## Local Setup

Create `.dev.vars` at repository root:

```bash
NOTION_TOKEN=your_notion_token

# One of these is required
NOTION_DATA_SOURCE_ID=your_notion_data_source_id
# or
NOTION_DATABASE_ID=your_notion_database_id

# Comma-separated allowed origins
CORS_ORIGIN=http://localhost:5173
```

`CORS_ORIGIN` should be an allowlist, not `*`.

## Run Locally

```bash
npx wrangler dev
```

Worker will run on `http://localhost:8787` by default.

## Deploy

```bash
npx wrangler login
npx wrangler secret put NOTION_TOKEN
npx wrangler secret put NOTION_DATA_SOURCE_ID  # or NOTION_DATABASE_ID
npx wrangler secret put CORS_ORIGIN
npx wrangler deploy
```

After deploy, set `VITE_NOTION_API_BASE` in frontend env to your worker URL:

```bash
VITE_NOTION_API_BASE=https://<your-worker>.workers.dev
```
