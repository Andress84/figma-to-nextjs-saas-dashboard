import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PLAN_PERFORMANCE } from "@/data/mock/plans";
import { PlanRow } from "./plan-row";

describe("PlanRow", () => {
  it("formats raw plan performance while retaining a readable plan name", () => {
    render(<PlanRow performance={PLAN_PERFORMANCE[1]} />);

    expect(screen.getByText("Growth")).toBeVisible();
    expect(screen.getByText("· $29")).toBeVisible();
    expect(screen.getByText("900 · 31.6%")).toBeVisible();
    expect(screen.getByText("$26,100")).toBeVisible();
    expect(screen.getByText("MRR")).toBeVisible();

    const row = screen.getByRole("group", { name: "Growth plan performance" });
    expect(row.querySelector('[data-plan-color="lavender"]')).toHaveAttribute(
      "aria-hidden",
      "true",
    );
  });
});
