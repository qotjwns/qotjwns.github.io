export default function EntryList({ items }) {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <ul className="entry-list">
      {items.map((item, index) => {
        const key = item.title ? `${item.title}-${index}` : String(index);
        const hasDate = Boolean(item.date);
        return (
          <li
            className={`entry-item${hasDate ? "" : " no-date"}`}
            key={key}
          >
            <span className="entry-date">{item.date || ""}</span>
            <div className="entry-body">
              {item.href ? (
                <a className="entry-title" href={item.href}>
                  {item.title}
                </a>
              ) : (
                <span className="entry-title">{item.title}</span>
              )}
              {item.description ? (
                <p className="entry-description">{item.description}</p>
              ) : null}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
