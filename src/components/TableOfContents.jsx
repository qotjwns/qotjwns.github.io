export default function TableOfContents({ headings, activeId }) {
  if (!headings?.length) {
    return null;
  }

  return (
    <aside className="blog-post-toc-rail" aria-label="Table of contents">
      <div className="blog-post-toc">
        <p className="blog-post-toc-title">Contents</p>
        <nav className="blog-post-toc-links">
          {headings.map((heading) => (
            <a
              aria-current={activeId === heading.id ? "location" : undefined}
              className={`blog-post-toc-link level-${heading.level}${
                activeId === heading.id ? " is-active" : ""
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
  );
}
