// 역할: 사이트 상단 네비게이션과 테마 토글을 렌더링합니다.
import { Link } from "react-router-dom";
import ThemeToggle from "./ThemeToggle.jsx";
import { site } from "../content/site.js";
import { ROUTES } from "../constants/routes.js";
import useHeaderVisibility from "../hooks/useHeaderVisibility.js";

export default function TopBar({ isDark, onToggleTheme }) {
  const isVisible = useHeaderVisibility();

  return (
    <header className={`site-header ${isVisible ? "is-visible" : "is-hidden"}`}>
      <div className="site-nav">
        <Link className="brand" to={ROUTES.home}>
          {site.name}
        </Link>
        <div className="nav-actions">
          <nav className="nav-links" aria-label="Primary">
            {site.nav.map((item) => {
              const target = item.path || (item.id ? `/${item.id}` : ROUTES.home);
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
