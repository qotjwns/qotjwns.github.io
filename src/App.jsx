import Hero from "./components/Hero.jsx";
import useTheme from "./hooks/useTheme.js";

export default function App() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="page">
      <Hero isDark={isDark} onToggleTheme={toggleTheme} />
    </div>
  );
}
