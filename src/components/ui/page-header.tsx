interface PageHeaderProps {
  description: string;
  eyebrow?: string;
  title: string;
}

export function PageHeader({ description, eyebrow, title }: Readonly<PageHeaderProps>) {
  return (
    <header className="page-header">
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <h1>{title}</h1>
      <p>{description}</p>
    </header>
  );
}
