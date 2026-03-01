// 역할: 단일 블로그 글 상세 페이지를 불러와 렌더링합니다.
import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import NotionRenderer, {
  getHeadingsFromBlocks,
} from "../components/NotionRenderer.jsx";
import { fetchPost } from "../lib/notion.js";
import { ROUTES } from "../constants/routes.js";
import useActiveHeading from "../hooks/useActiveHeading.js";
import useAsyncValue from "../hooks/useAsyncValue.js";
import useScrollTop from "../hooks/useScrollTop.js";
import PostTags from "../components/PostTags.jsx";
import StatusMessage from "../components/StatusMessage.jsx";
import { formatDate } from "../utils/date.js";

function BlogPostEmptyState({ title, description }) {
  return (
    <section className="blog-post-empty-state" aria-live="polite">
      <div className="blog-post-empty-copy">
        <p className="blog-post-empty-kicker">Blog</p>
        <h1 className="blog-post-empty-title">{title}</h1>
        {description ? (
          <p className="blog-post-empty-description">{description}</p>
        ) : null}
      </div>
      <Link className="blog-back blog-back-empty" to={ROUTES.blog}>
        Back to blog
      </Link>
    </section>
  );
}

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
  const headings = useMemo(() => getHeadingsFromBlocks(post?.blocks), [post?.blocks]);
  const activeHeadingId = useActiveHeading(headings);

  const backLink = (
    <Link className="blog-back blog-back-icon" to={ROUTES.blog} aria-label="Back to blog">
      <span aria-hidden="true">←</span>
      <span className="sr-only">Back to blog</span>
    </Link>
  );

  if (state === "loading") {
    return (
      <main className="page blog-post blog-post-empty-page">
        <StatusMessage>Loading post...</StatusMessage>
      </main>
    );
  }

  if (state === "error") {
    const isNotFound = error?.status === 404;
    return (
      <main className="page blog-post blog-post-empty-page">
        <BlogPostEmptyState
          title={isNotFound ? "Not Found" : "Unable to load post"}
          description={
            isNotFound
              ? "The post you are looking for does not exist or is no longer available."
              : "Something went wrong while loading this post."
          }
        />
      </main>
    );
  }

  if (!post) {
    return (
      <main className="page blog-post blog-post-empty-page">
        <BlogPostEmptyState
          title="Not Found"
          description="The post you are looking for does not exist or is no longer available."
        />
      </main>
    );
  }

  return (
    <main className="page blog-post">
      <div className={`blog-post-layout${headings.length ? " has-toc" : ""}`}>
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

        {headings.length ? (
          <aside className="blog-post-toc-rail" aria-label="Table of contents">
            <div className="blog-post-toc">
              <p className="blog-post-toc-title">Contents</p>
              <nav className="blog-post-toc-links">
                {headings.map((heading) => (
                  <a
                    aria-current={activeHeadingId === heading.id ? "location" : undefined}
                    className={`blog-post-toc-link level-${heading.level}${
                      activeHeadingId === heading.id ? " is-active" : ""
                    }`}
                    href={`#${heading.id}`}
                    key={heading.id}
                  >
                    {heading.text}
                  </a>
                ))}
              </nav>
            </div>
          </aside>
        ) : null}
      </div>
    </main>
  );
}
