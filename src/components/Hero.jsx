import ThemeToggle from "./ThemeToggle.jsx";

export default function Hero({ isDark, onToggleTheme }) {
  return (
    <header className="hero">
      <div className="hero-top">
        <p className="eyebrow">Seojun Bae</p>
        <ThemeToggle isDark={isDark} onToggle={onToggleTheme} />
      </div>
      <h1 className="headline">Personal VELOG For</h1>
      <p className="subhead">DEMO</p>
      <div className="actions">
        <a className="btn ghost" href="https://github.com/qotjwns">
          GitHub
        </a>
      </div>
    </header>
  );
}
