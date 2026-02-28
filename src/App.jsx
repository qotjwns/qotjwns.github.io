// 역할: 사이트의 최상위 레이아웃과 페이지 라우팅을 구성합니다.
import { useEffect } from "react";
import { Link, Navigate, Route, Routes, useLocation } from "react-router-dom";
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
    </main>
  );
}

function StaticSectionPage({ title, description }) {
  return (
    <main className="page">
      <section className="section">
        <header className="section-header">
          <h1 className="section-title">{title}</h1>
          <p className="section-description">{description}</p>
        </header>
      </section>
    </main>
  );
}

function NotFoundPage() {
  return (
    <main className="page blog-post blog-post-empty-page">
      <section className="blog-post-empty-state" aria-live="polite">
        <div className="blog-post-empty-copy">
          <p className="blog-post-empty-kicker">404</p>
          <h1 className="blog-post-empty-title">Not Found</h1>
          <p className="blog-post-empty-description">
            The page you are looking for does not exist or is no longer available.
          </p>
        </div>
        <Link className="blog-back blog-back-empty" to={ROUTES.home}>
          Back home
        </Link>
      </section>
    </main>
  );
}

function ProjectDemoPage() {
  return (
    <StaticSectionPage
      title="Projects"
      description="Demo page. This section is intentionally left empty for now."
    />
  );
}

export default function App() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <>
      <TopBar isDark={isDark} onToggleTheme={toggleTheme} />
      <Routes>
        <Route path={ROUTES.home} element={<HomePage forcedSectionId="about" />} />
        <Route
          path={ROUTES.about}
          element={<Navigate to={ROUTES.home} replace />}
        />
        <Route
          path={ROUTES.project}
          element={<ProjectDemoPage />}
        />
        <Route path={ROUTES.blog} element={<BlogPage />} />
        <Route path={`${ROUTES.blog}/:slug`} element={<BlogPostPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <footer className="site-footer site-footer-global">{site.footer}</footer>
    </>
  );
}
