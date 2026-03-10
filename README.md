# qotjwns.github.io

React + Vite 기반 개인 포트폴리오/블로그 SPA입니다.
블로그는 `Cloudflare Worker`를 통해 Notion API를 프록시하므로 브라우저에서 Notion 토큰이 노출되지 않습니다.

- Live: https://qotjwns.github.io

## 핵심 기능

- 섹션형 랜딩(about, project) 구성
- `/blog`, `/blog/:slug` 라우팅으로 목록/상세 페이지 제공
- 태그 기반 글 필터링
- 라이트/다크 테마 토글
- Worker 기반 Notion API 프록시:
  - 입력 값 검증
  - CORS 허용 도메인 제어
  - 에러 처리 및 캐시 헤더

## 기술 스택

- Frontend: React, React Router, Vite
- Proxy: Cloudflare Workers + Wrangler
- Content Source: Notion Data Source / Database
- Deployment: GitHub Pages(frontend), Cloudflare Workers(api)

## 폴더 구조

```txt
.
├─ src/                  # SPA 본문
│  ├─ components/
│  ├─ pages/
│  ├─ lib/notion.js      # 프록시 API 클라이언트
│  ├─ content/site.js    # 정적 메타/섹션 데이터
│  └─ config/env.js      # API base 정규화
├─ workers/notion-proxy/ # Cloudflare Worker 코드
│  └─ src/index.js
├─ .github/workflows/
│  └─ deploy.yml
├─ wrangler.toml
└─ vite.config.js
```

## 로컬 실행

### 1. 의존성 설치

```bash
npm install
```

### 2. 프론트엔드 환경 변수

로컬 개발 시 Worker 주소를 명시합니다.

```bash
# .env.local
VITE_NOTION_API_BASE=http://localhost:8787
```

`VITE_NOTION_API_BASE`를 생략하면 기본값은 `/api/notion`입니다.

### 3. Worker 환경 변수

루트 경로에 `.dev.vars` 생성:

```bash
NOTION_TOKEN=your_notion_token

# 둘 중 하나는 필수
NOTION_DATA_SOURCE_ID=your_notion_data_source_id
# 또는
NOTION_DATABASE_ID=your_notion_database_id

# 다중 허용 도메인: 콤마 구분
CORS_ORIGIN=http://localhost:5173,https://qotjwns.github.io
```

### 4. 서버 실행

```bash
npm run dev          # 프론트엔드 (5173)
npm run worker:dev   # Worker (8787)
```

## API 엔드포인트

- `GET /api/notion/health`, `GET /health`
- `GET /api/notion/posts?tag=<tag>`
- `GET /api/notion/posts/:slug`

## 배포

### Worker 배포

```bash
npx wrangler login
npx wrangler secret put NOTION_TOKEN
npx wrangler secret put NOTION_DATA_SOURCE_ID  # 또는 NOTION_DATABASE_ID
npx wrangler secret put CORS_ORIGIN
npm run worker:deploy
```

### Frontend 배포

```bash
# .env.production
VITE_NOTION_API_BASE=https://<your-worker>.workers.dev
```

`main` 브랜치 푸시 시 `.github/workflows/deploy.yml`이 실행되어 GitHub Pages에 배포됩니다.

## Notion 페이지 스키마

Worker가 매핑에 사용하는 속성은 아래와 같습니다.

- `Title` (title)
- `Slug` (rich_text)
- `Published` (checkbox)
- `Date` (date)
- `Summary` (rich_text)
- `tags` (multi_select)

속성명이 다르면 목록/상세 데이터가 비어 보일 수 있습니다.

## 보안 가이드

- `.dev.vars` 및 `.env*`에 실제 `NOTION_TOKEN`을 직접 커밋하지 마세요.
- `CORS_ORIGIN`은 실제 사용 도메인만 허용하도록 최소화하세요.
