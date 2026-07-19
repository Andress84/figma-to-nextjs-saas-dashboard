import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Sparkline } from "./sparkline";

function mockReducedMotion(matches: boolean) {
  vi.spyOn(window, "matchMedia").mockImplementation(
    (query: string): MediaQueryList => ({
      addEventListener: vi.fn(),
      addListener: vi.fn(),
      dispatchEvent: vi.fn(),
      matches,
      media: query,
      onchange: null,
      removeEventListener: vi.fn(),
      removeListener: vi.fn(),
    }),
  );
}

describe("Sparkline", () => {
  it("is decorative and excluded from the accessibility tree by default", () => {
    const { container } = render(<Sparkline data={[2, 4, 3, 7, 9]} tone="violet" />);
    const sparkline = container.querySelector(".chart-sparkline");

    expect(sparkline).toHaveAttribute("aria-hidden", "true");
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("supports an explicitly meaningful accessible mode", () => {
    render(
      <Sparkline
        data={[4.27, 4.1, 3.98, 3.84]}
        tone="success"
        decorative={false}
        label="Churn declined from 4.27% to 3.84%"
      />,
    );

    expect(screen.getByRole("img", { name: "Churn declined from 4.27% to 3.84%" })).toBeVisible();
  });

  it("disables Recharts entrance animation when reduced motion is requested", () => {
    mockReducedMotion(true);
    const { container } = render(<Sparkline data={[2, 4, 6]} />);

    expect(container.querySelector(".chart-sparkline")).toHaveAttribute(
      "data-animation-active",
      "false",
    );
  });
});
