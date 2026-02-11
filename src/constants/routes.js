export const ROUTES = {
  home: "/",
  about: "/about",
  project: "/project",
  blog: "/blog",
  blogPost(slug) {
    return `/blog/${slug}`;
  },
};
