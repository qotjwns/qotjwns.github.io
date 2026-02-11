import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import AboutSection from "./components/AboutSection.jsx";
import EntryList from "./components/EntryList.jsx";
import Section from "./components/Section.jsx";
import TopBar from "./components/TopBar.jsx";
import { site } from "./content/site.js";
import useTheme from "./hooks/useTheme.js";
import BlogPage from "./pages/BlogPage.jsx";
import BlogPostPage from "./pages/BlogPostPage.jsx";
import { ROUTES } from "./constants/routes.js";

function HomePage({ forcedSectionId }) {
  const location = useLocation();
  const defaultSectionId = site.sections?.[0]?.id;

  useEffect(() => {
    if (!defaultSectionId) {
      return;
    }
    const params = new URLSearchParams(location.search);
    const sectionId =
      forcedSectionId || params.get("section") || defaultSectionId;
    const target = document.getElementById(sectionId);
    if (!target) {
      window.scrollTo({ top: 0 });
      return;
    }
    target.scrollIntoView({ block: "start" });
  }, [defaultSectionId, forcedSectionId, location.search]);

  return (
    <main className="page" id="top">
      {site.sections.map((section) => {
        if (section.kind === "about") {
          return (
            <AboutSection key={section.id} data={section} name={site.name} />
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
  );
}

function NotFoundPage() {
  return (
    <main className="page">
      <section className="section">
        <header className="section-header">
          <h1 className="section-title">Page not found</h1>
          <p className="section-description">
            The page you are looking for does not exist.
          </p>
        </header>
      </section>
    </main>
  );
}

export default function App() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <>
      <TopBar isDark={isDark} onToggleTheme={toggleTheme} />
      <Routes>
        <Route path={ROUTES.home} element={<HomePage />} />
        <Route path={ROUTES.about} element={<HomePage forcedSectionId="about" />} />
        <Route
          path={ROUTES.project}
          element={<HomePage forcedSectionId="project" />}
        />
        <Route path={ROUTES.blog} element={<BlogPage />} />
        <Route path={`${ROUTES.blog}/:slug`} element={<BlogPostPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}
