import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PageHeader } from "./page-header";

describe("PageHeader", () => {
  it("exposes the page title as a level-one heading", () => {
    render(
      <PageHeader
        eyebrow="Workspace"
        title="Analytics"
        description="A placeholder for the future analytics experience."
      />,
    );

    expect(screen.getByRole("heading", { level: 1, name: "Analytics" })).toBeInTheDocument();
    expect(screen.getByText(/future analytics experience/i)).toBeInTheDocument();
  });
});
