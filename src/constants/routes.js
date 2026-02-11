// 역할: 앱에서 사용하는 라우트 경로 상수를 중앙 관리합니다.
export const ROUTES = {
  home: "/",
  about: "/about",
  project: "/project",
  blog: "/blog",
  blogPost(slug) {
    return `/blog/${slug}`;
  },
};
