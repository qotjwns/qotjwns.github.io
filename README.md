# qotjwns.github.io

React + Vite 기반 개인 포트폴리오/블로그 SPA입니다.  
블로그 글은 브라우저에서 Notion 토큰을 직접 노출하지 않도록 Cloudflare Worker 프록시를 통해 조회합니다.

- Live: https://qotjwns.github.io

## 주요 기능

- 섹션형 포트폴리오 랜딩 페이지(`about`, `project`)
- 블로그 목록/상세 페이지 라우팅(`/blog`, `/blog/:slug`)
- 태그 기반 글 필터링
- 라이트/다크 테마 토글
- Notion API 프록시(입력 검증, CORS, 캐시 헤더, 에러 핸들링)

## 기술 스택

- Frontend: React, React Router, Vite
- Backend(Proxy): Cloudflare Workers (Wrangler)
- Content Source: Notion Data Source / Database
- Deploy: GitHub Pages (frontend), Cloudflare Workers (API proxy)

## 프로젝트 구조

```txt
.
├─ src/
│  ├─ components/         # UI 컴포넌트
│  ├─ pages/              # BlogPage, BlogPostPage
│  ├─ lib/notion.js       # 프록시 API 클라이언트
│  ├─ content/site.js     # 정적 사이트 메타/섹션 데이터
│  └─ config/env.js       # VITE_NOTION_API_BASE 정규화
├─ workers/notion-proxy/
│  └─ src/index.js        # Notion 프록시 Worker
├─ .github/workflows/
│  └─ deploy.yml          # GitHub Pages 배포 워크플로우
├─ wrangler.toml
└─ vite.config.js
```

## 시작하기

### 1) 의존성 설치

```bash
npm install
```

### 2) 프론트엔드 환경변수

프로젝트 루트에 `.env.local` 파일을 생성합니다.

```bash
VITE_NOTION_API_BASE=http://localhost:8787
```

### 3) Worker 로컬 시크릿

프로젝트 루트에 `.dev.vars` 파일을 생성합니다.

```bash
NOTION_TOKEN=your_notion_token
# 둘 중 하나는 반드시 필요
NOTION_DATA_SOURCE_ID=your_notion_data_source_id
# 또는
NOTION_DATABASE_ID=your_notion_database_id

# 여러 Origin 허용 시 콤마(,)로 구분
CORS_ORIGIN=http://localhost:5173,https://qotjwns.github.io
```

### 4) 개발 서버 실행

터미널 A:

```bash
npm run dev
```

터미널 B:

```bash
npm run worker:dev
```

기본 주소:

- Frontend: `http://localhost:5173`
- Worker: `http://localhost:8787`

## npm 스크립트

```bash
npm run dev           # Vite 개발 서버
npm run build         # 프로덕션 빌드
npm run preview       # 빌드 결과 로컬 확인
npm run worker:dev    # Cloudflare Worker 로컬 실행
npm run worker:deploy # Cloudflare Worker 배포
```

## Notion 데이터 스키마

Worker는 아래 속성명을 기준으로 글을 매핑합니다.

- `Title` (title)
- `Slug` (rich_text, slug 용도)
- `Published` (checkbox)
- `Date` (date)
- `Summary` (rich_text)
- `tags` (multi_select)

속성명이 다르면 블로그 목록/상세 조회가 실패하거나 빈 값으로 표시될 수 있습니다.

## API 엔드포인트 (Worker)

- `GET /api/notion/health` 또는 `GET /health`
- `GET /api/notion/posts?tag=<tag>`
- `GET /api/notion/posts/:slug`

`VITE_NOTION_API_BASE`를 설정하지 않으면 프론트엔드는 기본값 `/api/notion`을 사용합니다.

## 배포

### 1) Worker 배포

```bash
npx wrangler login
npx wrangler secret put NOTION_TOKEN
npx wrangler secret put NOTION_DATA_SOURCE_ID
# 또는 NOTION_DATABASE_ID
npx wrangler secret put CORS_ORIGIN
npm run worker:deploy
```

### 2) 프론트엔드 API 주소 설정

프로젝트 루트에 `.env.production` 파일을 생성/수정합니다.

```bash
VITE_NOTION_API_BASE=https://<your-worker>.workers.dev
```

### 3) GitHub Pages 배포

`main` 브랜치에 push하면 `.github/workflows/deploy.yml`이 실행되어 `dist`가 GitHub Pages에 배포됩니다.

## 보안 주의사항

- `.dev.vars`에는 실제 Notion 토큰이 들어가므로 절대 커밋하지 마세요.
- `CORS_ORIGIN`은 필요한 도메인만 허용하도록 최소화하세요.
