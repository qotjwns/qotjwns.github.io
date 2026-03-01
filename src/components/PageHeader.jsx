export default function PageHeader({
  title,
  description,
  titleAs = "h1",
}) {
  const TitleTag = titleAs;

  return (
    <header className="section-header">
      <TitleTag className="section-title">{title}</TitleTag>
      {description ? (
        <p className="section-description">{description}</p>
      ) : null}
    </header>
  );
}
