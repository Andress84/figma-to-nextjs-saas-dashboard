import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Avatar } from "./avatar";
import { Badge, type BadgeVariant } from "./badge";
import { Card } from "./card";

describe("Badge", () => {
  it.each([
    ["neutral", "Paused"],
    ["success", "Paid"],
    ["warning", "Pending"],
    ["error", "Failed"],
    ["information", "Trial"],
    ["violet", "Selected"],
  ] satisfies ReadonlyArray<
    readonly [BadgeVariant, string]
  >)("keeps readable text in the %s presentation", (variant, text) => {
    render(
      <Badge variant={variant} decorativeDot>
        {text}
      </Badge>,
    );

    expect(screen.getByText(text)).toBeVisible();
  });
});

describe("Avatar", () => {
  it("derives and limits initials deterministically in meaningful mode", () => {
    render(<Avatar name="Maya Chen Rivera" />);

    expect(screen.getByRole("img", { name: "Maya Chen Rivera" })).toHaveTextContent("MC");
  });

  it("renders a deterministic accessible icon fallback", () => {
    const { container } = render(<Avatar name="Maya Chen" fallback="icon" />);

    expect(screen.getByRole("img", { name: "Maya Chen" })).toBeInTheDocument();
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("removes decorative avatars from the accessibility tree", () => {
    const { container } = render(<Avatar name="Maya Chen" initials="MC" decorative />);

    expect(container.firstElementChild).toHaveAttribute("aria-hidden", "true");
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });
});

describe("Card", () => {
  it("renders a passive surface with the requested variant and padding", () => {
    render(
      <Card variant="highlighted" padding="compact">
        Revenue summary
      </Card>,
    );

    const card = screen.getByText("Revenue summary");
    expect(card).toHaveClass("ui-card--highlighted", "ui-card--padding-compact");
    expect(card).not.toHaveAttribute("tabindex");
    expect(card).not.toHaveAttribute("role");
  });
});
