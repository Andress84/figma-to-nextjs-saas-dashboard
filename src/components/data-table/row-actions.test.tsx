import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { DataTableRowAction } from "./data-table-types";
import { RowActions } from "./row-actions";

interface TestRow {
  readonly id: string;
  readonly name: string;
}

const row = { id: "account-alpha", name: "Alpha" } as const satisfies TestRow;

function createActions(onView = vi.fn(), onArchive = vi.fn()) {
  return [
    { id: "view", label: "View details", onSelect: onView },
    { id: "archive", label: "Archive account", onSelect: onArchive },
  ] as const satisfies readonly DataTableRowAction<TestRow>[];
}

describe("RowActions", () => {
  it("opens with mouse, invokes the selected row action, and restores trigger focus", async () => {
    const user = userEvent.setup();
    const onView = vi.fn();
    render(<RowActions row={row} rowLabel="Alpha account" actions={createActions(onView)} />);

    const trigger = screen.getByRole("button", { name: "Actions for Alpha account" });
    await user.click(trigger);

    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("menu", { name: "Actions for Alpha account" })).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: "View details" })).toHaveFocus();

    await user.click(screen.getByRole("menuitem", { name: "View details" }));
    expect(onView).toHaveBeenCalledWith(row);
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    await waitFor(() => expect(trigger).toHaveFocus());
  });

  it("supports keyboard opening, arrow navigation, Escape dismissal, and focus restoration", async () => {
    const user = userEvent.setup();
    render(<RowActions row={row} rowLabel="Alpha account" actions={createActions()} />);

    const trigger = screen.getByRole("button", { name: "Actions for Alpha account" });
    trigger.focus();
    await user.keyboard("{ArrowDown}");

    const firstAction = screen.getByRole("menuitem", { name: "View details" });
    const secondAction = screen.getByRole("menuitem", { name: "Archive account" });
    expect(firstAction).toHaveFocus();
    await user.keyboard("{ArrowDown}");
    expect(secondAction).toHaveFocus();

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    await waitFor(() => expect(trigger).toHaveFocus());
  });

  it("dismisses on outside pointer interaction", async () => {
    const user = userEvent.setup();
    render(
      <div>
        <RowActions row={row} rowLabel="Alpha account" actions={createActions()} />
        <button type="button">Outside</button>
      </div>,
    );

    await user.click(screen.getByRole("button", { name: "Actions for Alpha account" }));
    expect(screen.getByRole("menu")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Outside" }));
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("positions the portalled menu inside the viewport and flips above near the lower edge", async () => {
    const user = userEvent.setup();
    vi.spyOn(HTMLButtonElement.prototype, "getBoundingClientRect").mockReturnValue({
      bottom: 756,
      height: 36,
      left: 980,
      right: 1016,
      top: 720,
      width: 36,
      x: 980,
      y: 720,
      toJSON: () => ({}),
    });
    Object.defineProperty(window, "innerWidth", { configurable: true, value: 1024 });
    Object.defineProperty(window, "innerHeight", { configurable: true, value: 768 });

    render(<RowActions row={row} rowLabel="Alpha account" actions={createActions()} />);
    await user.click(screen.getByRole("button", { name: "Actions for Alpha account" }));

    const menu = screen.getByRole("menu");
    expect(menu).toHaveAttribute("data-placement", "above");
    expect(Number.parseFloat(menu.style.left)).toBeGreaterThanOrEqual(8);
    expect(Number.parseFloat(menu.style.top)).toBeGreaterThanOrEqual(8);

    fireEvent.scroll(window);
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });
});
