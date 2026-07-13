export function TopHeader() {
  return (
    <header className="top-header">
      <div>
        <p className="top-header-label">Portfolio project</p>
        <p className="top-header-context">Figma-to-Next.js workflow</p>
      </div>
      <span className="environment-badge">
        <span className="status-dot" aria-hidden="true" />
        Local demo
      </span>
    </header>
  );
}
