import ThemeToggle from "./ThemeToggle.jsx";
import { site } from "../content/site.js";

export default function TopBar({ isDark, onToggleTheme }) {
  return (
    <header className="site-header">
      <div className="site-nav">
        <a className="brand" href="/">
          {site.name}
        </a>
        <div className="nav-actions">
          <nav className="nav-links" aria-label="Primary">
            {site.sections.map((section) => (
              <a
                className="nav-link"
                href={`/${section.id}`}
                key={section.id}
              >
                {section.label}
              </a>
            ))}
          </nav>
          <ThemeToggle isDark={isDark} onToggle={onToggleTheme} />
        </div>
      </div>
    </header>
  );
}
