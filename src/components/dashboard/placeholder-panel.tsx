interface PlaceholderPanelProps {
  body: string;
  label: string;
  title: string;
}

export function PlaceholderPanel({ body, label, title }: Readonly<PlaceholderPanelProps>) {
  return (
    <section className="placeholder-panel" aria-labelledby={`${label}-placeholder-title`}>
      <div className="placeholder-icon" aria-hidden="true">
        {label.slice(0, 2).toUpperCase()}
      </div>
      <div>
        <p className="eyebrow">Future module</p>
        <h2 id={`${label}-placeholder-title`}>{title}</h2>
        <p>{body}</p>
      </div>
    </section>
  );
}
