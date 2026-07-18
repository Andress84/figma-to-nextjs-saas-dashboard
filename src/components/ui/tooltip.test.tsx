import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Tooltip } from "./tooltip";

function renderTooltip() {
  render(
    <Tooltip content="View help" delay={0}>
      <button type="button">Help</button>
    </Tooltip>,
  );

  return screen.getByRole("button", { name: "Help" });
}

describe("Tooltip", () => {
  it("opens on pointer hover, describes the trigger, and closes on pointer leave", () => {
    const trigger = renderTooltip();
    fireEvent.pointerEnter(trigger);

    const tooltip = screen.getByRole("tooltip");
    expect(tooltip).toHaveTextContent("View help");
    expect(trigger).toHaveAttribute("aria-describedby", tooltip.id);

    fireEvent.pointerLeave(trigger);
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    expect(trigger).not.toHaveAttribute("aria-describedby");
  });

  it("opens on focus and closes on blur", () => {
    const trigger = renderTooltip();
    fireEvent.focus(trigger);
    expect(screen.getByRole("tooltip")).toBeInTheDocument();

    fireEvent.blur(trigger);
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("closes on Escape without moving focus", () => {
    const trigger = renderTooltip();
    trigger.focus();
    fireEvent.focus(trigger);
    expect(screen.getByRole("tooltip")).toBeInTheDocument();

    fireEvent.keyDown(trigger, { key: "Escape" });
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });
});
