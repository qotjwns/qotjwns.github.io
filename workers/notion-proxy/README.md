# Notion Proxy Worker

This worker proxies Notion API requests so the frontend never sees your token.

## Setup

1. Install Wrangler
2. Create `.dev.vars` (do not commit it) with:

```
NOTION_TOKEN=your_notion_token
NOTION_DATABASE_ID=your_database_id
# Optional
CORS_ORIGIN=https://qotjwns.github.io
```

## Development

```
wrangler dev
```

## Deploy

```
wrangler deploy
```

After deploy, set `VITE_NOTION_API_BASE` to your worker URL.
