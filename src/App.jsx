import { useEffect } from "react";
import AboutSection from "./components/AboutSection.jsx";
import EntryList from "./components/EntryList.jsx";
import Section from "./components/Section.jsx";
import TopBar from "./components/TopBar.jsx";
import { site } from "./content/site.js";
import useTheme from "./hooks/useTheme.js";

export default function App() {
  const { isDark, toggleTheme } = useTheme();
  const defaultSectionId = site.sections?.[0]?.id;

  useEffect(() => {
    if (!defaultSectionId) {
      return;
    }
    if (window.location.hash) {
      return;
    }
    const target = document.getElementById(defaultSectionId);
    if (!target) {
      return;
    }
    target.scrollIntoView({ block: "start" });
  }, [defaultSectionId]);

  return (
    <>
      <TopBar isDark={isDark} onToggleTheme={toggleTheme} />
      <main className="page" id="top">
        {site.sections.map((section) => {
          if (section.kind === "about") {
            return (
              <AboutSection
                key={section.id}
                data={section}
                name={site.name}
              />
            );
          }

          return (
            <Section
              key={section.id}
              id={section.id}
              title={section.title}
              description={section.description}
            >
              <EntryList items={section.items} />
            </Section>
          );
        })}
        <footer className="site-footer">{site.footer}</footer>
      </main>
    </>
  );
}
