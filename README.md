# qotjwns.github.io

Portfolio/blog SPA powered by React + Vite.
Blog data is served from Notion through a Cloudflare Worker proxy.

## Local development

### 1) Install dependencies

```bash
npm install
```

### 2) Configure local env

Create `.env.local`:

```bash
VITE_NOTION_API_BASE=http://localhost:8787
```

Create `.dev.vars` for Worker local run:

```bash
NOTION_TOKEN=your_notion_token
NOTION_DATABASE_ID=your_notion_database_id
CORS_ORIGIN=http://localhost:5173
```

### 3) Run both servers

Terminal A:

```bash
npm run dev
```

Terminal B:

```bash
npx wrangler dev
```

## Build

```bash
npm run build
npm run preview
```

## Production deployment

### 1) Deploy Worker

```bash
npx wrangler login
npx wrangler secret put NOTION_TOKEN
npx wrangler secret put NOTION_DATABASE_ID
npx wrangler secret put CORS_ORIGIN
npx wrangler deploy
```

### 2) Set frontend production API base

Create `.env.production`:

```bash
VITE_NOTION_API_BASE=https://<your-worker>.workers.dev
```

### 3) Deploy site

Push to `main`; GitHub Actions deploys to GitHub Pages.

## Security rules

- Never commit secrets (`NOTION_TOKEN`, `.dev.vars`, `.env.local`).
- Keep `CORS_ORIGIN` strict (single production origin, no wildcard).
- Rotate Notion token immediately if exposed.
