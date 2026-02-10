import EntryList from "./EntryList.jsx";

export default function AboutSection({ data, name }) {
  const roleNode = data.roleParts
    ? data.roleParts.map((part, i) =>
        typeof part === "string" ? (
          <span key={i}>{part}</span>
        ) : (
          <a
            key={i}
            href={part.href}
            target="_blank"
            rel="noreferrer"
            className="intro-role-link"
          >
            {part.label}
          </a>
        )
      )
    : data.role;

  return (
    <section className="about" id={data.id}>
      <header className="intro">
        <h1 className="intro-name">{name}</h1>
        <p className="intro-role">{roleNode}</p>

        <div className="intro-text">
          {data.intro.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>

        <div className="intro-links">
          {data.links.map((link) => (
            <a className="intro-link" href={link.href} key={link.label}>
              {link.label}
            </a>
          ))}
        </div>
      </header>

      <div className="subsections">
        <div className="subsection">
          <h2 className="subsection-title">{data.newsTitle}</h2>
          <EntryList items={data.news} />
        </div>
        <div className="subsection">
          <h2 className="subsection-title">{data.postsTitle}</h2>
          <EntryList items={data.posts} />
        </div>
      </div>

      {data.closing ? <p className="closing">{data.closing}</p> : null}
    </section>
  );
}