# qotjwns.github.io

React + Vite 기반 포트폴리오/블로그 SPA입니다.
블로그 데이터는 Cloudflare Worker 프록시를 통해 Notion에서 불러옵니다.

사이트 방문: [Click here!](https://qotjwns.github.io)


## 로컬 개발

### 1) 의존성 설치

```bash
npm install
```

### 2) 로컬 환경변수 설정

`.env.local` 생성:

```bash
VITE_NOTION_API_BASE=http://localhost:8787
```

Worker 로컬 실행용 `.dev.vars` 생성:

```bash
NOTION_TOKEN=your_notion_token
NOTION_DATABASE_ID=your_notion_database_id
CORS_ORIGIN=http://localhost:5173
```

### 3) 서버 실행

터미널 A:

```bash
npm run dev
```

터미널 B:

```bash
npx wrangler dev
```

## 빌드

```bash
npm run build
npm run preview
```

## 프로덕션 배포

### 1) Worker 배포

```bash
npx wrangler login
npx wrangler secret put NOTION_TOKEN
npx wrangler secret put NOTION_DATABASE_ID
npx wrangler secret put CORS_ORIGIN
npx wrangler deploy
```

### 2) 프론트엔드 API 주소 설정

`.env.production` 생성:

```bash
VITE_NOTION_API_BASE=https://<your-worker>.workers.dev
```

### 3) 사이트 배포

`main` 브랜치에 push하면 GitHub Actions가 GitHub Pages로 자동 배포합니다.
