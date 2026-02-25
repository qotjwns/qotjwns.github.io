// 역할: 단일 블로그 글 상세 페이지를 불러와 렌더링합니다.
import { Link, useParams } from "react-router-dom";
import NotionRenderer from "../components/NotionRenderer.jsx";
import { fetchPost } from "../lib/notion.js";
import { ROUTES } from "../constants/routes.js";
import useAsyncValue from "../hooks/useAsyncValue.js";
import useScrollTop from "../hooks/useScrollTop.js";
import PostTags from "../components/PostTags.jsx";
import StatusMessage from "../components/StatusMessage.jsx";
import { formatDate } from "../utils/date.js";

export default function BlogPostPage() {
  const { slug } = useParams();
  const { data: post, state, error } = useAsyncValue(
    async () => {
      const data = await fetchPost(slug);
      return data?.post || data;
    },
    [slug],
    null
  );

  useScrollTop([slug]);

  const backLink = (
    <Link className="blog-back blog-back-icon" to={ROUTES.blog} aria-label="Back to blog">
      <span aria-hidden="true">←</span>
      <span className="sr-only">Back to blog</span>
    </Link>
  );

  if (state === "loading") {
    return (
      <main className="page blog-post">
        <StatusMessage>Loading post...</StatusMessage>
      </main>
    );
  }

  if (state === "error") {
    const isNotFound = error?.status === 404;
    return (
      <main className="page blog-post">
        <StatusMessage>
          {isNotFound ? "Post not found." : "Failed to load this post."}
        </StatusMessage>
        {backLink}
      </main>
    );
  }

  if (!post) {
    return (
      <main className="page blog-post">
        <StatusMessage>Post not found.</StatusMessage>
        {backLink}
      </main>
    );
  }

  return (
    <main className="page blog-post">
      <section className="blog-post-shell">
        <header className="blog-post-header">
          <div className="blog-post-title-row">
            <h1 className="blog-post-title">{post.title}</h1>
            {backLink}
          </div>
          <div className="blog-post-meta">
            {post.date ? (
              <span>
                {formatDate(post.date, {
                  year: "numeric",
                  month: "long",
                  day: "2-digit",
                })}
              </span>
            ) : null}
            <PostTags tags={post.tags} />
          </div>
          {post.summary ? (
            <p className="blog-post-summary">{post.summary}</p>
          ) : null}
        </header>

        <article className="blog-post-content">
          <NotionRenderer blocks={post.blocks} />
        </article>
      </section>
    </main>
  );
}
