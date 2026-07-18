import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Tabs } from "./tabs";

const items = [
  { value: "all", label: "All" },
  { value: "active", label: "Active", disabled: true },
  { value: "trial", label: "Trial" },
  { value: "churned", label: "Churned" },
] as const;

describe("Tabs", () => {
  it("keeps one tab selected and uses controlled automatic keyboard activation", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const { rerender } = render(
      <Tabs items={items} value="all" onValueChange={onValueChange} label="Customer status" />,
    );

    const tabs = screen.getAllByRole("tab");
    expect(tabs.filter((tab) => tab.getAttribute("aria-selected") === "true")).toHaveLength(1);
    expect(screen.getByRole("tab", { name: "All", selected: true })).toHaveAttribute(
      "tabindex",
      "0",
    );

    screen.getByRole("tab", { name: "All" }).focus();
    await user.keyboard("{ArrowRight}");
    expect(onValueChange).toHaveBeenLastCalledWith("trial");
    expect(screen.getByRole("tab", { name: "Trial" })).toHaveFocus();

    rerender(
      <Tabs items={items} value="trial" onValueChange={onValueChange} label="Customer status" />,
    );
    await user.keyboard("{End}");
    expect(onValueChange).toHaveBeenLastCalledWith("churned");
    expect(screen.getByRole("tab", { name: "Churned" })).toHaveFocus();

    await user.keyboard("{Home}");
    expect(onValueChange).toHaveBeenLastCalledWith("all");
    expect(screen.getByRole("tab", { name: "All" })).toHaveFocus();
  });

  it("uses vertical arrow keys when vertically oriented", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <Tabs
        items={items}
        value="all"
        onValueChange={onValueChange}
        label="Settings sections"
        orientation="vertical"
      />,
    );

    screen.getByRole("tab", { name: "All" }).focus();
    await user.keyboard("{ArrowDown}");
    expect(onValueChange).toHaveBeenCalledWith("trial");
    expect(screen.getByRole("tab", { name: "Trial" })).toHaveFocus();
  });
});
