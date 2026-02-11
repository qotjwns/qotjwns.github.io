// 역할: 블로그 글 목록과 태그 필터 UI를 렌더링합니다.
import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { fetchPosts } from "../lib/notion.js";
import { site } from "../content/site.js";
import { ROUTES } from "../constants/routes.js";

function formatDate(dateString) {
  if (!dateString) {
    return "";
  }
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    return dateString;
  }
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(date);
}

export default function BlogPage() {
  const location = useLocation();
  const [posts, setPosts] = useState([]);
  const [state, setState] = useState("loading");
  const [, setError] = useState(null);
  const tags = site.blog.tags || [];
  const activeTag = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get("tag") || "";
  }, [location.search]);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  useEffect(() => {
    let active = true;
    setState("loading");
    fetchPosts(activeTag)
      .then((data) => {
        if (!active) {
          return;
        }
        const items = Array.isArray(data?.posts) ? data.posts : data || [];
        setPosts(items);
        setState("ready");
      })
      .catch((err) => {
        if (!active) {
          return;
        }
        setError(err);
        setState("error");
      });

    return () => {
      active = false;
    };
  }, [activeTag]);

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

      {state === "loading" ? (
        <p className="blog-status">Loading posts...</p>
      ) : null}
      {state === "error" ? (
        <div className="blog-status">
          <p>Failed to load posts.</p>
        </div>
      ) : null}
      {showEmpty ? <p className="blog-status">{site.blog.emptyMessage}</p> : null}

      {state === "ready" && posts.length > 0 ? (
        <ul className="blog-list">
          {posts.map((post) => (
            <li className="blog-item" key={post.id}>
              <div className="blog-meta">
                <span className="blog-date">{formatDate(post.date)}</span>
                {post.tags?.length ? (
                  <div className="blog-tags">
                    {post.tags.map((tag) => (
                      <span className="blog-tag" key={tag}>
                        {tag}
                      </span>
                    ))}
                  </div>
                ) : null}
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
