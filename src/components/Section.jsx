export default function Section({ id, title, description, children }) {
  return (
    <section className="section" id={id}>
      <header className="section-header">
        <h2 className="section-title">{title}</h2>
        {description ? (
          <p className="section-description">{description}</p>
        ) : null}
      </header>
      {children}
    </section>
  );
}
