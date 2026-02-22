// 역할: 블로그 글 목록과 태그 필터 UI를 렌더링합니다.
import { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { fetchPosts } from "../lib/notion.js";
import { site } from "../content/site.js";
import { ROUTES } from "../constants/routes.js";
import useAsyncValue from "../hooks/useAsyncValue.js";
import useScrollTop from "../hooks/useScrollTop.js";
import PostTags from "../components/PostTags.jsx";
import StatusMessage from "../components/StatusMessage.jsx";
import { formatDate } from "../utils/date.js";

export default function BlogPage() {
  const location = useLocation();
  const tags = site.blog.tags || [];
  const activeTag = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get("tag") || "";
  }, [location.search]);

  const { data: posts, state } = useAsyncValue(
    async () => {
      const data = await fetchPosts(activeTag);
      return Array.isArray(data?.posts) ? data.posts : data || [];
    },
    [activeTag],
    []
  );

  useScrollTop([]);

  const showEmpty = state === "ready" && posts.length === 0;
  const tagLinks = [
    { id: "", label: "All" },
    ...tags.map((tag) => ({ id: tag.id, label: tag.label })),
  ];
  return (
    <main className="page blog-page">
      <header className="section-header">
        <h1 className="section-title">{site.blog.title}</h1>
        <p className="section-description">{site.blog.description}</p>
      </header>

      {tagLinks.length > 1 ? (
        <nav className="blog-tags-bar" aria-label="Blog tags">
          {tagLinks.map((tag) => {
            const isActive = tag.id === activeTag;
            const target = tag.id
              ? `${ROUTES.blog}?tag=${encodeURIComponent(tag.id)}`
              : ROUTES.blog;
            return (
              <Link
                className={`blog-tag-filter${isActive ? " active" : ""}`}
                key={tag.id || "all"}
                to={target}
              >
                {tag.id ? `#${tag.label}` : tag.label}
              </Link>
            );
          })}
        </nav>
      ) : null}

      {state === "loading" ? <StatusMessage>Loading posts...</StatusMessage> : null}
      {state === "error" ? (
        <StatusMessage as="div">Failed to load posts.</StatusMessage>
      ) : null}
      {showEmpty ? <StatusMessage>{site.blog.emptyMessage}</StatusMessage> : null}

      {state === "ready" && posts.length > 0 ? (
        <ul className="blog-list">
          {posts.map((post) => (
            <li className="blog-item" key={post.id}>
              <div className="blog-meta">
                <span className="blog-date">
                  {formatDate(post.date, {
                    year: "numeric",
                    month: "short",
                    day: "2-digit",
                  })}
                </span>
                <PostTags tags={post.tags} />
              </div>
              <div className="blog-body">
                <Link className="blog-title" to={ROUTES.blogPost(post.slug)}>
                  {post.title}
                </Link>
                {post.summary ? (
                  <p className="blog-summary">{post.summary}</p>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      ) : null}
    </main>
  );
}
