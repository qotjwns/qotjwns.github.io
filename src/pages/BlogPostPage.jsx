// 역할: 단일 블로그 글 상세 페이지를 불러와 렌더링합니다.
import { useMemo } from "react";
import { useParams } from "react-router-dom";
import BackLink from "../components/BackLink.jsx";
import EmptyState from "../components/EmptyState.jsx";
import NotionRenderer, {
  getHeadingsFromBlocks,
} from "../components/NotionRenderer.jsx";
import { fetchPost } from "../lib/notion.js";
import { ROUTES } from "../constants/routes.js";
import TableOfContents from "../components/TableOfContents.jsx";
import useActiveHeading from "../hooks/useActiveHeading.js";
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
  const headings = useMemo(() => getHeadingsFromBlocks(post?.blocks), [post?.blocks]);
  const activeHeadingId = useActiveHeading(headings);

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
        <EmptyState
          action={<BackLink label="Back to blog" to={ROUTES.blog} />}
          description={
            isNotFound
              ? "The post you are looking for does not exist or is no longer available."
              : "Something went wrong while loading this post."
          }
          kicker="Blog"
          title={isNotFound ? "Not Found" : "Unable to load post"}
        />
      </main>
    );
  }

  if (!post) {
    return (
      <main className="page blog-post blog-post-empty-page">
        <EmptyState
          action={<BackLink label="Back to blog" to={ROUTES.blog} />}
          description="The post you are looking for does not exist or is no longer available."
          kicker="Blog"
          title="Not Found"
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
              <BackLink label="Back to blog" to={ROUTES.blog} variant="icon" />
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

        <TableOfContents activeId={activeHeadingId} headings={headings} />
      </div>
    </main>
  );
}
