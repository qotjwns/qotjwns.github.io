export default function ThemeToggle({ isDark, onToggle }) {
  return (
    <button
      className="theme-toggle"
      type="button"
      onClick={onToggle}
      aria-pressed={isDark}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? "Light mode" : "Dark mode"}
    </button>
  );
}
