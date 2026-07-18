import { fireEvent, render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { Input } from "./input";
import { Select } from "./select";

describe("Input", () => {
  it("preserves native values and change events", () => {
    const onChange = vi.fn();
    render(<Input aria-label="Workspace name" defaultValue="Acme" onChange={onChange} />);

    const input = screen.getByRole("textbox", { name: "Workspace name" });
    fireEvent.change(input, { target: { value: "Subtera" } });

    expect(input).toHaveValue("Subtera");
    expect(onChange).toHaveBeenCalledOnce();
  });

  it("exposes disabled and invalid states and forwards its input ref", () => {
    const ref = createRef<HTMLInputElement>();
    render(<Input ref={ref} aria-label="Support email" disabled invalid />);

    const input = screen.getByRole("textbox", { name: "Support email" });
    expect(input).toBeDisabled();
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(ref.current).toBe(input);
  });
});

describe("Select", () => {
  it("preserves native values and change events", () => {
    const onChange = vi.fn();
    render(
      <Select aria-label="Time zone" defaultValue="utc" onChange={onChange}>
        <option value="utc">UTC</option>
        <option value="berlin">Europe/Berlin</option>
      </Select>,
    );

    const select = screen.getByRole("combobox", { name: "Time zone" });
    fireEvent.change(select, { target: { value: "berlin" } });

    expect(select).toHaveValue("berlin");
    expect(onChange).toHaveBeenCalledOnce();
  });

  it("exposes disabled and invalid states and forwards its select ref", () => {
    const ref = createRef<HTMLSelectElement>();
    render(
      <Select ref={ref} aria-label="Plan" disabled invalid>
        <option>Growth</option>
      </Select>,
    );

    const select = screen.getByRole("combobox", { name: "Plan" });
    expect(select).toBeDisabled();
    expect(select).toHaveAttribute("aria-invalid", "true");
    expect(ref.current).toBe(select);
  });
});
