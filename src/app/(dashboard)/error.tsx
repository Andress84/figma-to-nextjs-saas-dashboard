"use client";

export default function DashboardError({ reset }: Readonly<{ reset: () => void }>) {
  return (
    <section className="placeholder-panel" aria-labelledby="dashboard-error-title">
      <p className="eyebrow">Dashboard error</p>
      <h1 id="dashboard-error-title">This section could not be loaded</h1>
      <p>Try the request again. No data has been changed.</p>
      <button className="button" type="button" onClick={reset}>
        Try again
      </button>
    </section>
  );
}
