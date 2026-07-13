import { PageHeader } from "@/components/ui/page-header";
import { dashboardMetrics } from "@/data/mock/dashboard-overview";

export function DashboardOverview() {
  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Overview"
        title="Dashboard foundation"
        description="The responsive shell, route architecture, design-token foundation, and quality tooling are ready for the future Figma implementation."
      />
      <section className="metric-grid" aria-label="Future dashboard metrics">
        {dashboardMetrics.map((metric) => (
          <article className="metric-placeholder" key={metric.label}>
            <span>{metric.label}</span>
            <strong>{metric.value}</strong>
            <small>{metric.note}</small>
          </article>
        ))}
      </section>
      <section className="canvas-placeholder" aria-labelledby="canvas-placeholder-title">
        <div>
          <p className="eyebrow">Design handoff area</p>
          <h2 id="canvas-placeholder-title">Future analytics canvas</h2>
          <p>Charts, tables, and finalized visual styling intentionally begin in a later phase.</p>
        </div>
        <span className="canvas-grid" aria-hidden="true" />
      </section>
    </div>
  );
}
