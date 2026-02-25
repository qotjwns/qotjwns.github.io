// 역할: 소개(about) 섹션의 프로필/링크/뉴스/포스트 목록을 렌더링합니다.
import EntryList from "./EntryList.jsx";

function GitHubIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      focusable="false"
      className="intro-link-icon"
    >
      <path
        fill="currentColor"
        d="M12 .8a11.2 11.2 0 0 0-3.54 21.83c.56.1.76-.24.76-.54v-2.08c-3.11.68-3.77-1.33-3.77-1.33-.5-1.3-1.25-1.63-1.25-1.63-1.03-.7.08-.69.08-.69 1.13.08 1.72 1.16 1.72 1.16 1.01 1.72 2.65 1.22 3.3.93.1-.73.4-1.22.73-1.5-2.48-.28-5.09-1.24-5.09-5.52 0-1.22.44-2.22 1.15-3-.11-.28-.5-1.43.11-2.98 0 0 .94-.3 3.08 1.14a10.8 10.8 0 0 1 5.62 0c2.13-1.44 3.07-1.14 3.07-1.14.61 1.55.23 2.7.12 2.98.72.78 1.15 1.78 1.15 3 0 4.29-2.61 5.23-5.1 5.51.41.35.77 1.03.77 2.08v3.08c0 .3.2.65.77.54A11.2 11.2 0 0 0 12 .8Z"
      />
    </svg>
  );
}

export default function AboutSection({ data, name }) {
  const subsectionItems = [
    { title: data.newsTitle, items: data.news },
    { title: data.postsTitle, items: data.posts },
  ].filter((section) => Array.isArray(section.items) && section.items.length > 0);

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
          {data.links.map((link) => {
            const isGitHub = link.label.toLowerCase() === "github";
            return (
              <a className="intro-link" href={link.href} key={link.label}>
                {isGitHub ? <GitHubIcon /> : null}
                {link.label}
              </a>
            );
          })}
        </div>
      </header>

      {subsectionItems.length > 0 ? (
        <div
          className={`subsections${subsectionItems.length === 1 ? " single" : ""}`}
        >
          {subsectionItems.map((section) => (
            <div className="subsection" key={section.title}>
              <h2 className="subsection-title">{section.title}</h2>
              <EntryList items={section.items} />
            </div>
          ))}
        </div>
      ) : null}

      {data.closing ? <p className="closing">{data.closing}</p> : null}
    </section>
  );
}
