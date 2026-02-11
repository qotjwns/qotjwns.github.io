import { Link } from "react-router-dom";
import ThemeToggle from "./ThemeToggle.jsx";
import { site } from "../content/site.js";

export default function TopBar({ isDark, onToggleTheme }) {
  return (
    <header className="site-header">
      <div className="site-nav">
        <Link className="brand" to="/">
          {site.name}
        </Link>
        <div className="nav-actions">
          <nav className="nav-links" aria-label="Primary">
            {site.nav.map((item) => {
              const target = item.path || (item.id ? `/${item.id}` : "/");
              return (
                <Link className="nav-link" to={target} key={item.label}>
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <ThemeToggle isDark={isDark} onToggle={onToggleTheme} />
        </div>
      </div>
    </header>
  );
}
