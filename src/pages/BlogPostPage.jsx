import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import NotionRenderer from "../components/NotionRenderer.jsx";
import { fetchPost } from "../lib/notion.js";

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
    month: "long",
    day: "2-digit",
  }).format(date);
}

export default function BlogPostPage() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [state, setState] = useState("loading");
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [slug]);

  useEffect(() => {
    let active = true;
    setState("loading");
    fetchPost(slug)
      .then((data) => {
        if (!active) {
          return;
        }
        setPost(data?.post || data);
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
  }, [slug]);

  if (state === "loading") {
    return (
      <main className="page blog-post">
        <p className="blog-status">Loading post...</p>
      </main>
    );
  }

  if (state === "error") {
    const isNotFound = error?.status === 404;
    return (
      <main className="page blog-post">
        <p className="blog-status">
          {isNotFound ? "Post not found." : "Failed to load this post."}
        </p>
        <Link className="blog-back" to="/blog">
          Back to blog
        </Link>
      </main>
    );
  }

  if (!post) {
    return (
      <main className="page blog-post">
        <p className="blog-status">Post not found.</p>
        <Link className="blog-back" to="/blog">
          Back to blog
        </Link>
      </main>
    );
  }

  return (
    <main className="page blog-post">
      <Link className="blog-back" to="/blog">
        Back to blog
      </Link>
      <header className="blog-post-header">
        <h1 className="blog-post-title">{post.title}</h1>
        <div className="blog-post-meta">
          {post.date ? <span>{formatDate(post.date)}</span> : null}
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
        {post.summary ? (
          <p className="blog-post-summary">{post.summary}</p>
        ) : null}
      </header>

      <article className="blog-post-content">
        <NotionRenderer blocks={post.blocks} />
      </article>
    </main>
  );
}
