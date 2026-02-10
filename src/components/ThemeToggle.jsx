export default function ThemeToggle({ isDark, onToggle }) {
  return (
    <button
      className="theme-toggle"
      type="button"
      onClick={onToggle}
      aria-pressed={isDark}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <span className="sr-only">
        {isDark ? "Switch to light mode" : "Switch to dark mode"}
      </span>
      {isDark ? (
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          role="img"
          focusable="false"
        >
          <path
            d="M20.5 14.6a8.5 8.5 0 1 1-8.1-11.1 6.8 6.8 0 1 0 8.1 11.1Z"
            fill="currentColor"
          />
        </svg>
      ) : (
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          role="img"
          focusable="false"
        >
          <path
            d="M12 3.5a.9.9 0 0 1 .9.9v1.6a.9.9 0 1 1-1.8 0V4.4a.9.9 0 0 1 .9-.9Z"
            fill="currentColor"
          />
          <path
            d="M6.04 5.3a.9.9 0 0 1 1.27 0l1.14 1.14a.9.9 0 1 1-1.27 1.27L6.04 6.58a.9.9 0 0 1 0-1.27Z"
            fill="currentColor"
          />
          <path
            d="M3.5 12a.9.9 0 0 1 .9-.9H6a.9.9 0 0 1 0 1.8H4.4a.9.9 0 0 1-.9-.9Z"
            fill="currentColor"
          />
          <path
            d="M6.04 18.7a.9.9 0 0 1 0-1.27l1.14-1.14a.9.9 0 1 1 1.27 1.27l-1.14 1.14a.9.9 0 0 1-1.27 0Z"
            fill="currentColor"
          />
          <path
            d="M12 18a.9.9 0 0 1 .9.9v1.6a.9.9 0 1 1-1.8 0v-1.6a.9.9 0 0 1 .9-.9Z"
            fill="currentColor"
          />
          <path
            d="M17.55 16.29a.9.9 0 0 1 1.27 0l1.14 1.14a.9.9 0 1 1-1.27 1.27l-1.14-1.14a.9.9 0 0 1 0-1.27Z"
            fill="currentColor"
          />
          <path
            d="M18 11.1a.9.9 0 0 1 .9-.9h1.6a.9.9 0 1 1 0 1.8h-1.6a.9.9 0 0 1-.9-.9Z"
            fill="currentColor"
          />
          <path
            d="M17.55 7.71a.9.9 0 0 1 0-1.27l1.14-1.14a.9.9 0 1 1 1.27 1.27L18.82 7.7a.9.9 0 0 1-1.27 0Z"
            fill="currentColor"
          />
          <path
            d="M12 7.6a4.4 4.4 0 1 1 0 8.8 4.4 4.4 0 0 1 0-8.8Z"
            fill="currentColor"
          />
        </svg>
      )}
    </button>
  );
}
