export default function EmptyState({ kicker, title, description, action }) {
  return (
    <section className="blog-post-empty-state" aria-live="polite">
      <div className="blog-post-empty-copy">
        {kicker ? <p className="blog-post-empty-kicker">{kicker}</p> : null}
        <h1 className="blog-post-empty-title">{title}</h1>
        {description ? (
          <p className="blog-post-empty-description">{description}</p>
        ) : null}
      </div>
      {action}
    </section>
  );
}
