import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { Toggle } from "./toggle";

function ToggleHarness({ disabled = false }: Readonly<{ disabled?: boolean }>) {
  const [checked, setChecked] = useState(false);
  return (
    <Toggle
      checked={checked}
      onCheckedChange={setChecked}
      label="Compare with previous period"
      disabled={disabled}
    />
  );
}

describe("Toggle", () => {
  it("exposes switch state and changes through click and native keyboard activation", async () => {
    const user = userEvent.setup();
    render(<ToggleHarness />);
    const toggle = screen.getByRole("switch", { name: "Compare with previous period" });

    expect(toggle).toHaveAttribute("aria-checked", "false");
    await user.click(toggle);
    expect(toggle).toHaveAttribute("aria-checked", "true");

    toggle.focus();
    await user.keyboard(" ");
    expect(toggle).toHaveAttribute("aria-checked", "false");
    await user.keyboard("{Enter}");
    expect(toggle).toHaveAttribute("aria-checked", "true");
  });

  it("blocks changes while disabled", async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(
      <Toggle
        checked={false}
        onCheckedChange={onCheckedChange}
        label="Disabled preference"
        disabled
      />,
    );

    const toggle = screen.getByRole("switch", { name: "Disabled preference" });
    expect(toggle).toBeDisabled();
    await user.click(toggle);
    expect(onCheckedChange).not.toHaveBeenCalled();
  });
});
