import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { SegmentedControl } from "./segmented-control";

const options = [
  { value: "revenue", label: "Revenue" },
  { value: "disabled", label: "Disabled", disabled: true },
  { value: "mrr", label: "MRR" },
] as const;

describe("SegmentedControl", () => {
  it("exposes single-selection radio semantics and skips disabled options", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const { rerender } = render(
      <SegmentedControl
        options={options}
        value="revenue"
        onValueChange={onValueChange}
        label="Revenue metric"
      />,
    );

    expect(screen.getByRole("radiogroup", { name: "Revenue metric" })).toBeInTheDocument();
    const radios = screen.getAllByRole("radio");
    expect(radios.filter((radio) => radio.getAttribute("aria-checked") === "true")).toHaveLength(1);
    expect(screen.getByRole("radio", { name: "Revenue", checked: true })).toHaveAttribute(
      "tabindex",
      "0",
    );

    screen.getByRole("radio", { name: "Revenue" }).focus();
    await user.keyboard("{ArrowRight}");
    expect(onValueChange).toHaveBeenLastCalledWith("mrr");
    expect(screen.getByRole("radio", { name: "MRR" })).toHaveFocus();

    rerender(
      <SegmentedControl
        options={options}
        value="mrr"
        onValueChange={onValueChange}
        label="Revenue metric"
      />,
    );
    await user.keyboard("{Home}");
    expect(onValueChange).toHaveBeenLastCalledWith("revenue");
    expect(screen.getByRole("radio", { name: "Revenue" })).toHaveFocus();

    rerender(
      <SegmentedControl
        options={options}
        value="revenue"
        onValueChange={onValueChange}
        label="Revenue metric"
      />,
    );
    await user.keyboard("{End}");
    expect(onValueChange).toHaveBeenLastCalledWith("mrr");
    expect(screen.getByRole("radio", { name: "MRR" })).toHaveFocus();
  });
});
