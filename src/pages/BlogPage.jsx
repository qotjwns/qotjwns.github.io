import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchPosts, getApiBase } from "../lib/notion.js";
import { site } from "../content/site.js";

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
  const [posts, setPosts] = useState([]);
  const [state, setState] = useState("loading");
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  useEffect(() => {
    let active = true;
    setState("loading");
    fetchPosts()
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
  }, []);

  const showEmpty = state === "ready" && posts.length === 0;
  const apiBase = getApiBase();
  const isDefaultBase = apiBase === "/api/notion";

  return (
    <main className="page blog-page">
      <header className="section-header">
        <h1 className="section-title">{site.blog.title}</h1>
        <p className="section-description">{site.blog.description}</p>
      </header>

      {state === "loading" ? (
        <p className="blog-status">Loading posts...</p>
      ) : null}
      {state === "error" ? (
        <div className="blog-status">
          <p>Failed to load posts.</p>
          {isDefaultBase ? (
            <p className="blog-hint">
              Set <code>VITE_NOTION_API_BASE</code> to your proxy URL.
            </p>
          ) : null}
          {error?.message ? <p className="blog-hint">{error.message}</p> : null}
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
                <Link className="blog-title" to={`/blog/${post.slug}`}>
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
